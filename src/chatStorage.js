// chatStorage.js
// Persistencia del historial de chat en localStorage.
// Proyecto "Chat con tu personaje favorito" (Shrek)

const STORAGE_KEY = "shrekChat_history";

/**
 * Guarda el array de mensajes junto con la hora de guardado.
 * messages: [{ role: "user" | "character", text: string }]
 */
export function saveHistory(messages) {
  try {
    const payload = { messages, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    // modo privado, cuota excedida, etc. — no debe romper el chat
    console.warn("No se pudo guardar el historial:", err);
    return false;
  }
}

/**
 * Devuelve el array de mensajes guardado, o null si no hay
 * nada guardado o el contenido está corrupto.
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      return null;
    }
    return parsed.messages;
  } catch (err) {
    console.warn("Historial corrupto, se descarta:", err);
    return null;
  }
}

/**
 * Borra el historial guardado.
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.warn("No se pudo borrar el historial:", err);
    return false;
  }
}

/**
 * true si hay historial guardado y válido.
 */
export function hasHistory() {
  return loadHistory() !== null;
}

/**
 * Timestamp (ms) del último guardado, o null.
 */
export function getLastSavedAt() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.savedAt ?? null;
  } catch {
    return null;
  }
}