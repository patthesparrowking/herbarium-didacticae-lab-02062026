console.log("Herbarium Didacticae gestartet");

function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getSavedLabels() {
    try {
        const labels = localStorage.getItem("herbarium_labels");

        if (!labels) return [];

        const parsedLabels = JSON.parse(labels);

        return Array.isArray(parsedLabels) ? parsedLabels : [];
    } catch (error) {
        console.error("Etiketten konnten nicht geladen werden:", error);
        return [];
    }
}

function saveLabels(labels) {
    try {
        localStorage.setItem("herbarium_labels", JSON.stringify(labels));
    } catch (error) {
        console.error("Etiketten konnten nicht gespeichert werden:", error);
        alert("Etiketten konnten nicht gespeichert werden. Möglicherweise ist der Speicher voll.");
    }
}

function setupLabelForm() {
    const form = document.getElementById("labelForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        const newLabel = {
            id: generateId("label"),
            specimenId: form.dataset.specimenId || null,
            templateId: formData.get("templateId") || "classic",
            createdAt: new Date().toISOString(),

            scientificName: formData.get("scientificName"),
            germanName: formData.get("germanName"),
            family: formData.get("family"),

            location: formData.get("location"),
            latinLocation: formData.get("latinLocation"),
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

        const card = document.createElement("a");
        card.className = "label-card";
        card.href = `label-preview.html?id=${label.id}`;

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

function renderLabelPreview() {
    const container = document.getElementById("labelPreview");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const labelId = params.get("id");

    const labels = getSavedLabels();
    const label = labels.find(item => item.id === labelId);

    if (!label) {
        container.innerHTML = `
            <div class="card">
                Etikett wurde nicht gefunden.
            </div>
        `;
        return;
    }

    const templateId = label.templateId || "classic";

    let labelContent = "";

    if (templateId === "compact") {
        labelContent = renderCompactLabel(label);
    } else if (templateId === "didactic") {
        labelContent = renderDidacticLabel(label);
    } else {
        labelContent = renderClassicLabel(label);
    }

    container.innerHTML = `
        ${labelContent}

        <a class="secondary-action no-print" href="label-edit.html?id=${label.id}">
            Etikett bearbeiten
        </a>
    `;
}

function renderClassicLabel(label) {
    return `
        <article class="herbarium-label">

            <div class="herbarium-label-title">
                Herbarium Didacticae
            </div>

            <div class="herbarium-label-row">
                <strong>Wissenschaftlicher Name</strong>
                <span class="herbarium-label-scientific">
                    ${label.scientificName || "-"}
                </span>
            </div>

            <div class="herbarium-label-row">
                <strong>Deutscher Name</strong>
                ${label.germanName || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Familie</strong>
                ${label.family || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Fundort</strong>
                ${label.location || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Lateinische Fundortangabe</strong>
                ${label.latinLocation || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Koordinaten</strong>
                ${label.latitude || "-"}, ${label.longitude || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Sammler:in</strong>
                ${label.collector || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Sammeldatum</strong>
                ${label.collectionDate || "-"}
            </div>

        </article>
    `;
}

function renderCompactLabel(label) {
    return `
        <article class="herbarium-label herbarium-label-compact">

            <div class="herbarium-label-title">
                Herbarium
            </div>

            <div class="herbarium-label-row">
                <strong>Taxon</strong>
                <span class="herbarium-label-scientific">
                    ${label.scientificName || "-"}
                </span>
            </div>

            <div class="herbarium-label-row">
                <strong>Familie</strong>
                ${label.family || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Fundort</strong>
                ${label.latinLocation || label.location || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Datum</strong>
                ${label.collectionDate || "-"}
            </div>

        </article>
    `;
}

function renderDidacticLabel(label) {
    return `
        <article class="herbarium-label herbarium-label-didactic">

            <div class="herbarium-label-title">
                Herbarium Didacticae
            </div>

            <div class="herbarium-label-row">
                <strong>Wissenschaftlicher Name</strong>
                <span class="herbarium-label-scientific">
                    ${label.scientificName || "-"}
                </span>
            </div>

            <div class="herbarium-label-row">
                <strong>Deutscher Name</strong>
                ${label.germanName || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Familie</strong>
                ${label.family || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Fundort</strong>
                ${label.location || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Lateinische Fundortangabe</strong>
                ${label.latinLocation || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Sammler:in / Datum</strong>
                ${label.collector || "-"} · ${label.collectionDate || "-"}
            </div>

            <div class="herbarium-label-row">
                <strong>Notizen</strong>
                ${label.notes || "-"}
            </div>

        </article>
    `;
}

function setupLabelEditForm() {
    const form = document.getElementById("labelEditForm");

    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const labelId = params.get("id");

    const labels = getSavedLabels();
    const label = labels.find(item => item.id === labelId);

    if (!label) {
        form.innerHTML = `
            <div class="card">
                Etikett wurde nicht gefunden.
            </div>
        `;
        return;
    }

    form.elements.id.value = label.id;
    form.elements.scientificName.value = label.scientificName || "";
    form.elements.germanName.value = label.germanName || "";
    form.elements.family.value = label.family || "";
    form.elements.location.value = label.location || "";
    form.elements.latinLocation.value = label.latinLocation || "";
    form.elements.latitude.value = label.latitude || "";
    form.elements.longitude.value = label.longitude || "";
    form.elements.collector.value = label.collector || "";
    form.elements.collectionDate.value = label.collectionDate || "";
    form.elements.notes.value = label.notes || "";
    form.elements.templateId.value = label.templateId || "classic";

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        const updatedLabels = labels.map(item => {
            if (item.id !== labelId) {
                return item;
            }

            return {
                ...item,
                scientificName: formData.get("scientificName"),
                germanName: formData.get("germanName"),
                family: formData.get("family"),
                location: formData.get("location"),
                latinLocation: formData.get("latinLocation"),
                latitude: formData.get("latitude"),
                longitude: formData.get("longitude"),
                collector: formData.get("collector"),
                collectionDate: formData.get("collectionDate"),
                notes: formData.get("notes"),
                updatedAt: new Date().toISOString()
                templateId: formData.get("templateId") || "classic",
            };
        });

        saveLabels(updatedLabels);

        alert("Etikett wurde aktualisiert.");

        window.location.href = `label-preview.html?id=${labelId}`;
    });
}

