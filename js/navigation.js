const isInPagesFolder = window.location.pathname.includes("/pages/");

const basePath = isInPagesFolder ? "" : "pages/";
const homePath = isInPagesFolder ? "../index.html" : "index.html";

const navItems = [
    {
        label: "Start",
        href: homePath,
        icon: "🏠"
    },
    {
        label: "Etikett",
        href: basePath + "label-create.html",
        icon: "🏷️"
    },
    {
        label: "Sammlung",
        href: basePath + "collection.html",
        icon: "🌿"
    },
    {
        label: "Karte",
        href: basePath + "map.html",
        icon: "🗺️"
    },
    {
        label: "Mehr",
        href: basePath + "more.html",
        icon: "☰"
    }
];

function createBottomNav() {
    const nav = document.createElement("nav");
    nav.className = "bottom-nav";

    const currentPage = window.location.pathname.split("/").pop();

    navItems.forEach((item) => {
        const link = document.createElement("a");

        link.className = "nav-item";
        link.href = item.href;

        const icon = document.createElement("span");
        icon.className = "nav-icon";
        icon.textContent = item.icon;

        const label = document.createElement("span");
        label.textContent = item.label;

        if (item.href.endsWith(currentPage)) {
            link.classList.add("active");
        }

        link.appendChild(icon);
        link.appendChild(label);
        nav.appendChild(link);
    });

    return nav;
}

function injectBottomNav() {
    const placeholder = document.getElementById("bottomnav-root");

    if (!placeholder) return;

    placeholder.replaceWith(createBottomNav());
}

document.addEventListener("DOMContentLoaded", injectBottomNav);