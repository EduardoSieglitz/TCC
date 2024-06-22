const Menu = document.getElementById("MenuRight");

function click() {
    const navMenu = document.getElementById("nav");
    navMenu.classList.toggle("active");
}
Menu.addEventListener("click", click)

