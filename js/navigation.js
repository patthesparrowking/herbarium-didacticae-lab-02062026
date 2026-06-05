const isInPagesFolder = window.location.pathname.includes("/pages/");

const basePath = isInPagesFolder ? "" : "pages/";
const homePath = isInPagesFolder ? "../index.html" : "index.html";

const navItems = [
    {
        label: "Start",
        href: homePath,
        icon: `<svg><use href="../assets/icons/sprite.svg#icon-home"></use></svg>`
    },
    {
        label: "Etikett",
        href: basePath + "label-create.html",
        icon: `<svg><use href="../assets/icons/sprite.svg#icon-new-label"></use></svg>`
    },
    {
        label: "Sammlung",
        href: basePath + "collection.html",
        icon: `<svg><use href="../assets/icons/sprite.svg#icon-book"></use></svg>`
    },
    {
        label: "Karte",
        href: basePath + "map.html",
        icon: `<svg><use href="../assets/icons/sprite.svg#icon-map"></use></svgs=>`
    },
    {
        label: "Mehr",
        href: basePath + "more.html",
        icon: `<svg><use href="../assets/icons/sprite.svg#icon-archive"></use></svgclass=>`
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
        icon.innerHTML = item.icon;

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