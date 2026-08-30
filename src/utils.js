export function buildGeminiPayload(messages, systemPrompt) {
  const contents = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  return {
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };
}

export function parseGeminiReply(data) {
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Respuesta vacía de la IA");
  }

  return text;
}