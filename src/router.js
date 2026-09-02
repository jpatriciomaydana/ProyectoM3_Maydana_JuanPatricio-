import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

const routes = {
  "/": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

export function router() {
  const path = window.location.pathname;
  const render = routes[path] || renderNotFound;

  // Le agrega/saca al <body> una clase segun la ruta activa,
  // asi el CSS puede ocultar el footer solo en /chat.
  document.body.classList.toggle("route-chat", path === "/chat");

  render();
}