import { characters } from "../characters.js";
import {
  loadHistory,
  saveHistory,
  clearHistory,
} from "../chatStorage.js";

function getActiveCharacter() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlId = urlParams.get("id");
  const storageId = localStorage.getItem("selectedCharacter");

  const targetId = urlId || storageId;
  return characters.find((c) => c.id === targetId) || characters[0];
}

export function renderChat() {
  const character = getActiveCharacter();

  localStorage.setItem("selectedCharacter", character.id);

  const savedMessages = loadHistory(character.id);
  
  let initialMessages = [];
  if (savedMessages && savedMessages.length > 0) {
    initialMessages = savedMessages;
  } else {
    initialMessages = [
      {
        role: "character",
        text: character.welcomeMessage || `¡Hola! Soy ${character.name}. ¿En qué te puedo ayudar?`,
      },
    ];
    saveHistory(character.id, initialMessages);
  }

  const localState = {
    messages: initialMessages,
    status: "idle",
    error: null,
    lastUserMessage: null,
  };

  const app = document.querySelector("#app");

  function drawUI() {
    app.innerHTML = `
      <div class="chatApp">
        <header class="chatHeader" style="border-bottom-color: ${character.themeColor || "#d0d7b7"}">
          <div class="chatHeader__main">
            ${
              character.avatarImg
                ? `<img class="chatHeader__avatarImg" src="${character.avatarImg}" alt="${character.name}" />`
                : `<span class="chatHeader__avatar">${character.avatar}</span>`
            }
            <div class="chatHeader__info">
              <h1 class="chatHeader__title">Chat con ${escapeHtml(character.name)}</h1>
              <p class="chatHeader__subtitle">${escapeHtml(character.tagline || "")}</p>
            </div>
          </div>
          
          <button type="button" class="chatHeader__clearBtn" id="clearHistoryBtn">
            Borrar Historial
          </button>
        </header>

        <main class="chatMessages" id="chatMessages" aria-live="polite">
          ${renderMessages(localState.messages)}
          ${renderStatus(localState.status, localState.error, character)}
        </main>

        <form class="chatComposer" id="chatComposer">
          <input
            class="chatComposer__input"
            id="chatInput"
            type="text"
            placeholder="Escribe un mensaje..."
            aria-label="Escribe tu mensaje"
            ${localState.status === "loading" ? "disabled" : ""}
          />
          <button class="chatComposer__send" type="submit" ${localState.status === "loading" ? "disabled" : ""}>
            Enviar
          </button>
        </form>
      </div>
    `;

    setupChatListeners(character, localState, drawUI);
    scrollToBottom();
  }

  drawUI();
}

function renderMessages(messages) {
  return messages
    .map(
      (msg) =>
        `<div class="message message--${msg.role}">${escapeHtml(msg.text)}</div>`
    )
    .join("");
}

function renderStatus(status, error, character) {
  if (status === "loading") {
    const typingText = character?.typingText || character?.typingMessage || "Escribiendo...";
    return `<div class="message message--character message--typing">${escapeHtml(typingText)}</div>`;
  }

  if (status === "error") {
    return `
      <div class="message message--error">
        ${escapeHtml(error)}
        <button class="message__retry" id="retryBtn" type="button">Reintentar</button>
      </div>
    `;
  }

  return "";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setupChatListeners(character, localState, refreshView) {
  const $form = document.querySelector("#chatComposer");
  const $input = document.querySelector("#chatInput");
  const $retry = document.querySelector("#retryBtn");
  const $clearBtn = document.querySelector("#clearHistoryBtn");

  $form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = $input.value.trim();
    if (!text) return;

    handleSendMessage(text, character, localState, refreshView);
    if ($input) $input.value = "";
  });

  $retry?.addEventListener("click", () => {
    if (localState.lastUserMessage) {
      handleSendMessage(localState.lastUserMessage, character, localState, refreshView, true);
    }
  });

  $clearBtn?.addEventListener("click", () => {
    clearHistory(character.id);
    localState.messages = [
      {
        role: "character",
        text: character.welcomeMessage || `¡Hola! Soy ${character.name}. ¿En qué te puedo ayudar?`,
      },
    ];
    saveHistory(character.id, localState.messages);
    localState.status = "idle";
    localState.error = null;
    localState.lastUserMessage = null;
    refreshView();
  });

  $input?.focus();
}

async function handleSendMessage(text, character, localState, refreshView, isRetry = false) {
  const updatedMessages = isRetry
    ? localState.messages
    : [...localState.messages, { role: "user", text }];

  localState.messages = updatedMessages;
  localState.status = "loading";
  localState.error = null;
  if (!isRetry) localState.lastUserMessage = text;

  saveHistory(character.id, localState.messages);
  refreshView();

  try {
    const reply = await getCharacterReply(updatedMessages, character);
    localState.messages = [
      ...updatedMessages,
      { role: "character", text: reply },
    ];
    localState.status = "idle";
    localState.error = null;
    localState.lastUserMessage = null;

    saveHistory(character.id, localState.messages);
    refreshView();
  } catch (err) {
    console.error(err);
    localState.status = "error";
    localState.error = "Ups, no te pude responder. Reinténtalo.";
    refreshView();
  }
}

function scrollToBottom() {
  const $messages = document.querySelector("#chatMessages");
  if ($messages) {
    $messages.scrollTop = $messages.scrollHeight;
  }
}

async function getCharacterReply(messagesHistory, character) {
  const contents = messagesHistory.map((m) => ({
    role: m.role === "character" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: contents,
      systemInstruction: {
        parts: [{ text: character.systemPrompt || "Eres un personaje amable." }],
      },
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: Servidor devolvió un fallo.`);
  }

  const data = await response.json();

  const replyText =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    data.candidates?.[0]?.text ||
    "";

  if (!replyText) {
    throw new Error("Respuesta vacía del servidor.");
  }

  return replyText;
}