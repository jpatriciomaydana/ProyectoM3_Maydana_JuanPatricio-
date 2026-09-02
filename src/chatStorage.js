// Persistencia del historial de chat en localStorage por personaje.
// Proyecto "Chat con tu personaje favorito" (Shrek)

const STORAGE_KEY = "shrekChat_history_v2";

function getStorageMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveHistory(characterId, messages) {
  try {
    const map = getStorageMap();
    map[characterId] = {
      messages,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch (err) {
    console.warn("No se pudo guardar el historial:", err);
    return false;
  }
}

export function loadHistory(characterId) {
  try {
    const map = getStorageMap();
    const entry = map[characterId];
    if (!entry || !Array.isArray(entry.messages) || entry.messages.length === 0) {
      return null;
    }
    return entry.messages;
  } catch (err) {
    console.warn("Historial corrupto, se descarta:", err);
    return null;
  }
}

export function clearHistory(characterId) {
  try {
    const map = getStorageMap();
    delete map[characterId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch (err) {
    console.warn("No se pudo borrar el historial:", err);
    return false;
  }
}

export function hasHistory(characterId) {
  return loadHistory(characterId) !== null;
}

export function getLastSavedAt(characterId) {
  try {
    const map = getStorageMap();
    return map[characterId]?.savedAt ?? null;
  } catch {
    return null;
  }
}