async function loadTemplates() {
    const response = await fetch("../data/templates.json");
    return await response.json();
}

async function renderTemplateList() {
    const container = document.getElementById("templateList");

    if (!container) return;

    const templates = await loadTemplates();

    const wrapper = document.createElement("div");
    wrapper.className = "label-list";

    templates.forEach(template => {
        const card = document.createElement("article");
        card.className = "label-card";

        card.innerHTML = `
            <div class="label-title">
                ${template.name}
            </div>

            <div class="label-subtitle">
                ${template.description}
            </div>

            <div class="label-meta">
                Felder: ${template.fields.length}
            </div>
        `;

        wrapper.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(wrapper);
}

function getSavedSpecimens() {
    try {
        const specimens = localStorage.getItem("herbarium_specimens");

        if (!specimens) return [];

        const parsedSpecimens = JSON.parse(specimens);

        return Array.isArray(parsedSpecimens) ? parsedSpecimens : [];
    } catch (error) {
        console.error("Sammlung konnte nicht geladen werden:", error);
        return [];
    }
}

function saveSpecimens(specimens) {
    try {
        localStorage.setItem("herbarium_specimens", JSON.stringify(specimens));
    } catch (error) {
        console.error("Sammlung konnte nicht gespeichert werden:", error);
        alert("Sammlung konnte nicht gespeichert werden. Möglicherweise ist der Speicher voll.");
    }
}

function setupSpecimenForm() {
    const form = document.getElementById("specimenForm");

    if (!form) return;

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const imageFile = formData.get("image");

    let image = "";

    if (imageFile && imageFile.size > 0) {
        image = await fileToBase64(imageFile);
    }

    const newSpecimen = {
        id: generateId("specimen"),
        createdAt: new Date().toISOString(),

        scientificName: formData.get("scientificName"),
        germanName: formData.get("germanName"),
        family: formData.get("family"),

        image: image,

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

    const preview = document.getElementById("imagePreview");
    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }
});
}

function setupImagePreview() {
    const imageInput = document.querySelector('input[name="image"]');
    const preview = document.getElementById("imagePreview");

    if (!imageInput || !preview) return;

    imageInput.addEventListener("change", async function () {
        const file = imageInput.files[0];

        if (!file) {
            preview.src = "";
            preview.style.display = "none";
            return;
        }

        const image = await fileToBase64(file);

        preview.src = image;
        preview.style.display = "block";
    });
}

