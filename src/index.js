//console.log(document.getElementsByClassName("card"))
const FIELD_ID = "field"

class Card {
    constructor(deckId = "emotion", number="1",  height="170px", width="120px") {
      this.fieldId = FIELD_ID;
      this.cardId = deckId + '-'+number;
      this.height = height;
      this.width = width;
      this.isRotated = false; //false - карта не перевернута на 180 градусов
      this.isMirrorred = false; //false - карта не отражена по вертикальной оси
      this.isOnField = false; //false - карта в колоде, не вынесена на поле
      this.isOpen = false; //false - рубашкой вверх
      this.scale = 1;
      this.zIndex = 500;
      this.top = "50px";
      this.left = "50px";
      this.isOpen = true;
    }
    setCoord(top,left){
        this.top = top;
        this.left = left;
    }
    createCardHTML(){
        let cardImgWrp = document.createElement("div");//оболочка позволяет отделить преобразования. Отражается изображение, а переворачивается оболочка.
        cardImgWrp.id=this.cardId+"-img-wrp";
        cardImgWrp.className="card-img-wrp"
        
        let cardImg = document.createElement("img");
        cardImg.src = "./img/king.png";
        cardImg.id=this.cardId +"-img";
        cardImgWrp.appendChild(cardImg)
    
    
        let newCardControls = document.createElement("div");
        newCardControls.className ="card-controls-wrp card-controls";
    
//rotate    
        let rotateIconWrp = document.createElement("div");
        rotateIconWrp.className="card-checkbox-btn card-rotate-btn";
        let rotateIcon = document.createElement("div");
        rotateIcon.className="icon card-icon card-icon-rotate";
        rotateIcon.setAttribute("data-icon","e");
        rotateIconWrp.appendChild(rotateIcon);
    
        let rotateCheckbox = document.createElement("input");
        rotateCheckbox.type = "checkbox";
        rotateCheckbox.className = "card-checkbox card-rotate-checkbox";
        rotateCheckbox.id=this.cardId + "isrotated";
        rotateCheckbox.name=this.cardId + "isrotated";
        rotateCheckbox.onchange = () => {
            this.isRotated=rotateCheckbox.checked;
            if (rotateCheckbox.checked) {
                document.getElementById(this.cardId+"-img-wrp").classList.add("rotated-card");        
            } else {
                document.getElementById(this.cardId+"-img-wrp").classList.remove("rotated-card");;
            }
        }
        rotateIconWrp.appendChild(rotateCheckbox);//собралась кнопка
        newCardControls.appendChild(rotateIconWrp);
//end rotate
        let deleteIcon = document.createElement("div");
        deleteIcon.className="icon card-icon";
        deleteIcon.setAttribute("data-icon","g");
        deleteIcon.onclick = () => this.deleteFromField(); 
       // {
            // document.getElementById(this.cardId).remove();
            // this.isOnField=false
       // }
        newCardControls.appendChild(deleteIcon);

        let downIcon = document.createElement("div");
        downIcon.className="icon card-icon";
        downIcon.setAttribute("data-icon","h");
        downIcon.onclick = () => {
            if (this.zIndex>1){ 
                this.zIndex--;
                newCardHTML.style.zIndex=this.zIndex;
            } else {
                alert("Карта на нижнем слое");
            }
        }
        newCardControls.appendChild(downIcon);

        let upIcon = document.createElement("div");
        upIcon.className="icon card-icon";
        upIcon.setAttribute("data-icon","i");
        upIcon.onclick = () => {
            if (this.zIndex<1000){ 
                this.zIndex++;
                newCardHTML.style.zIndex=this.zIndex;
            } else {
                alert("Карта очень высоко");
            }
        }
        newCardControls.appendChild(upIcon);

        let scaleUpIcon = document.createElement("div");
        scaleUpIcon.className="icon card-icon";
        scaleUpIcon.setAttribute("data-icon","v");
        scaleUpIcon.onclick = () => {
            if ((this.scale+0.2)<5){
                this.scale+=0.2;
                newCardHTML.style.transform= `scale(${this.scale})`;
            }
        }
        newCardControls.appendChild(scaleUpIcon);

        let scaleDownIcon = document.createElement("div");
        scaleDownIcon.className="icon card-icon";
        scaleDownIcon.setAttribute("data-icon","u");
        scaleDownIcon.onclick = () => {
            if ((this.scale-0.2)>0.5){
                this.scale-=0.2;
                newCardHTML.style.transform= `scale(${this.scale})`;
            }
        }
        newCardControls.appendChild(scaleDownIcon);
//mirror
        let mirrorIconWrp = document.createElement("div");
        mirrorIconWrp.className="card-checkbox-btn card-mirror-btn";
        let mirrorIcon = document.createElement("div");
        mirrorIcon.className="icon card-icon";
        mirrorIcon.setAttribute("data-icon","j");
        let mirrorCheckbox = document.createElement("input");
        mirrorCheckbox.type = "checkbox";
        mirrorCheckbox.className = "card-checkbox card-mirror-checkbox";
        mirrorCheckbox.id=this.cardId + "ismirrorred";
        mirrorCheckbox.name=this.cardId + "ismirrorred";
        mirrorCheckbox.onchange = () => {
            this.isMirrorred = mirrorCheckbox.checked;
            if (mirrorCheckbox.checked) {
                document.getElementById(this.cardId+"-img").classList.add("mirrorred-card")
            } else {
                document.getElementById(this.cardId+"-img").classList.remove("mirrorred-card");
            }
        }
        mirrorIconWrp.appendChild(mirrorIcon);
        mirrorIconWrp.appendChild(mirrorCheckbox);
        newCardControls.appendChild(mirrorIconWrp);
//end mirror
//open       
        let openIconWrp = document.createElement("div");
        openIconWrp.className="card-checkbox-btn card-open-btn";
        let openIcon = document.createElement("div");
        openIcon.className="icon card-icon";
        openIcon.setAttribute("data-icon","l");
        let openCheckbox = document.createElement("input");
        openCheckbox.type = "checkbox";
        openCheckbox.className = "card-checkbox card-open-checkbox";
        openCheckbox.id=this.cardId + "-isopen";
        openCheckbox.name=this.cardId + "-isopen";
        openCheckbox.checked=this.isOpen;//приводим в соответствие вид карты и содержимое объекта
        //if будет методом класса по сокрытию карты
        if (openCheckbox.checked) {
            cardImg.classList.remove("hidden-card")
        } else {
            cardImg.classList.add("hidden-card");
        }
        openCheckbox.onchange = () => {
            this.isOpen = openCheckbox.checked;
            if (openCheckbox.checked) {
                document.getElementById(this.cardId+"-img").classList.remove("hidden-card")
            } else {
                document.getElementById(this.cardId+"-img").classList.add("hidden-card");
            }
        }
        openIconWrp.appendChild(openIcon);
        openIconWrp.appendChild(openCheckbox);
        newCardControls.appendChild(openIconWrp);
//end open
        let newCardHTML = document.createElement("div");
        newCardHTML.className="card";
        newCardHTML.id=this.cardId;
        newCardHTML.style=`transform: scale(${this.scale})`;
        newCardHTML.style.zIndex = this.zIndex;
        newCardHTML.style.position="absolute";
        newCardHTML.style.top=this.top;
        newCardHTML.style.left=this.left;

        newCardHTML.appendChild(cardImgWrp);
        newCardHTML.appendChild(newCardControls);
        //drag&grop
        let setCoord = this.setCoord.bind(this);
        newCardControls.onmousedown=function(event){event.stopPropagation();}//Запрет drag&drop на меню

        newCardHTML.ondragstart = function() {
            return false;
        };
        newCardHTML.onmousedown = function(event) { // (1) отследить нажатие
            newCardHTML.style.zIndex = 1100;
            function moveAt(pageX, pageY) {
                let left = pageX - newCardHTML.offsetWidth / 2 + 'px';
                let top = pageY - newCardHTML.offsetHeight / 2 + 'px';
                newCardHTML.style.left = left;
                newCardHTML.style.top = top;
            }
        
            function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
            }
        
            document.addEventListener('mousemove', onMouseMove);
            
            newCardHTML.onmouseup = function() {
                setCoord(newCardHTML.style.top, newCardHTML.style.left);
                document.removeEventListener('mousemove', onMouseMove);
                newCardHTML.onmouseup = null;
                newCardHTML.style.zIndex = this.zIndex;
            };
    
        };

    //END drag&grop
        return newCardHTML;
    }

    addToField(top, left){
        this.top = top? top : this.top;
        this.left = top? left :this.left;
        
        let field = document.getElementById(this.fieldId);
        field.appendChild(this.createCardHTML());
        this.isOnField=true;
    }
    deleteFromField(){
        document.getElementById(this.cardId).remove();
        this.isOnField=false;
    }
  }


  let card = new Card();
  card.addToField()
  let card2 = new Card  ("emotion", "2", "170px", "120px");
  card2.addToField("200px","200px")