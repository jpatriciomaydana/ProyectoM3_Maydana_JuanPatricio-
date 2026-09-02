import { characters } from "../characters.js";
import { navigateTo } from "../navigation.js";

export function renderHome() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <section class="view view--home">
      <div class="homeHeader">
        <h1 class="homeHeader__title">Chatea con tu personaje favorito</h1>
        <p class="homeHeader__description">
          Experimenta una conversación inmersiva con personajes de la saga Shrek
          impulsada por Inteligencia Artificial. Elegí tu personaje preferido y
          empezá a chatear.
        </p>
      </div>

      <div class="characterGallery">
        ${characters
          .map(
            (c) => `
          <button class="characterCard" data-id="${c.id}" style="--card-accent: ${c.themeColor}">
            ${
              c.avatarImg
                ? `<img class="characterCard__avatarImg" src="${c.avatarImg}" alt="${c.name}" />`
                : `<span class="characterCard__avatar">${c.avatar}</span>`
            }
            <span class="characterCard__name">${c.name}</span>
            <span class="characterCard__tagline">${c.tagline}</span>
          </button>
        `
          )
          .join("")}
      </div>
    </section>
  `;

  document.querySelectorAll(".characterCard").forEach((card) => {
    card.addEventListener("click", () => {
      const charId = card.dataset.id;
      localStorage.setItem("selectedCharacter", charId);
      navigateTo(`/chat?id=${charId}`);
    });
  });
}