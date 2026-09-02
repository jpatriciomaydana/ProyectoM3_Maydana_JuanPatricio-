export function setupNavigation(router) {
  setupLinkInterception(router);
}

export function setupLinkInterception(router) {
  if (typeof router === "function") {
    window.handleRoute = router;
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    e.preventDefault();
    const targetPath = link.getAttribute("href");

    if (targetPath === "/chat") {
      const selectedId = localStorage.getItem("selectedCharacter") || "shrek";
      navigateTo(`/chat?id=${selectedId}`);
    } else {
      navigateTo(targetPath);
    }
  });

  window.addEventListener("popstate", () => {
    if (typeof window.handleRoute === "function") {
      window.handleRoute();
    }
  });
}

export function navigateTo(url) {
  window.history.pushState(null, null, url);

  if (typeof window.handleRoute === "function") {
    window.handleRoute();
  } else {
    window.dispatchEvent(new Event("popstate"));
  }
}