const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

links.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