function renderSpecimenList() {
    const container = document.getElementById("specimenList");

    if (!container) return;

    const specimens = getSavedSpecimens();
    const filters = getCollectionFilterValues();

    const filteredSpecimens = specimens.filter(specimen => {
        const searchableText = `
            ${specimen.scientificName || ""}
            ${specimen.germanName || ""}
            ${specimen.family || ""}
            ${specimen.location || ""}
            ${specimen.collector || ""}
            ${specimen.notes || ""}
        `.toLowerCase();

        const matchesSearch =
            searchableText.includes(filters.search);

        const matchesFamily =
            !filters.family || specimen.family === filters.family;

        const specimenYear =
            specimen.collectionDate
                ? specimen.collectionDate.slice(0, 4)
                : "";

        const matchesYear =
            !filters.year || specimenYear === filters.year;

        return matchesSearch && matchesFamily && matchesYear;
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
        const card = document.createElement("a");
        card.className = "label-card";
        card.href = `specimen-detail.html?id=${specimen.id}`;

card.innerHTML = `
    <div class="specimen-card-layout">

        ${specimen.image ? `
            <img class="specimen-thumb" src="${specimen.image}" alt="">
        ` : `
            <div class="specimen-thumb specimen-thumb-placeholder">
                🌿
            </div>
        `}

        <div class="specimen-card-content">
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
        </div>

    </div>
`;

        wrapper.appendChild(card);
    });

    container.appendChild(wrapper);
}

function populateCollectionFilters() {
    const familyFilter = document.getElementById("familyFilter");
    const yearFilter = document.getElementById("yearFilter");

    if (!familyFilter || !yearFilter) return;

    const specimens = getSavedSpecimens();

    const families = [...new Set(
        specimens
            .map(specimen => specimen.family)
            .filter(Boolean)
    )].sort();

    const years = [...new Set(
        specimens
            .map(specimen => specimen.collectionDate?.slice(0, 4))
            .filter(Boolean)
    )].sort();

    families.forEach(family => {
        const option = document.createElement("option");
        option.value = family;
        option.textContent = family;
        familyFilter.appendChild(option);
    });

    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

function renderSpecimenDetail() {
    const container = document.getElementById("specimenDetail");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const specimenId = params.get("id");

    const specimens = getSavedSpecimens();

    const specimen = specimens.find(item => item.id === specimenId);

    if (!specimen) {
        container.innerHTML = `
            <div class="card">
                Pflanze wurde nicht gefunden.
            </div>
        `;
        return;
    }

container.innerHTML = `
    <article class="label-card">
    ${specimen.image ? `
        <img class="specimen-image" src="${specimen.image}" alt="">
    ` : ""}

        <div class="label-title">
            ${specimen.scientificName || "Ohne Namen"}
        </div>

        <div class="label-subtitle">
            ${specimen.germanName || ""}
        </div>

        <div class="label-meta">
            <strong>Familie:</strong> ${specimen.family || "-"}
        </div>

        <div class="label-meta">
            <strong>Fundort:</strong> ${specimen.location || "-"}
        </div>

        <div class="label-meta">
            <strong>Koordinaten:</strong>
            ${specimen.latitude || "-"},
            ${specimen.longitude || "-"}
        </div>

        <div class="label-meta">
            <strong>Sammler:in:</strong> ${specimen.collector || "-"}
        </div>

        <div class="label-meta">
            <strong>Sammeldatum:</strong> ${specimen.collectionDate || "-"}
        </div>

        <div class="label-meta">
            <strong>Notizen:</strong><br>
            ${specimen.notes || "-"}
        </div>

        <div class="detail-actions">
            <a class="secondary-action" href="specimen-edit.html?id=${specimen.id}">
                Bearbeiten
            </a>

            <button class="danger-action" type="button" onclick="deleteSpecimen('${specimen.id}')">
                Löschen
            </button>

            <a class="primary-action" href="label-create.html?specimenId=${specimen.id}">
                Etikett erstellen
            </a>
        </div>

    </article>
`;
}

function deleteSpecimen(specimenId) {
    const confirmed = confirm("Möchtest du diesen Pflanzeneintrag wirklich löschen?");

    if (!confirmed) return;

    const specimens = getSavedSpecimens();

    const updatedSpecimens = specimens.filter(specimen => specimen.id !== specimenId);

    saveSpecimens(updatedSpecimens);

    alert("Pflanze wurde gelöscht.");

    window.location.href = "collection.html";
}

function setupSpecimenEditForm() {
    const form = document.getElementById("specimenEditForm");

    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const specimenId = params.get("id");

    const specimens = getSavedSpecimens();
    const specimen = specimens.find(item => item.id === specimenId);

    if (!specimen) {
        form.innerHTML = `
            <div class="card">
                Pflanze wurde nicht gefunden.
            </div>
        `;
        return;
    }

    form.elements.id.value = specimen.id;
    form.elements.scientificName.value = specimen.scientificName || "";
    form.elements.germanName.value = specimen.germanName || "";
    form.elements.family.value = specimen.family || "";
    form.elements.location.value = specimen.location || "";
    form.elements.latitude.value = specimen.latitude || "";
    form.elements.longitude.value = specimen.longitude || "";
    form.elements.collector.value = specimen.collector || "";
    form.elements.collectionDate.value = specimen.collectionDate || "";
    form.elements.notes.value = specimen.notes || "";
    const currentPreview = document.getElementById("currentImagePreview");

        if (currentPreview && specimen.image) {
            currentPreview.src = specimen.image;
            currentPreview.style.display = "block";
        }

form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        const updatedSpecimens = specimens.map(item => {
            if (item.id !== specimenId) {
                return item;
            }

const imageFile = formData.get("image");

let updatedImage = item.image || "";

if (imageFile && imageFile.size > 0) {
    updatedImage = fileToBase64(imageFile);
}

return {
    ...item,
    scientificName: formData.get("scientificName"),
    germanName: formData.get("germanName"),
    family: formData.get("family"),
    image: updatedImage,
    location: formData.get("location"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    collector: formData.get("collector"),
    collectionDate: formData.get("collectionDate"),
    notes: formData.get("notes"),
    updatedAt: new Date().toISOString()
};
        });

        saveSpecimens(updatedSpecimens);

        alert("Änderungen wurden gespeichert.");

        window.location.href = `specimen-detail.html?id=${specimenId}`;
    });
}

