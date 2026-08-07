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