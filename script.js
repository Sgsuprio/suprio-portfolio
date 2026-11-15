// ===========================
// Mobile menu
// ===========================
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.onclick = function () {
    menuBtn.classList.toggle("open");
    navLinks.classList.toggle("active");
};

document.querySelectorAll(".nav-links a").forEach(link => {
    link.onclick = function () {
        menuBtn.classList.remove("open");
        navLinks.classList.remove("active");
    };
});

// Close the mobile menu with the Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        menuBtn.classList.remove("open");
        navLinks.classList.remove("active");
    }
});

// ===========================
// Scroll-reveal: fade sections and cards up as they enter view
// (reveal class is added here in JS, so the page still shows
//  everything normally if JS fails to load)
// ===========================
const revealItems = document.querySelectorAll(
    "section:not(.hero), .project-card, .skill-card, .stat-card, .contact-card, .timeline-item"
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
// Active nav link: highlight the section currently on screen
// ===========================
const pageSections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");
const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => {
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