function prefillLabelFormFromSpecimen() {
    const form = document.getElementById("labelForm");

    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const specimenId = params.get("specimenId");

    if (!specimenId) return;

    const specimens = getSavedSpecimens();
    const specimen = specimens.find(item => item.id === specimenId);

    if (!specimen) return;

    form.elements.scientificName.value = specimen.scientificName || "";
    form.elements.germanName.value = specimen.germanName || "";
    form.elements.family.value = specimen.family || "";
    form.elements.location.value = specimen.location || "";
    form.elements.latitude.value = specimen.latitude || "";
    form.elements.longitude.value = specimen.longitude || "";
    form.elements.collector.value = specimen.collector || "";
    form.elements.collectionDate.value = specimen.collectionDate || "";
    form.elements.notes.value = specimen.notes || "";

    form.dataset.specimenId = specimen.id;
}

function setupCollectionFilters() {
    const searchInput = document.getElementById("collectionSearch");
    const familyFilter = document.getElementById("familyFilter");
    const yearFilter = document.getElementById("yearFilter");
    const resetButton = document.getElementById("resetFilters");

    if (!searchInput) return;

    searchInput.addEventListener("input", renderSpecimenList);
    familyFilter.addEventListener("change", renderSpecimenList);
    yearFilter.addEventListener("change", renderSpecimenList);

    resetButton.addEventListener("click", function () {
        searchInput.value = "";
        familyFilter.value = "";
        yearFilter.value = "";

        renderSpecimenList();
    });
}

function getCollectionFilterValues() {
    const searchInput = document.getElementById("collectionSearch");
    const familyFilter = document.getElementById("familyFilter");
    const yearFilter = document.getElementById("yearFilter");

    return {
        search: searchInput ? searchInput.value.toLowerCase().trim() : "",
        family: familyFilter ? familyFilter.value : "",
        year: yearFilter ? yearFilter.value : ""
    };
}

