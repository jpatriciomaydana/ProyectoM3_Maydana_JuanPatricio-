# Chatea con Shrek 🧅

Single Page Application que permite chatear con Shrek (el ogro de la saga de películas) usando Google Gemini AI.

## 🔗 Demo en vivo

**[https://proyecto-m3-juan-patricio-maydana-f.vercel.app](https://proyecto-m3-juan-patricio-maydana-f.vercel.app)**

## Vistas

- `/` — Home: bienvenida y botón para empezar a chatear
- `/chat` — Chat con Shrek
- `/about` — Información sobre el proyecto

## Stack técnico

- HTML / CSS (mobile-first, Flexbox, media queries) / JavaScript vanilla
- Routing SPA con History API
- Google Gemini AI (`gemini-flash-lite-latest`) vía SDK `@google/generative-ai`
- Vercel Serverless Functions (proxy seguro para no exponer la API key)
- Vitest para tests unitarios
- Desplegado en Vercel

## Estructura del proyecto

```
├── api/
│   └── chat.js              # Serverless Function: proxy seguro a Gemini
│
├── src/
│   ├── index.html
│   ├── index.css
│   ├── main.js               # Punto de entrada, arranca routing
│   ├── navigation.js         # Intercepción de links + pushState
│   ├── router.js              # Mapeo de rutas a vistas
│   ├── utils.js               # Transformación de datos y parseo de respuestas de Gemini
│   └── views/
│       ├── home.js
│       ├── chat.js
│       ├── about.js
│       └── notFound.js
│
├── test/
│   └── utils.test.js          # Tests unitarios con Vitest
│
├── .env                        # Variables de entorno (no se sube al repo)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Cómo correr el proyecto en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/jpatriciomaydana/ProyectoM3_Maydana_JuanPatricio-.git
cd ProyectoM3_Maydana_JuanPatricio-
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la API key de Gemini

1. Generá una API key gratuita en [Google AI Studio](https://aistudio.google.com/).
2. Copiá el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
3. Abrí `.env` y pegá tu key:
   ```
   GEMINI_API_KEY=tu_key_aca
   ```

### 4. Instalar Vercel CLI (si no lo tenés)

```bash
npm install -g vercel
```

### 5. Correr el proyecto

```bash
vercel dev
```

La app queda disponible en `http://localhost:3000`.

> Nota: se usa `vercel dev` (y no un servidor estático simple) porque el proyecto incluye una Serverless Function en `/api` que necesita ese entorno para ejecutarse en local.

## Tests

```bash
npm run test
```

Corre los tests unitarios con Vitest sobre las funciones de transformación de datos (`src/utils.js`), sin necesidad de conexión real a la API.

## Despliegue

El proyecto está conectado a este repositorio de GitHub — cada push a `main` dispara un deploy automático en Vercel. La variable `GEMINI_API_KEY` está configurada como variable de entorno en el dashboard de Vercel (Production).

## Uso de IA en el desarrollo


- Qué prompts se utilizaron durante el desarrollo
- Cómo influyeron en la implementación
- Qué decisiones se tomaron a partir de las respuestas generadas
--