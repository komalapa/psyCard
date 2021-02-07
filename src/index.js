//console.log(document.getElementsByClassName("card"))

class Card {
    constructor(deckId = "emotion", number="1",  height="170px", width="120px") {
      this.cardId = deckId + '-'+number;
      this.height = height;
      this.width = width;
      this.isRotated = false; //false - карта не перевернута на 180 градусов
      this.isMirrorred = false; //false - карта не отражена по вертикальной оси
      this.isOnField = false; //false - карта в колоде, не вынесена на поле
      this.isOpen = false; //false - рубашкой вверх
      this.coordinates = {"x":"30px", "y":"30px", "z":1} // x,y координаты для абсолютного позиционирования, z - z-индекс
      this.scale = 1;
      this.zIndex = 500;
      this.top = "50px";
      this.left = "50px";
      this.isOpen = true;
    }
    rotate(isRotated=false){
        this.isRotated=isRotated
    }
    mirror(isMirrorred){
        this.isMirrorred=isMirrorred;
    }

    cardMoving(){
        alert("move")
    }
  }

  function createCard(card){
    // <div class="card test-card third-card">

    // <div class="card-controls-wrp card-controls">
    //     <div class="card-rotate-btn">
    //         <div data-icon="e" class="icon card-icon card-icon-rotate"></div>
    //         <input type="checkbox" name="checkbox-rotate" id="" class="card-rotate-checkbox">
    //     </div>
    //     <div data-icon="g" class="icon card-icon"></div>
    //     <div data-icon="h" class="icon card-icon"></div>
    //     <div data-icon="i" class="icon card-icon"></div>
    //     <!-- <div data-icon="j" class="icon card-icon"></div> -->
    //     <div class="card-mirror-btn">
    //         <div data-icon="j" class="icon card-icon card-icon-rotate"></div>
    //         <input type="checkbox" name="checkbox-mirror" id="" class="card-mirror-checkbox">
    //     </div>
    // </div>
    // </div>
    let cardImgWrp = document.createElement("div");//оболочка позволяет отделить преобразования. Отражается изображение, а переворачивается оболочка.
    cardImgWrp.id=card.cardId+"-img-wrp";
    cardImgWrp.className="card-img-wrp"
    let cardImg = document.createElement("img");
    cardImg.src = "./img/king.png";
    cardImg.id=card.cardId +"-img";
    cardImgWrp.appendChild(cardImg)
    
    
    let newCardControls = document.createElement("div");
    newCardControls.className ="card-controls-wrp card-controls";
    
    
    let rotateIconWrp = document.createElement("div");
    rotateIconWrp.className="card-rotate-btn";

    let rotateIcon = document.createElement("div");
    rotateIcon.className="icon card-icon card-icon-rotate";
    rotateIcon.setAttribute("data-icon","e");
    
    rotateIconWrp.appendChild(rotateIcon);
    
    let rotateCheckbox = document.createElement("input");
    rotateCheckbox.type = "checkbox";
    rotateCheckbox.className = "card-rotate-checkbox";
    rotateCheckbox.id=card.cardId + "isrotated";
    rotateCheckbox.name=card.cardId + "isrotated";
    //rotateCheckbox.onmousedown =null;
    rotateCheckbox.onchange = () => {
        card.rotate(rotateCheckbox.checked)
        if (rotateCheckbox.checked) {
            document.getElementById(card.cardId+"-img-wrp").classList.add("rotated-card");
                
        } else {
            document.getElementById(card.cardId+"-img-wrp").classList.remove("rotated-card");;
        }
        
    }
    rotateIconWrp.appendChild(rotateCheckbox);
    
    newCardControls.appendChild(rotateIconWrp);

    let deleteIcon = document.createElement("div");
    deleteIcon.className="icon card-icon";
    deleteIcon.setAttribute("data-icon","g");
    deleteIcon.onclick = () => {
        alert("DELETE " + card.cardId);
        document.getElementById(card.cardId).remove();
        card.isOnField=false
    }
    newCardControls.appendChild(deleteIcon);

    let downIcon = document.createElement("div");
    downIcon.className="icon card-icon";
    downIcon.setAttribute("data-icon","h");
    downIcon.onclick = () => {
        //alert("DOWN " + card.cardId);
        if (card.zIndex>1){ 
            card.zIndex--;
            newCardHTML.style.zIndex=card.zIndex;
        } else {
            alert("Карта на нижнем слое");
        }
    }
    newCardControls.appendChild(downIcon);

    let upIcon = document.createElement("div");
    upIcon.className="icon card-icon";
    upIcon.setAttribute("data-icon","i");
    upIcon.onclick = () => {
        //alert("UP " + card.cardId);
        if (card.zIndex<1000){ 
            card.zIndex++;
            newCardHTML.style.zIndex=card.zIndex;
        } else {
            alert("Карта очень высоко");
        }
    }
    newCardControls.appendChild(upIcon);

    let scaleUpIcon = document.createElement("div");
    scaleUpIcon.className="icon card-icon";
    scaleUpIcon.setAttribute("data-icon","v");
    scaleUpIcon.onclick = () => {
        //alert("ScaleUP " + card.cardId);
        //card.scale=((card.scale+0.2)<5)?card.scale+0.2:card.scale;
        //newCardHTML.style=`transform: scale(${card.scale})`;
        if ((card.scale+0.2)<5){
            card.scale+=0.2;
            newCardHTML.style.transform= `scale(${card.scale})`;
        }
    }
    newCardControls.appendChild(scaleUpIcon);

    let scaleDownIcon = document.createElement("div");
    scaleDownIcon.className="icon card-icon";
    scaleDownIcon.setAttribute("data-icon","u");
    scaleDownIcon.onclick = () => {
        //alert("ScaleDown " + card.cardId);
        //card.scale=((card.scale-0.2)>0)?card.scale-0.2:card.scale;
        //newCardHTML.style=`transform: scale(${card.scale})`;
        if ((card.scale-0.2)>0.5){
            card.scale-=0.2;
            newCardHTML.style.transform= `scale(${card.scale})`;
        }
    }
    newCardControls.appendChild(scaleDownIcon);

    let mirrorIconWrp = document.createElement("div");
    mirrorIconWrp.className="card-mirror-btn";

    let mirrorIcon = document.createElement("div");
    mirrorIcon.className="icon card-icon";
    mirrorIcon.setAttribute("data-icon","j");
    mirrorIcon.onclick = () => alert("MIRROR " + card.cardId);
    let mirrorCheckbox = document.createElement("input");
    mirrorCheckbox.type = "checkbox";
    mirrorCheckbox.className = "card-mirror-checkbox";
    mirrorCheckbox.id=card.cardId + "ismirrorred";
    mirrorCheckbox.name=card.cardId + "ismirrorred";
    mirrorCheckbox.onchange = () => {
        //alert(rotateCheckbox.checked)
        card.mirror(mirrorCheckbox.checked);
        if (mirrorCheckbox.checked) {
            document.getElementById(card.cardId+"-img").classList.add("mirrorred-card")
        } else {
            document.getElementById(card.cardId+"-img").classList.remove("mirrorred-card");
        }
    }
    mirrorIconWrp.appendChild(mirrorIcon);
    mirrorIconWrp.appendChild(mirrorCheckbox);
    newCardControls.appendChild(mirrorIconWrp);
    
    let openIconWrp = document.createElement("div");
    openIconWrp.className="card-open-btn";
    let openIcon = document.createElement("div");
    openIcon.className="icon card-icon";
    openIcon.setAttribute("data-icon","l");
    //openIcon.onclick = () => alert("MIRROR " + card.cardId);
    let openCheckbox = document.createElement("input");
    openCheckbox.type = "checkbox";
    openCheckbox.className = "card-open-checkbox";
    openCheckbox.id=card.cardId + "isopen";
    openCheckbox.name=card.cardId + "isopen";
    openCheckbox.checked=card.isOpen;//приводим в соответствие вид карты и содержимое объекта
    //if будет методом класса по сокрытию карты
    if (openCheckbox.checked) {
        cardImg.classList.remove("hidden-card")
    } else {
        cardImg.classList.add("hidden-card");
    }
    openCheckbox.onchange = () => {
        //alert(openCheckbox.checked)
        card.isOpen = openCheckbox.checked;
        if (openCheckbox.checked) {
            document.getElementById(card.cardId+"-img").classList.remove("hidden-card")
        } else {
            document.getElementById(card.cardId+"-img").classList.add("hidden-card");
        }
    }
    openIconWrp.appendChild(openIcon);
    openIconWrp.appendChild(openCheckbox);
    newCardControls.appendChild(openIconWrp);

   // rotateIconWrp.appendChild(rotateIcon);

    let newCardHTML = document.createElement("div");
    newCardHTML.className="card test-card third-card";
    newCardHTML.id=card.cardId;
    newCardHTML.style=`transform: scale(${card.scale})`;
    newCardHTML.style.zIndex = card.zIndex;
    newCardHTML.style.position="absolute";
    newCardHTML.style.top=card.top;
    newCardHTML.style.left=card.left;

    newCardHTML.appendChild(cardImgWrp);
    newCardHTML.appendChild(newCardControls);
//drag&grop
newCardControls.onmousedown=function(event){event.stopPropagation();}//Запрет drag&drop на меню

newCardHTML.ondragstart = function() {
    return false;
  };
newCardHTML.onmousedown = function(event) { // (1) отследить нажатие
    newCardHTML.style.zIndex = 1100;
    moveAt(event.pageX, event.pageY);
  
    function moveAt(pageX, pageY) {
        newCardHTML.style.left = pageX - newCardHTML.offsetWidth / 2 + 'px';
        
        newCardHTML.style.top = pageY - newCardHTML.offsetHeight / 2 + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    document.addEventListener('mousemove', onMouseMove);
  
    newCardHTML.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      newCardHTML.onmouseup = null;
      newCardHTML.style.zIndex = card.zIndex;
    };
  
  };

//END drag&grop
    return newCardHTML;
  }
  let field = document.getElementById("field");
  let card = new Card();
  let newCard=createCard(card)
  field.appendChild(newCard);
  card.isOnField=true;
  let card2 = new Card  ("emotion", "2", "170px", "120px");
  let newCard2=createCard(card2)
  field.appendChild(newCard2);
  card2.isOnField=true;