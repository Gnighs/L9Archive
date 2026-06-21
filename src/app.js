import { archiveManifest } from "./archive-manifest.js";

const sectionGrid = document.querySelector("#section-grid");
const documentList = document.querySelector("#document-list");
const documentsTitle = document.querySelector("#documents-title");
const activeSectionKicker = document.querySelector("#active-section-kicker");
const generationStamp = document.querySelector("#generation-stamp");
const showAllButton = document.querySelector("#show-all");

const sections = archiveManifest.sections;
let activeSectionId = getInitialSectionId();

function getInitialSectionId() {
  const hash = window.location.hash.replace(/^#/, "");
  if (sections.some((section) => section.id === hash)) return hash;

  return sections.find((section) => section.count > 0)?.id ?? sections[0]?.id ?? null;
}

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `Index refreshed ${date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  })}`;
}

function renderSections() {
  sectionGrid.replaceChildren(
    ...sections.map((section) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `section-card ${section.status}`;
      button.dataset.active = section.id === activeSectionId ? "true" : "false";
      button.setAttribute("aria-pressed", section.id === activeSectionId ? "true" : "false");

      const status = section.status === "available" ? `${section.count} document${section.count === 1 ? "" : "s"}` : section.maintenanceLine;

      button.innerHTML = `
        <span class="card-topline">
          <span>${section.id.toUpperCase()}</span>
          <span>${section.status === "available" ? "OPEN" : "MAINT"}</span>
        </span>
        <strong>${section.title}</strong>
        <span class="card-copy">${section.description}</span>
        <span class="card-status">${status}</span>
      `;

      button.addEventListener("click", () => {
        activeSectionId = section.id;
        window.history.replaceState(null, "", `#${section.id}`);
        render();
      });

      return button;
    })
  );
}

function documentRow(document, section) {
  const anchor = document.createElement("a");
  anchor.className = "document-row";
  anchor.href = document.href;
  anchor.target = "_blank";
  anchor.rel = "noopener";

  anchor.innerHTML = `
    <span class="document-id">${document.id}</span>
    <span class="document-main">
      <strong>${document.title}</strong>
      <span>${section.title} archive file</span>
    </span>
    <span class="document-action">View PDF</span>
  `;

  return anchor;
}

function maintenanceNotice(section) {
  const article = document.createElement("article");
  article.className = "maintenance-notice";
  article.innerHTML = `
    <span>${section.maintenanceLine}</span>
    <strong>${section.title} records are not yet available through the public terminal.</strong>
    <p>When PDF files are added to this folder, the next index scan will open this section automatically.</p>
  `;
  return article;
}

function renderDocuments() {
  const activeSection = sections.find((section) => section.id === activeSectionId);

  if (!activeSection) {
    documentsTitle.textContent = "Documents";
    activeSectionKicker.textContent = "Selected Index";
    documentList.replaceChildren();
    return;
  }

  documentsTitle.textContent = activeSection.title;
  activeSectionKicker.textContent = activeSection.status === "available" ? "Open Index" : "Restricted Index";

  if (activeSection.documents.length === 0) {
    documentList.replaceChildren(maintenanceNotice(activeSection));
    return;
  }

  documentList.replaceChildren(
    ...activeSection.documents.map((document) => documentRow(document, activeSection))
  );
}

function renderAllDocuments() {
  activeSectionId = null;
  window.history.replaceState(null, "", window.location.pathname);
  documentsTitle.textContent = "All Open Documents";
  activeSectionKicker.textContent = "Public Index";

  const rows = sections.flatMap((section) =>
    section.documents.map((document) => documentRow(document, section))
  );

  if (rows.length === 0) {
    documentList.replaceChildren();
  } else {
    documentList.replaceChildren(...rows);
  }

  renderSections();
}

function render() {
  renderSections();
  renderDocuments();
}

generationStamp.textContent = formatTimestamp(archiveManifest.generatedAt);
showAllButton.addEventListener("click", renderAllDocuments);
render();