function renderPlantMap() {
    const mapElement = document.getElementById("plantMap");

    if (!mapElement) return;

    if (typeof L === "undefined") {
        mapElement.innerHTML = "Karte konnte nicht geladen werden.";
        return;
    }

    const map = L.map("plantMap");

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    const specimens = getSavedSpecimens();

    const specimensWithCoordinates = specimens.filter(specimen => {
        return specimen.latitude && specimen.longitude;
    });

    if (specimensWithCoordinates.length === 0) {
        map.setView([51.1657, 10.4515], 6);
        return;
    }

    const markerGroup = L.featureGroup();

    specimensWithCoordinates.forEach(specimen => {
        const lat = Number(specimen.latitude);
        const lng = Number(specimen.longitude);

        if (Number.isNaN(lat) || Number.isNaN(lng)) return;

        const marker = L.marker([lat, lng]);

        marker.bindPopup(`
            <div class="map-popup-title">
                ${specimen.scientificName || "Ohne Namen"}
            </div>

            <div>
                ${specimen.germanName || ""}
            </div>

            <div>
                📍 ${specimen.location || "Kein Fundort"}
            </div>

            <a class="map-popup-link" href="specimen-detail.html?id=${specimen.id}">
                Eintrag öffnen
            </a>
        `);

        marker.addTo(markerGroup);
    });

    markerGroup.addTo(map);

    if (markerGroup.getLayers().length === 1) {
        const marker = markerGroup.getLayers()[0];
        map.setView(marker.getLatLng(), 12);
    } else {
        map.fitBounds(markerGroup.getBounds(), {
            padding: [30, 30]
        });
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

async function loadDictionary() {
    const response = await fetch("../data/dictionary.json");
    return await response.json();
}

function getDictionaryFilterValues() {
    const searchInput = document.getElementById("dictionarySearch");
    const categorySelect = document.getElementById("dictionaryCategory");

    return {
        search: searchInput ? searchInput.value.toLowerCase().trim() : "",
        category: categorySelect ? categorySelect.value : ""
    };
}

async function renderDictionaryList() {
    const container = document.getElementById("dictionaryList");

    if (!container) return;

    const entries = await loadDictionary();
    const filters = getDictionaryFilterValues();

    const filteredEntries = entries.filter(entry => {
        const searchableText = `
            ${entry.de || ""}
            ${entry.la || ""}
            ${entry.category || ""}
            ${entry.grammar || ""}
            ${entry.usage || ""}
        `.toLowerCase();

        const matchesSearch = searchableText.includes(filters.search);
        const matchesCategory = !filters.category || entry.category === filters.category;

        return matchesSearch && matchesCategory;
    });

    if (filteredEntries.length === 0) {
        container.innerHTML = `
            <div class="card">
                Keine passenden Begriffe gefunden.
            </div>
        `;
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "label-list";

    filteredEntries.forEach(entry => {
        const card = document.createElement("article");
        card.className = "label-card";

        card.innerHTML = `
            <div class="label-title">
                ${entry.de}
            </div>

            <div class="label-subtitle">
                <em>${entry.la}</em>
            </div>

            <div class="label-meta">
                <strong>Kategorie:</strong> ${entry.category}
            </div>

            <div class="label-meta">
                <strong>Grammatik:</strong> ${entry.grammar}
            </div>

            <div class="label-meta">
                <strong>Verwendung:</strong> ${entry.usage}
            </div>
        `;

        wrapper.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(wrapper);
}

async function populateDictionaryCategories() {
    const categorySelect = document.getElementById("dictionaryCategory");

    if (!categorySelect) return;

    const entries = await loadDictionary();

    const categories = [...new Set(
        entries
            .map(entry => entry.category)
            .filter(Boolean)
    )].sort();

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function setupDictionaryFilters() {
    const searchInput = document.getElementById("dictionarySearch");
    const categorySelect = document.getElementById("dictionaryCategory");
    const resetButton = document.getElementById("resetDictionaryFilters");

    if (!searchInput || !categorySelect || !resetButton) return;

    searchInput.addEventListener("input", renderDictionaryList);
    categorySelect.addEventListener("change", renderDictionaryList);

    resetButton.addEventListener("click", function () {
        searchInput.value = "";
        categorySelect.value = "";

        renderDictionaryList();
    });
}

async function renderDictionaryOverlayList(searchTerm = "") {
    const container = document.getElementById("dictionaryOverlayList");

    if (!container) return;

    const entries = await loadDictionary();

    const normalizedSearch = searchTerm.toLowerCase().trim();

    const filteredEntries = entries.filter(entry => {
        const searchableText = `
            ${entry.de || ""}
            ${entry.la || ""}
            ${entry.category || ""}
            ${entry.grammar || ""}
            ${entry.usage || ""}
        `.toLowerCase();

        return searchableText.includes(normalizedSearch);
    });

    if (filteredEntries.length === 0) {
        container.innerHTML = `
            <div class="card">
                Keine passenden Begriffe gefunden.
            </div>
        `;
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "dictionary-mini-list";

    filteredEntries.forEach(entry => {
        const card = document.createElement("article");
        card.className = "dictionary-mini-card";

        card.innerHTML = `
            <div class="label-title">
                ${entry.de}
            </div>

            <div class="label-subtitle">
                <em>${entry.la}</em>
            </div>

            <div class="label-meta">
                ${entry.grammar}
            </div>

            <div class="label-meta">
                ${entry.usage}
            </div>

<div class="dictionary-actions">
    <button
        class="secondary-action copy-term-button"
        type="button"
        data-term="${entry.la}"
    >
        Wort einfügen
    </button>

    <button
        class="secondary-action copy-term-button"
        type="button"
        data-term="${entry.insert || entry.usage}"
    >
        Beispiel einfügen
    </button>
</div>
        `;

        wrapper.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(wrapper);
}

function setupDictionaryOverlay() {
    const openButton = document.getElementById("openDictionaryOverlay");
    const closeButton = document.getElementById("closeDictionaryOverlay");
    const overlay = document.getElementById("dictionaryOverlay");
    const searchInput = document.getElementById("dictionaryOverlaySearch");

    if (!openButton || !closeButton || !overlay || !searchInput) return;

    openButton.addEventListener("click", function () {
        overlay.hidden = false;
        renderDictionaryOverlayList();
        searchInput.focus();
    });

    closeButton.addEventListener("click", function () {
        overlay.hidden = true;
    });

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            overlay.hidden = true;
        }
    });

document.addEventListener("click", function (event) {
    const copyButton = event.target.closest(".copy-term-button");

    if (!copyButton) return;

    const term = copyButton.dataset.term;
    const targetField = document.querySelector('[name="latinLocation"]');

    if (!targetField) return;

    const currentValue = targetField.value.trim();

    if (currentValue.length === 0) {
        targetField.value = term;
    } else {
        targetField.value = `${currentValue} ${term}`;
    }

    copyButton.textContent = "Eingefügt";
    targetField.focus();
});
}

function exportHerbariumData() {
    const data = {
        exportedAt: new Date().toISOString(),
        app: "Herbarium Didacticae",
        version: 1,
        specimens: getSavedSpecimens(),
        labels: getSavedLabels()
    };

    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `herbarium-backup-${new Date().toISOString().slice(0, 10)}.json`;

    link.click();

    URL.revokeObjectURL(url);
}

function importHerbariumData(file) {
    const reader = new FileReader();

    reader.onload = function () {
        try {
            const data = JSON.parse(reader.result);

            if (!Array.isArray(data.specimens) || !Array.isArray(data.labels)) {
                alert("Die Datei enthält kein gültiges Herbarium-Backup.");
                return;
            }

            const confirmed = confirm(
                "Möchtest du die aktuellen Daten durch dieses Backup ersetzen?"
            );

            if (!confirmed) return;

            saveSpecimens(data.specimens);
            saveLabels(data.labels);

            alert("Backup wurde importiert.");

            window.location.reload();

        } catch (error) {
            console.error("Import fehlgeschlagen:", error);
            alert("Die Datei konnte nicht importiert werden.");
        }
    };

    reader.readAsText(file);
}

function setupDataBackup() {
    const exportButton = document.getElementById("exportDataButton");
    const importInput = document.getElementById("importDataInput");

    if (exportButton) {
        exportButton.addEventListener("click", exportHerbariumData);
    }

    if (importInput) {
        importInput.addEventListener("change", function () {
            const file = importInput.files[0];

            if (!file) return;

            importHerbariumData(file);
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setupLabelForm();
    renderLabelList();

    setupSpecimenForm();
    renderSpecimenList();

    populateCollectionFilters();
    setupCollectionFilters();

    renderSpecimenDetail();
    setupSpecimenEditForm();
    setupLabelEditForm();
    setupDataBackup();

    prefillLabelFormFromSpecimen();

    renderLabelPreview();
    renderTemplateList();
    setupDictionaryOverlay();

    renderPlantMap();

    setupImagePreview();

    populateDictionaryCategories();
    renderDictionaryList();
    setupDictionaryFilters();
});