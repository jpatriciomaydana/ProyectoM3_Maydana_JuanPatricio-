# 🧅 Shrek Chat — Proyecto Integrador M3 (FT77)

¡Bienvenido/a al repositorio de **Shrek Chat**! Este proyecto consiste en el desarrollo de una **Single Page Application (SPA)** interactiva que permite a los usuarios chatear en tiempo real con personajes de la saga de Shrek (Shrek, Burro y Galletita de Jengibre) utilizando la tecnología de **Google Gemini AI**.

El proyecto está construido con **JavaScript vanilla** (sin frameworks) para el frontend, enrutamiento propio con **History API**, y una **Vercel Serverless Function** que actúa como proxy seguro entre el cliente y la API de Gemini.

---

## 🚀 Despliegue en Producción (Vercel)

La aplicación se encuentra desplegada y operativa en:

* 🌐 **URL Pública:** [https://proyecto-m3-juan-patricio-maydana-f.vercel.app](https://proyecto-m3-juan-patricio-maydana-f.vercel.app)

---

## ✨ Características Destacadas

* **Selección de Personajes:** Elige entre Shrek, Burro o Galletita de Jengibre para iniciar una conversación temática personalizada.
* **Persistencia e Historial Independiente:** Los mensajes se guardan por personaje en `localStorage`, permitiendo reanudar o reiniciar el chat en cualquier momento.
* **Enrutamiento SPA Robustecido:** Navegación fluida entre `/`, `/chat` y `/about` con manejo de eventos `popstate` para asegurar que las flechas de retroceso y avance del navegador funcionen correctamente.
* **Manejo de Errores y Reintento:** Interfaz con estados de carga (typing) y alertas con opción de reintentar el envío de mensajes si falla la conexión.
* **Diseño Responsive:** Layout adaptativo (Mobile-First) estilizado con CSS3 utilizando una paleta de colores temáticos inspirados en el pantano.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 (Mobile-First, BEM, Flexbox, Media Queries), JavaScript Vanilla (ES Modules)
* **Routing:** History API (`pushState`, `popstate`)
* **IA:** Google Gemini AI via SDK `@google/genai`
* **Backend / Serverless:** Vercel Serverless Functions (Proxy seguro en Node.js que protege la API Key)
* **Persistencia Local:** `localStorage` API
* **Testing:** Vitest
* **Variables de Entorno:** Dotenv (`.env` local) / Environment Variables de Vercel (producción)
* **Despliegue:** Vercel (conectado a GitHub con CD automático)

---

## 📂 Arquitectura del Proyecto

```text
├── api/
│   └── chat.js                 # Serverless Function: Proxy seguro e inyección de System Prompts
├── screenshots/                # Evidencias de prompts e interacciones con IA
├── src/
│   ├── assets/                 # Recursos multimedia e imágenes de la aplicación
│   ├── views/                  # Vistas de la SPA (home.js, chat.js, about.js, notFound.js)
│   ├── characters.js           # Definición de personajes y configuraciones
│   ├── chatStorage.js          # Gestión de la persistencia en localStorage
│   ├── index.css               # Estilos globales y diseño temático mobile-first
│   ├── main.js                 # Inicialización y punto de entrada principal
│   ├── navigation.js           # Intercepción de eventos de clics e enlaces
│   ├── router.js               # Control de rutas y renderizado de la SPA
│   └── utils.js                # Funciones puras de formateo y parseo
├── test/
│   └── utils.test.js           # Suite de pruebas unitarias con Vitest
├── .env                        # Variables de entorno locales (gitignored)
├── .env.example
├── .gitignore
├── index.html                  # Contenedor HTML principal (#app)
├── package.json
├── package-lock.json
├── README.md
└── vercel.json                 # Configuración de rutas y funciones para Vercel

## 🎭 Personaje y System Prompt

Los personajes (Shrek, Burro y Galletita) cuentan con personalidades únicas definidas mediante System Prompts gestionados del lado del servidor en la Serverless Function (api/chat.js). De esta manera, el usuario no puede alterar las instrucciones del modelo desde el frontend.

Cada prompt define:

Tono y Personalidad: Respuestas sarcásticas para Shrek, parlanchinas y entusiastas para Burro, o temerosas/dulces para Galletita.

Límites de Respuesta: Mantener un formato conciso adecuado para un chat conversacional.

Restricciones de Comportamiento: Salir del personaje frente a temas serios/legales/médicos, no inventar actualidad y mantener la inmersión sin revelar el funcionamiento interno de la IA.


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

Durante el desarrollo de este proyecto integrador se hizo uso de asistentes de Inteligencia Artificial (Gemini / Claude) como herramientas de soporte técnico y de desarrollo para las siguientes tareas:

* **Depuración y Resolución de Errores** 
* **Diseño y Estructuración de API** 
* **Seguridad y Persistencia** Ñ
* **Estrategia de Testing y Arquitectura** 
> **Control y Responsabilidad:** Todas las soluciones y código generados con la asistencia de la IA fueron revisados, testeados, comprendidos y adaptados manualmente para garantizar el cumplimiento estricto de la consigna y las buenas prácticas del proyecto.

### 📷 Evidencias de Interacción con IA

En la carpeta screenshots se encuentran capturas de algunos ejemplos de prompts con la IA.

## 👤 Autor

Juan Patricio Maydana — Estudiante de Desarrollo Full Stack (FT77)