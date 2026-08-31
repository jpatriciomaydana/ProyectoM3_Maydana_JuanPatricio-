# 🧅 Shrek Chat — Proyecto Integrador M3 (FT77)

¡Bienvenido/a al repositorio de **Shrek Chat**! Este proyecto consiste en el desarrollo de una **Single Page Application** que permite a los usuarios chatear con Shrek, el ogro de la saga de películas, utilizando **Google Gemini AI**.

El proyecto está construido con **JavaScript vanilla** (sin frameworks) para el frontend, routing propio con **History API**, y una **Vercel Serverless Function** que actúa como proxy seguro entre el cliente y la API de Gemini.

---

## 🚀 Despliegue en Producción (Vercel)

La aplicación se encuentra desplegada y operativa en:

* 🌐 **URL Pública:** [https://proyecto-m3-juan-patricio-maydana-f.vercel.app](https://proyecto-m3-juan-patricio-maydana-f.vercel.app)

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 (mobile-first, Flexbox, media queries), JavaScript vanilla (ES Modules)
* **Routing:** History API (`pushState`, `popstate`)
* **IA:** Google Gemini AI (`gemini-flash-lite-latest`) vía SDK `@google/generative-ai`
* **Backend:** Vercel Serverless Functions (proxy seguro, oculta la API key del cliente)
* **Testing:** Vitest
* **Variables de Entorno:** Dotenv (`.env` local) / Environment Variables de Vercel (producción)
* **Despliegue:** Vercel (conectado a GitHub, deploy automático en cada push a `main`)

---

## 📂 Arquitectura del Proyecto

```text
├── api/
│   └── chat.js              # Serverless Function: proxy seguro a Gemini AI
│
├── src/
│   ├── index.html
│   ├── index.css             # Estilos mobile-first + media queries (tablet/desktop)
│   ├── main.js                # Punto de entrada: arranca routing y navegación
│   ├── navigation.js          # Intercepción de clicks en links + pushState
│   ├── router.js               # Mapeo de rutas (/, /chat, /about) a vistas
│   ├── utils.js                # Transformación de mensajes y parseo de respuestas de Gemini
│   └── views/
│       ├── home.js             # Vista de bienvenida
│       ├── chat.js             # Vista de chat (estado, render, envío de mensajes)
│       ├── about.js            # Vista de información del proyecto
│       └── notFound.js         # Vista 404
│
├── test/
│   └── utils.test.js           # Tests unitarios con Vitest
│
├── .env                         # Variables de entorno (no se sube al repo)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🎭 Personaje y System Prompt

El personaje elegido es **Shrek**, con una personalidad sarcástica, gruñona y de humor negro, definida mediante un *system prompt* que vive en el servidor (`src/views/chat.js`, enviado a la Serverless Function en cada request) — nunca en el cliente de forma editable por el usuario. El prompt define:

* Tono y personalidad (sarcástico, cínico, ocasionalmente protector)
* Muletillas y expresiones recurrentes del personaje
* Límite de longitud de respuesta (apropiado para chat)
* Límites de comportamiento (sale de personaje ante consultas médicas/legales/financieras serias, no inventa datos de actualidad, nunca revela que es una IA)

---

## ⚙️ Configuración e Instalación Local

### Prerrequisitos

* Node.js (v18 o superior)
* npm
* Vercel CLI (`npm install -g vercel`)
* Una API key de [Google AI Studio](https://aistudio.google.com/) (nivel gratuito)

### Pasos de Instalación

**1. Clonar el repositorio:**

```bash
git clone https://github.com/jpatriciomaydana/ProyectoM3_Maydana_JuanPatricio-.git
cd ProyectoM3_Maydana_JuanPatricio-
```

**2. Instalar dependencias:**

```bash
npm install
```

**3. Configurar variables de entorno:**

Copiá el archivo `.env.example` y renombralo a `.env`:

```bash
cp .env.example .env
```

Completá tu API key de Gemini en el `.env`:

```
GEMINI_API_KEY=tu_api_key_aca
```

**4. Iniciar el servidor en desarrollo:**

```bash
vercel dev
```

> Se usa `vercel dev` (y no un servidor estático simple como Live Server) porque el proyecto incluye una Serverless Function en `/api` que necesita ese entorno para ejecutarse en local, replicando el comportamiento de producción.

La aplicación estará disponible en `http://localhost:3000`.

---

## ▲ Guía de Deployment en Vercel

### Cómo se desplegó

1. Se instaló Vercel CLI y se generó un proyecto local con `vercel dev` / `vercel link`.
2. Se conectó el proyecto de Vercel al repositorio de GitHub desde **Settings → Git** en el dashboard (deploy automático en cada `git push` a `main`).
3. Vercel detecta automáticamente los archivos dentro de `/api` como Serverless Functions, sin configuración adicional.
4. Se configuró la variable de entorno con la API key (ver abajo) y se disparó el primer deploy de producción.

### Variables de entorno en Vercel

En el proyecto, dentro de **Settings → Environment Variables**, configurar:

| Variable | Valor | Entorno |
|---|---|---|
| `GEMINI_API_KEY` | Tu API key de Google AI Studio | Production |

> Nunca se expone esta key en el código del cliente: solo la lee la Serverless Function (`api/chat.js`) del lado del servidor, vía `process.env.GEMINI_API_KEY`.

---

## 🧪 Testing Automatizado

El proyecto cuenta con una suite de tests unitarios desarrollada con **Vitest**, enfocada en las funciones puras de transformación de datos (sin dependencia de red).

### Cobertura de Tests (5/5 Pasados):

**Utils** (`test/utils.test.js`):
* `buildGeminiPayload`: convierte los mensajes internos (`{role, text}`) al formato que espera la API de Gemini (`contents` con `role`/`parts`).
* `buildGeminiPayload`: arma correctamente el `systemInstruction` a partir del system prompt.
* `buildGeminiPayload`: incluye `generationConfig` (temperature, maxOutputTokens).
* `parseGeminiReply`: extrae el texto de una respuesta válida de Gemini.
* `parseGeminiReply`: lanza un error controlado cuando la respuesta no contiene texto.


### Ejecución de Tests

```bash
npm run test
```

---

## 🤖 Declaración sobre el uso de Inteligencia Artificial

<!--
Completar acá:
- Qué prompts se utilizaron durante el desarrollo (ej: definición del system prompt de Shrek, debugging de errores de routing/casing de archivos, estructura de la serverless function, etc.)
- Cómo influyeron en la implementación
- Qué decisiones se tomaron a partir de las respuestas generadas
-->

---

## 👤 Autor

Juan Patricio Maydana — Estudiante de Desarrollo Full Stack (FT77)