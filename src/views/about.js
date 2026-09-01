export function renderAbout() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <section class="view view--about">
    <div class="aboutApp"
      <h1 class="aboutHeader__title">¿Qué haces en mi Appantano?</h1>
      <p class="aboutHeader__subtitle">Construido desde lo más profundo del pantano...</p>
    
    </div>
    </section>

    <div class="aboutContent">
    <section class="aboutSection">
      <h2 class="aboutContent__title">¿Qué demonios es este sitio?</h2>
      <p>Es un chat inmersivo donde puedes hablar conmigo. Sí, exacto, con Shrek. ¿No tenías nada mejor que hacer?</p>
 
    <section class="aboutSection">
      <h2>¿Magia? ¡No, Inteligencia Artificial!</h2>
      <p>Detrás de mi voz hay una cosa llamada Inteligencia Artificial (Gemini). Básicamente, un hechizo moderno para que responda a tus preguntas sin tener que moverme del tronco.</p>
    </section>

    <section class="aboutSection">
      <h2>¿Quién es el culpable de esto?</h2>
      <p>Todo este código de JavaScript y CSS lo armó un Juan patricio Maydana para su proyecto SPA. Así que si algo falla, ¡échale la culpa a él, no a mí!</p>
    </section>
  </div>
  
 `;
}