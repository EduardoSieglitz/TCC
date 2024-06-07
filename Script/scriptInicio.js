class navbar{
    constructor(ControlIndex, abaRight){
        this.ControlIndex = document.querySelector(ControlIndex);
        this.abaRight = document.querySelector(abaRight);
        this.Conteiner = "active";
    }
    addClickEvent(){
        this.abaRight.addEventListener("click", () => console.log
    ("dded"))
    }

    init(){
        if(this.abaRight){
            this.abaRight();
        }
        return this;
    }

}
const mobile = new navbar(
    "abaRight",
    "Aba",
);
mobile.init();