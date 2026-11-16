// ===========================
// Preloader: 0 -> 100 over ~2.2s (reference site pace), wordmark lights up
// letter by letter, blue orb rotates into place, tagline fades in at 95%.
// Count is driven by elapsed time (not tick count) so a throttled timer
// jumps to the right number instead of crawling; a hard 3.5s fallback
// finishes it no matter what. (CSS also fades it out on its own at 3.6s.)
// ===========================
(function () {
    const preloader = document.querySelector("#preloader");
    const countEl = document.querySelector("#preloaderCount");
    const fillEl = document.querySelector("#preloaderFill");
    const tagEl = document.querySelector("#preloaderTag");
    const orbEl = document.querySelector("#preloaderOrb");
    const letters = Array.prototype.slice.call(document.querySelectorAll("#preloaderWord .preloader-group span"));
    if (!preloader || !countEl) return;
    const DURATION = 2200; // ms to count 0 -> 100
    const start = Date.now();
    let finished = false;
    function setCount(n) {
        countEl.textContent = n + " %";
        if (fillEl) fillEl.style.width = n + "%";
        if (tagEl) tagEl.style.opacity = n >= 95 ? "1" : "0";
        if (orbEl) {
            const k = Math.min(n / 40, 1); // orb settles into place by 40%
            const ang = -35 * (1 - k);
            const x = -0.3 * (1 - k);
            orbEl.style.transform = "rotate(" + ang + "deg) translateX(" + x + "em)";
        }
        letters.forEach(function (el, i) {
            // brighten left to right: letter i lights up across an 18-point
            // window starting at i*3.5, so all are white by ~53%
            const o = Math.max(0.12, Math.min(1, (n - i * 3.5) / 18));
            el.style.opacity = o.toFixed(2);
        });
    }
    function finish() {
        if (finished) return;
        finished = true;
        setCount(100);
        setTimeout(function () {
            preloader.classList.add("done");
            setTimeout(function () { preloader.remove(); }, 600);
        }, 150);
    }
    setTimeout(finish, 3500); // hard fallback: never sit on a number
    const timer = setInterval(function () {
        const n = Math.min(100, Math.round((Date.now() - start) / DURATION * 100));
        setCount(n);
        if (n >= 100) { clearInterval(timer); finish(); }
    }, 22);
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

// Hide the centred header pill while scrolling down so it never
// covers page content; it comes back as soon as you scroll up.
// (The Menu pill stays visible so navigation is always reachable.)
let lastScrollY = window.scrollY;
window.addEventListener("scroll", function () {
    if (!headerContact) return;
    const y = window.scrollY;
    if (y > 140 && y > lastScrollY) {
        headerContact.classList.add("hide");
        closeContactDropdown();
    } else {
        headerContact.classList.remove("hide");
    }
    lastScrollY = y;
}, { passive: true });

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
