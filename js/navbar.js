// toggle menu

let navbar = document.querySelector(".navbar"),
  menu = document.querySelector(".menu");
header = document.querySelector(".header");

function toggleMenu() {
  navbar.classList.toggle("active");
  header.classList.toggle("active");
}

// adding active to sidebar
let siidebarlLi = document.querySelectorAll(".select");

for (let i = 0; i < siidebarlLi.length; i++) {
  siidebarlLi[i].addEventListener("click", () => {
    for (let j = 0; j < siidebarlLi.length; j++) {
      siidebarlLi[j].classList.remove("active");
    }
    siidebarlLi[i].classList.add("active");
  });
}

function removeActive() {
  for (let i = 0; i < siidebarlLi.length; i++) {
    siidebarlLi[i].addEventListener("click", () => {
      siidebarlLi[i].classList.remove("active");
    });
  }
}
