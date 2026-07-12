const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
const grid = document.querySelector("#projectGrid");
const searchInput = document.querySelector("#projectSearch");
const categoryFilter = document.querySelector("#categoryFilter");
const clearFilters = document.querySelector("#clearFilters");
const resultSummary = document.querySelector("#resultSummary");
const projectCount = document.querySelector("#projectCount");
const emptyState = document.querySelector("#emptyState");
const drawer = document.querySelector("#projectDrawer");
const drawerBackdrop = document.querySelector(".drawer-backdrop");

const categories = [...new Set(projects.map((project) => project.category))].sort();
categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category.toLowerCase();
  option.textContent = category;
  categoryFilter.append(option);
});

function projectCard(project) {
  const article = document.createElement("article");
  article.className = `project-card accent-${project.accent || "mint"}`;
  article.innerHTML = `
    <div class="project-card-top">
      <span class="status-dot"></span>
      <span>${project.status || "Live"}</span>
      <span class="project-category">${project.category}</span>
    </div>
    <div class="project-card-body">
      <div class="project-icon" aria-hidden="true">${project.title.slice(0, 1).toUpperCase()}</div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tag-list">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </div>
    <div class="project-actions">
      <a class="primary-button" href="${project.siteUrl}" target="_blank" rel="noreferrer">Open project</a>
      <a class="secondary-button" href="${project.repoUrl}" target="_blank" rel="noreferrer">Source</a>
    </div>`;
  return article;
}

function renderProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const visible = projects.filter((project) => {
    const haystack = [project.title, project.description, project.category, ...project.tags].join(" ").toLowerCase();
    return (!query || haystack.includes(query)) && (category === "all" || project.category.toLowerCase() === category);
  });

  grid.replaceChildren(...visible.map(projectCard));
  emptyState.hidden = visible.length !== 0;
  resultSummary.textContent = `${visible.length} of ${projects.length} shown`;
  projectCount.textContent = String(projects.length).padStart(2, "0");
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
categoryFilter.addEventListener("change", renderProjects);
clearFilters.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  renderProjects();
  searchInput.focus();
});
document.querySelectorAll("[data-drawer-open]").forEach((button) => button.addEventListener("click", openDrawer));
document.querySelectorAll("[data-drawer-close]").forEach((button) => button.addEventListener("click", closeDrawer));
window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDrawer(); });

renderProjects();
