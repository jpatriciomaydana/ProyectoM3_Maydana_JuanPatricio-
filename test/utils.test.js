import { describe, it, expect } from "vitest";
import { buildGeminiPayload, parseGeminiReply } from "../src/utils.js";

describe("buildGeminiPayload", () => {
  it("convierte mensajes del usuario y del personaje al formato de Gemini", () => {
    const messages = [
      { role: "user", text: "Hola" },
      { role: "character", text: "¿Que queres, Burro?" },
    ];

    const payload = buildGeminiPayload(messages, "Sos Shrek");

    expect(payload.contents).toEqual([
      { role: "user", parts: [{ text: "Hola" }] },
      { role: "model", parts: [{ text: "¿Que queres, Burro?" }] },
    ]);
  });

  it("incluye el system prompt dentro de systemInstruction", () => {
    const payload = buildGeminiPayload([{ role: "user", text: "Hola" }], "Sos Shrek, el ogro");

    expect(payload.systemInstruction).toEqual({
      parts: [{ text: "Sos Shrek, el ogro" }],
    });
  });

  it("incluye generationConfig con temperature y maxOutputTokens", () => {
    const payload = buildGeminiPayload([{ role: "user", text: "Hola" }], "prompt");

    expect(payload.generationConfig).toHaveProperty("temperature");
    expect(payload.generationConfig).toHaveProperty("maxOutputTokens");
  });
});

describe("parseGeminiReply", () => {
  it("extrae el texto de una respuesta valida de Gemini", () => {
    const data = {
      candidates: [
        { content: { parts: [{ text: "Mejor afuera que adentro, *grup*" }] } },
      ],
    };

    expect(parseGeminiReply(data)).toBe("Mejor afuera que adentro, *grup*");
  });

  it("lanza un error si la respuesta no tiene texto", () => {
    const data = { candidates: [] };

    expect(() => parseGeminiReply(data)).toThrow("Respuesta vacía de la IA");
  });
});