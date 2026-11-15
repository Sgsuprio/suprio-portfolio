// ===========================
// Preloader: count 0 -> 100, then fade out
// (CSS also fades it out on its own after 2.6s if JS fails)
// ===========================
(function () {
    const preloader = document.querySelector("#preloader");
    const countEl = document.querySelector("#preloaderCount");
    if (!preloader || !countEl) return;
    let count = 0;
    const timer = setInterval(function () {
        count += 1;
        countEl.textContent = count + "%";
        if (count >= 100) {
            clearInterval(timer);
            setTimeout(function () {
                preloader.classList.add("done");
                setTimeout(function () { preloader.remove(); }, 600);
            }, 150);
        }
    }, 12);
})();

// ===========================
// Header contact dropdown (Open to Work -> X / Telegram / Gmail)
// ===========================
const headerContact = document.querySelector("#headerContact");
const contactBtn = document.querySelector("#contactBtn");

function closeContactDropdown() {
    if (!headerContact) return;
    headerContact.classList.remove("open");
    contactBtn.setAttribute("aria-expanded", "false");
}

if (contactBtn) {
    contactBtn.onclick = function (e) {
        e.stopPropagation();
        const isOpen = headerContact.classList.toggle("open");
        contactBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };
    document.addEventListener("click", function (e) {
        if (headerContact && !headerContact.contains(e.target)) closeContactDropdown();
    });
}

// ===========================
// Slide-in menu panel
// ===========================
const menuBtn = document.querySelector("#menuBtn");
const menuPanel = document.querySelector("#menuPanel");
const menuOverlay = document.querySelector("#menuOverlay");
const menuClose = document.querySelector("#menuClose");

function openMenu() {
    menuPanel.classList.add("open");
    menuOverlay.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    menuPanel.classList.remove("open");
    menuOverlay.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
}

menuBtn.onclick = openMenu;
menuClose.onclick = closeMenu;
menuOverlay.onclick = closeMenu;

document.querySelectorAll(".menu-links a").forEach(link => {
    link.onclick = closeMenu;
});

// Close the menu and the contact dropdown with the Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeMenu();
        closeContactDropdown();
    }
});

// ===========================
// Scroll-reveal: fade sections and cards up as they enter view
// (reveal class is added here in JS, so the page still shows
//  everything normally if JS fails to load)
// ===========================
const revealItems = document.querySelectorAll(
    "section:not(.hero), footer, .project-card, .skill-card, .stat-card, .contact-card, .timeline-item, .wide-card"
);
revealItems.forEach(el => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
revealItems.forEach(el => revealObserver.observe(el));

// ===========================
// Intro paragraph: words turn white one by one as it scrolls in
// ===========================
const introText = document.querySelector("#introText");
if (introText) {
    const words = introText.textContent.trim().split(/\s+/);
    introText.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(" ");
    const wordSpans = introText.querySelectorAll(".w");
    const introObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                wordSpans.forEach((span, i) => {
                    span.style.transitionDelay = (i * 35) + "ms";
                    span.classList.add("on");
                });
                introObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    introObserver.observe(introText);
}

// ===========================
// Skill bars: grow from 0 to their level when Skills scrolls into view
// ===========================
const skillFills = document.querySelectorAll(".skill-fill");
skillFills.forEach(fill => {
    fill.dataset.width = fill.style.width;
    fill.style.width = "0";
});
const skillsSection = document.querySelector("#skills");
if (skillsSection) {
    const skillsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillFills.forEach(fill => {
                    fill.style.width = fill.dataset.width;
                });
                skillsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
}

// ===========================
// Active menu link: highlight the section currently on screen
// ===========================
const pageSections = document.querySelectorAll("section[id], footer[id]");
const menuAnchors = document.querySelectorAll(".menu-links a");
const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            menuAnchors.forEach(a => {
                a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
            });
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });
pageSections.forEach(s => navObserver.observe(s));

// ===========================
// Back-to-top button
// ===========================
const backToTop = document.querySelector("#backToTop");
if (backToTop) {
    window.addEventListener("scroll", function () {
        backToTop.classList.toggle("show", window.scrollY > 600);
    });
    backToTop.onclick = function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
}
