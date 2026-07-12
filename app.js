const baseProjects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
const storageKey = "project-dashboard-link-overrides";
let savedLinks = {};
try { savedLinks = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { savedLinks = {}; }
const projects = baseProjects.map((project) => ({ ...project, ...(savedLinks[project.slug] || {}) }));

const grid = document.querySelector("#projectGrid");
const searchInput = document.querySelector("#projectSearch");
const emptyState = document.querySelector("#emptyState");
const drawer = document.querySelector("#projectDrawer");
const drawerBackdrop = document.querySelector(".drawer-backdrop");
const editModal = document.querySelector("#editModal");
const editForm = document.querySelector("#editLinksForm");
const editTitle = document.querySelector("#editModalTitle");
const editSlug = document.querySelector("#editProjectSlug");
const editProjectTitle = document.querySelector("#editProjectTitle");
const editSiteUrl = document.querySelector("#editSiteUrl");
const editRepoUrl = document.querySelector("#editRepoUrl");
const editNotesUrl = document.querySelector("#editNotesUrl");

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function projectCard(project) {
  const article = document.createElement("article");
  const notesReady = Boolean(project.notesUrl);
  article.className = `project-card accent-${project.accent || "mint"}`;
  article.innerHTML = `
    <div class="card-preview">
      <a class="project-open-link" href="${escapeHtml(project.siteUrl)}" target="_blank" rel="noreferrer" aria-label="Open ${escapeHtml(project.title)}">
        <h2>${escapeHtml(project.title)}</h2>
      </a>
      <button class="edit-card-button" type="button" data-edit-project="${escapeHtml(project.slug)}" aria-label="Edit ${escapeHtml(project.title)}">Edit</button>
    </div>
    <div class="card-actions">
      <div class="notes-action">
        ${notesReady
          ? `<a class="notes-link" href="${escapeHtml(project.notesUrl)}" target="_blank" rel="noreferrer">Notes <span aria-hidden="true">↗</span></a>`
          : `<button class="notes-link notes-empty" type="button" data-edit-project="${escapeHtml(project.slug)}">Add notes link</button>`}
        <button class="copy-notes-button" type="button" data-copy-notes="${escapeHtml(project.slug)}" aria-label="Copy ${escapeHtml(project.title)} notes link" ${notesReady ? "" : "disabled"}>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
          </svg>
        </button>
      </div>
      <a class="source-link" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noreferrer">Source</a>
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

function openEditor(slug) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return;
  editTitle.textContent = project.title;
  editSlug.value = project.slug;
  editProjectTitle.value = project.title || "";
  editSiteUrl.value = project.siteUrl || "";
  editRepoUrl.value = project.repoUrl || "";
  editNotesUrl.value = project.notesUrl || "";
  editModal.hidden = false;
  document.body.classList.add("modal-open");
  editProjectTitle.focus();
}

function closeEditor() {
  editModal.hidden = true;
  document.body.classList.remove("modal-open");
}

async function copyNotesLink(slug, button) {
  const project = projects.find((item) => item.slug === slug);
  if (!project?.notesUrl) return;
  try {
    await navigator.clipboard.writeText(project.notesUrl);
  } catch {
    const fallback = document.createElement("textarea");
    fallback.value = project.notesUrl;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.append(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();
  }
  button.classList.add("copied");
  button.setAttribute("aria-label", "Notes link copied");
  window.setTimeout(() => {
    button.classList.remove("copied");
    button.setAttribute("aria-label", `Copy ${project.title} notes link`);
  }, 1400);
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

grid.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-project]");
  if (editButton) openEditor(editButton.dataset.editProject);
  const copyButton = event.target.closest("[data-copy-notes]");
  if (copyButton) copyNotesLink(copyButton.dataset.copyNotes, copyButton);
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const project = projects.find((item) => item.slug === editSlug.value);
  if (!project) return;
  project.title = editProjectTitle.value.trim();
  project.siteUrl = editSiteUrl.value.trim();
  project.repoUrl = editRepoUrl.value.trim();
  project.notesUrl = editNotesUrl.value.trim();
  savedLinks[project.slug] = { title: project.title, siteUrl: project.siteUrl, repoUrl: project.repoUrl, notesUrl: project.notesUrl };
  localStorage.setItem(storageKey, JSON.stringify(savedLinks));
  closeEditor();
  renderProjects();
});

searchInput.addEventListener("input", renderProjects);
document.querySelectorAll("[data-drawer-open]").forEach((button) => button.addEventListener("click", openDrawer));
document.querySelectorAll("[data-drawer-close]").forEach((button) => button.addEventListener("click", closeDrawer));
document.querySelectorAll("[data-edit-close]").forEach((button) => button.addEventListener("click", closeEditor));
editModal.addEventListener("click", (event) => { if (event.target === editModal) closeEditor(); });
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
    closeEditor();
  }
});
renderProjects();
