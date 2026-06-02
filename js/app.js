console.log("Herbarium Didacticae gestartet");

function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getSavedLabels() {
    const labels = localStorage.getItem("herbarium_labels");

    if (!labels) {
        return [];
    }

    return JSON.parse(labels);
}

function saveLabels(labels) {
    localStorage.setItem("herbarium_labels", JSON.stringify(labels));
}

function setupLabelForm() {
    const form = document.getElementById("labelForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        const newLabel = {
            id: generateId("label"),
            createdAt: new Date().toISOString(),

            scientificName: formData.get("scientificName"),
            germanName: formData.get("germanName"),
            family: formData.get("family"),

            location: formData.get("location"),
            latitude: formData.get("latitude"),
            longitude: formData.get("longitude"),

            collector: formData.get("collector"),
            collectionDate: formData.get("collectionDate"),
            notes: formData.get("notes")
        };

        const labels = getSavedLabels();

        labels.push(newLabel);

        saveLabels(labels);

        alert("Etikett wurde gespeichert.");

        form.reset();
    });
}

function renderLabelList() {

    const container =
        document.getElementById("labelList");

    if (!container) return;

    const labels = getSavedLabels();

    if (labels.length === 0) {

        container.innerHTML = `
            <div class="card">
                Noch keine Etiketten gespeichert.
            </div>
        `;

        return;
    }

    const wrapper =
        document.createElement("div");

    wrapper.className = "label-list";

    labels.forEach(label => {

        const card =
            document.createElement("div");

        card.className = "label-card";

        card.innerHTML = `
            <div class="label-title">
                ${label.scientificName || "Ohne Namen"}
            </div>

            <div class="label-subtitle">
                ${label.germanName || ""}
            </div>

            <div class="label-meta">
                📍 ${label.location || "Kein Fundort"}
            </div>

            <div class="label-meta">
                👤 ${label.collector || "Unbekannt"}
            </div>

            <div class="label-meta">
                📅 ${label.collectionDate || "-"}
            </div>
        `;

        wrapper.appendChild(card);

    });

    container.appendChild(wrapper);
}

function getSavedSpecimens() {
    const specimens = localStorage.getItem("herbarium_specimens");

    if (!specimens) {
        return [];
    }

    return JSON.parse(specimens);
}

function saveSpecimens(specimens) {
    localStorage.setItem("herbarium_specimens", JSON.stringify(specimens));
}

function setupSpecimenForm() {
    const form = document.getElementById("specimenForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        const newSpecimen = {
            id: generateId("specimen"),
            createdAt: new Date().toISOString(),

            scientificName: formData.get("scientificName"),
            germanName: formData.get("germanName"),
            family: formData.get("family"),

            location: formData.get("location"),
            latitude: formData.get("latitude"),
            longitude: formData.get("longitude"),

            collector: formData.get("collector"),
            collectionDate: formData.get("collectionDate"),
            notes: formData.get("notes")
        };

        const specimens = getSavedSpecimens();

        specimens.push(newSpecimen);

        saveSpecimens(specimens);

        alert("Pflanze wurde gespeichert.");

        form.reset();
    });
}

function renderSpecimenList(searchTerm = "") {
    const container = document.getElementById("specimenList");

    if (!container) return;

    const specimens = getSavedSpecimens();

    const normalizedSearch = searchTerm.toLowerCase().trim();

    const filteredSpecimens = specimens.filter(specimen => {
        const searchableText = `
            ${specimen.scientificName || ""}
            ${specimen.germanName || ""}
            ${specimen.family || ""}
            ${specimen.location || ""}
            ${specimen.collector || ""}
            ${specimen.notes || ""}
        `.toLowerCase();

        return searchableText.includes(normalizedSearch);
    });

    if (filteredSpecimens.length === 0) {
        container.innerHTML = `
            <div class="card">
                Keine passenden Pflanzen gefunden.
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "label-list";

    filteredSpecimens.forEach(specimen => {
        const card = document.createElement("article");
        card.className = "label-card";

        card.innerHTML = `
            <div class="label-title">
                ${specimen.scientificName || "Ohne Namen"}
            </div>

            <div class="label-subtitle">
                ${specimen.germanName || ""}
            </div>

            <div class="label-meta">
                Familie: ${specimen.family || "-"}
            </div>

            <div class="label-meta">
                📍 ${specimen.location || "Kein Fundort"}
            </div>

            <div class="label-meta">
                📅 ${specimen.collectionDate || "-"}
            </div>
        `;

        wrapper.appendChild(card);
    });

    container.appendChild(wrapper);
}

function setupCollectionSearch() {
    const searchInput = document.getElementById("collectionSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        renderSpecimenList(searchInput.value);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setupLabelForm();
    renderLabelList();

    setupSpecimenForm();
    renderSpecimenList();

    setupCollectionSearch();
});