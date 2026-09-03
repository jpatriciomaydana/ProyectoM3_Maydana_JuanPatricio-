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

  // marca como activo el link de navegación que corresponde a la ruta actual
  updateActiveNavLink(path);

  render();
}

function updateActiveNavLink(path) {
  document.querySelectorAll(".mainNav__link").forEach(($link) => {
    const linkPath = new URL($link.href).pathname;
    const isActive = linkPath === path;

    $link.classList.toggle("mainNav__link--active", isActive);

    // aria-current se logra indicar a lectores de pantalla cuál es la página actual
    if (isActive) {
      $link.setAttribute("aria-current", "page");
    } else {
      $link.removeAttribute("aria-current");
    }
  });
}