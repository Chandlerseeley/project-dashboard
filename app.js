const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
const grid = document.querySelector("#projectGrid");
const searchInput = document.querySelector("#projectSearch");
const emptyState = document.querySelector("#emptyState");
const drawer = document.querySelector("#projectDrawer");
const drawerBackdrop = document.querySelector(".drawer-backdrop");

function projectCard(project) {
  const article = document.createElement("article");
  article.className = `project-card accent-${project.accent || "mint"}`;
  article.innerHTML = `
    <div class="card-preview">
      <span class="card-mark" aria-hidden="true">${project.title.slice(0, 1).toUpperCase()}</span>
      <h2>${project.title}</h2>
    </div>
    <div class="card-actions">
      <a href="${project.siteUrl}" target="_blank" rel="noreferrer">Open project</a>
      <a href="${project.repoUrl}" target="_blank" rel="noreferrer">Source</a>
    </div>`;
  return article;
}

function renderProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = projects.filter((project) => {
    const terms = [project.title, project.description, project.category, ...(project.tags || [])].join(" ").toLowerCase();
    return !query || terms.includes(query);
  });
  grid.replaceChildren(...visible.map(projectCard));
  emptyState.hidden = visible.length !== 0;
}

function openDrawer() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.body.classList.remove("drawer-open");
}

searchInput.addEventListener("input", renderProjects);
document.querySelectorAll("[data-drawer-open]").forEach((button) => button.addEventListener("click", openDrawer));
document.querySelectorAll("[data-drawer-close]").forEach((button) => button.addEventListener("click", closeDrawer));
window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDrawer(); });
renderProjects();
