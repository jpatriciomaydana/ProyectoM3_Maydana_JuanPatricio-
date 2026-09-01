import { buildGeminiPayload, parseGeminiReply } from "../utils.js";
import {
  saveHistory,
  loadHistory,
  clearHistory,
  hasHistory,
  getLastSavedAt,
} from "../chatStorage.js";

const SYSTEM_PROMPT = `
Sos Shrek, el ogro malhumorado de la saga de películas Shrek.
PERSONALIDAD:
- Sarcástico, condescendiente, cínico, arisco, terco, independiente y nihilista, pero ocasionalmente afectivo y protector.
- Tratás al usuario como si fuera el Burro pero sin decirle que es el Burro.
- Usás expresiones recurrentes y muletillas como: "Mejor afuera que adentro, siempre lo he dicho", "¿Como si esas cosas pasaran? ¡Jajaja!", "A la vieja muerta me la bajan de la mesa", "¿Trabajando duro o durando en el trabajo?".
- Hablás de la vida con autoridad pero trivializás todo con humor negro.
REGLAS DE FORMATO:
- Respondés en MÁXIMO 3  líneas.
- Usás eructos ocasionales en medio de oraciones, variando la onomatopeya: "*grup*", "*urrp*", "*BRAP*".
-No uses demasiadoas muletillas en cada respuesta.
LÍMITES:
- Para temas médicos, legales o financieros serios: salite del personaje y aclará que sos un chatbot de ficción, sin dar consejos reales sobre esos temas.
- Si no sabés algo de la realidad actual (noticias, fechas recientes, eventos del mundo real), admitilo en personaje: estabas ocupado salvando a Fiona, peleando con Lord Farquaad, o algo por el estilo — nunca inventes datos como si fueran reales.
- Nunca digas que sos una inteligencia artificial ni rompas el personaje fuera de los casos de arriba.
`;

const WELCOME_MESSAGE = {
  role: "character",
  text: "¡Bienvenido al pantano... digo al chat! soy Shrek ¿en que te puedo ayudar?",
};

const state = {
  messages: loadHistory() ?? [WELCOME_MESSAGE],
  status: "idle", // 'idle' | 'loading' | 'error'
  error: null,
  lastUserMessage: null,
};

export function renderChat() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <div class="chatApp">
      <header class="chatHeader">
        <div class="chatHeader__identity">
          <img class="chatHeader__avatar" src="/public/img/shrek.png" alt="Shrek" />
          <h1 class="chatHeader__title">Chat con Shrek</h1>
        </div>
        <div class="chatHeader__actions">
          ${renderHistoryIndicator()}
          <button class="clearHistoryBtn" id="clearHistoryBtn" type="button">
            Borrar historial
          </button>
        </div>
      </header>

      <main class="chatMessages" id="chatMessages" aria-live="polite">
        ${renderMessages()}
        ${renderStatus()}
      </main>

      <form class="chatComposer" id="chatComposer">
        <input
          class="chatComposer__input"
          id="chatInput"
          type="text"
          placeholder="Escribe un mensaje..."
          aria-label="Escribe tu mensaje"
          ${state.status === "loading" ? "disabled" : ""}
        />
        <button class="chatComposer__send" type="submit" ${state.status === "loading" ? "disabled" : ""}>
          Enviar
        </button>
      </form>
    </div>
  `;

  setupChat();
  scrollToBottom();
}

function renderMessages() {
  return state.messages
    .map(
      (msg) => `
    <div class="message message--${msg.role}">${escapeHtml(msg.text)}</div>
  `,
    )
    .join("");
}

function renderStatus() {
  if (state.status === "loading") {
    return `<div class="message message--character message--typing">Sacando cera de oído para pensar...</div>`;
  }

  if (state.status === "error") {
    return `
      <div class="message message--error">
        ${state.error}
        <button class="message__retry" id="retryBtn" type="button">Reintentar</button>
      </div>
    `;
  }

  return "";
}

function renderHistoryIndicator() {
  if (!hasHistory()) return "";
  const savedAt = getLastSavedAt();
  const time = savedAt
    ? new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return `<p class="historyIndicator">Historial guardado${time ? ` · ${time}` : ""}</p>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setState(updates) {
  Object.assign(state, updates);
  if (updates.messages) {
    saveHistory(state.messages);
  }
  renderChat();
}

function setupChat() {
  const $form = document.querySelector("#chatComposer");
  const $input = document.querySelector("#chatInput");
  const $retry = document.querySelector("#retryBtn");
  const $clearBtn = document.querySelector("#clearHistoryBtn");

  $form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = $input.value.trim();
    if (!text) return;

    sendMessage(text);
    $input.value = "";
    document.querySelector("#chatInput")?.focus();
  });

  $retry?.addEventListener("click", () => {
    if (state.lastUserMessage) {
      sendMessage(state.lastUserMessage, true);
    }
  });

  $clearBtn?.addEventListener("click", () => {
    const confirmado = confirm("¿Borrar todo el historial de la charla con Shrek?");
    if (!confirmado) return;

    clearHistory();
    // Reset directo (sin pasar por setState) para no volver a guardar
    // el mensaje de bienvenida apenas se borra el historial.
    Object.assign(state, {
      messages: [WELCOME_MESSAGE],
      status: "idle",
      error: null,
      lastUserMessage: null,
    });
    renderChat();
  });

  $input.focus();
}

async function sendMessage(text, isRetry = false) {
  if (!isRetry) {
    setState({
      messages: [...state.messages, { role: "user", text }],
      status: "loading",
      error: null,
      lastUserMessage: text,
    });
  } else {
    setState({ status: "loading", error: null });
  }

  try {
    const reply = await getCharacterReply(state.messages);
    setState({
      messages: [...state.messages, { role: "character", text: reply }],
      status: "idle",
      error: null,
      lastUserMessage: null,
    });
  } catch {
    setState({
      status: "error",
      error: "Ups, no te pude responder. Reintentalo.",
    });
  }
}

function scrollToBottom() {
  const $messages = document.querySelector("#chatMessages");
  if ($messages) {
    $messages.scrollTop = $messages.scrollHeight;
  }
}

async function getCharacterReply(messages) {
  const payload = buildGeminiPayload(messages, SYSTEM_PROMPT);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error al conectar con la IA");
  }

  const data = await res.json();
  return parseGeminiReply(data);
}