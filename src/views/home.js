export function renderHome() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <section class="view view--home">
      <div class="homeHero">
        <div class="homeHero__content">
          <h1 class="homeHero__title">Chatea con tu personaje favorito</h1>
          <p class="homeHero__description">
            Experimenta una conversación inmersiva impulsada por AI. 
            Elige tu personaje preferido, haz preguntas, resuelve dudas o simplemente diviértete interactuando en tiempo real.
          </p>
          <a class="btn btn--primary homeHero__btn" href="/chat">Empezar a chatear</a>
        </div>
        
        <div class="homeHero__media">
          <img 
            src="/public/img/shrek.png" 
            alt="Shrek, el ogro protagonista, listo para chatear" 
            class="homeHero__img"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  `;
}