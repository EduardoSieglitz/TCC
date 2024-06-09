const aba = document.getElementById("abaRight");
const abaMenu = document.getElementById("abaRightMenu");

function clickMenu(){
    const nav = document.getElementById("nav");
    nav.classList.toggle("active");
}
function click(){
    const navMenu = document.getElementById("nav");
    navMenu.classList.toggle("active");
}
aba.addEventListener("click", clickMenu)
abaMenu.addEventListener("click", clickMenu)
