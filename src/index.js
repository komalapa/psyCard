const FIELD_ID = "field";
const DECKS = [];//массив колод в комнате
let selectedDeck = 0;
//import('./card').then (module => {Card})
//import {Deck} from './deck'
//=================================================================================//
//                                  Карта                                          //
//=================================================================================//
class Card {
    constructor(deckId = "emotion", number="1", img="./img/king.png", height="170px", width="120px", scale=1, isHorizontal = false) {
      this.fieldId = FIELD_ID;
      this.deckId = deckId;
      this.cardId = deckId + '-'+number;
      this.height = height;
      this.width = width;
      this.isRotated = false; //false - карта не перевернута на 180 градусов
      this.isMirrorred = false; //false - карта не отражена по вертикальной оси
      this.isOnField = false; //false - карта в колоде, не вынесена на поле
      this.isOpen = false; //false - рубашкой вверх
      this.scale = scale;
      this.zIndex = 500;
      this.top = "50px";
      this.left = "50px";
      this.cardImg = img;
      this.isHorizontal = isHorizontal
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
        cardImg.src = this.cardImg;
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
        rotateCheckbox.id=this.cardId + "-isrotated";
        rotateCheckbox.name=this.cardId + "-isrotated";
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
        mirrorCheckbox.id=this.cardId + "-ismirrorred";
        mirrorCheckbox.name=this.cardId + "-ismirrorred";
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
        if (this.isHorizontal){
            newCardHTML.classList.add("card-horizontal")
        }
        newCardHTML.id=this.cardId;

        newCardHTML.style=`transform: scale(${this.scale})`;
        newCardHTML.style.zIndex = this.zIndex;
        //newCardHTML.style.position="absolute";
        newCardHTML.style.top=this.top;
        newCardHTML.style.left=this.left;
        newCardHTML.style.width=this.width;
        newCardHTML.style.height=this.height;

        newCardHTML.appendChild(cardImgWrp);
        newCardHTML.appendChild(newCardControls);
        //drag&grop
        let setCoord = this.setCoord.bind(this);
        newCardControls.onmousedown=function(event){event.stopPropagation();}//Запрет drag&drop на меню

        newCardHTML.ondragstart = function() {
            return false;
        };
        const that=this;
        newCardHTML.onmousedown = function(event) { // (1) отследить нажатие
            console.log(event)
            newCardHTML.style.zIndex = 1600; //убирать карту под меню неудобно
            if (!that.isOnField){
                //that.zIndex=1600;
                that.addToField(event.pageY - newCardHTML.offsetHeight / 2 + 'px',event.pageX - newCardHTML.offsetWidth / 2 + 'px')
                newCardHTML = document.getElementById(that.cardId)
                
            } 
            
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
                //console.log(that.zIndex)
                newCardHTML.style.zIndex = that.zIndex;
            };
        
        };

    //END drag&grop
        return newCardHTML;
    }

    addToField(top, left){
        if (!this.isOnField){
            this.top = top? top : this.top;
            this.left = top? left :this.left;
            
            let field = document.getElementById(this.fieldId);
            field.appendChild(this.createCardHTML());
            this.isOnField=true;
        }
        DECKS.map(item => {
            if (item.deckId == this.deckId && item.isShown){
                item.emptyDeckBox();
                item.showDeck()
            }
        })
    }
    deleteFromField(){
        document.getElementById(this.cardId).remove();
        this.isOnField=false;
        //console.log(this)
        DECKS.map(item => {
            if (item.deckId == this.deckId && item.isShown){
                item.emptyDeckBox();
                item.showDeck()
            }
        })
    }
    open(isOpen){
        //console.log(this)
        this.isOpen = (typeof isOpen !== 'undefined')  ? !this.isOpen : isOpen;
        document.getElementById(this.cardId + "-isopen").checked = this.isOpen;
        if (this.isOpen) {
            document.getElementById(this.cardId +"-img").classList.remove("hidden-card")
        } else {
            document.getElementById(this.cardId +"-img").classList.add("hidden-card");
        }

    }
  }
//=================================================================================//
//                                  Колода                                         //
//=================================================================================//
class Deck {
    constructor(deckId = "emotion", cardImgs,  height="170px", width="120px", scale = 1, isHorizontal = false) {
      this.fieldId = FIELD_ID;
      this.deckId = deckId;
      this.cardHeight = height;
      this.CardWidth = width;
      this.isShown = false;
      this.isOpen = false; //false - рубашкой вверх
      this.scale = 1;
      //this.zIndex = 500;//Нужен ли стартовый для колоды?
      this.cards = [];//Массив всех карт колоды
      cardImgs.map((item,index)=>this.cards[index]= new Card (deckId, index, item, height, width, scale, isHorizontal))
      this.pushCardOnField=this.pushCardOnField.bind(this);
      this.shuffle=this.shuffle.bind(this);
      this.open=this.open.bind(this);
      this.isHorizontal = isHorizontal
    }
    // genDeck(deckId,cardImgs, height="170px", width="120px", scale=1){
        
    //     cardImgs.map((item,index)=>this.cards[index]= new Card (deckId, index, item, height, width, scale))

    // }
    shuffle(){
        this.cards.sort(() => Math.random() - 0.5);
        this.emptyDeckBox();
        this.showDeck()
    }
    open(){
        //alert("open all cards in the deck")
        
        this.isOpen = !this.isOpen
        this.cards.map(item => {if(!item.isOnField){item.open(this.isOpen)}})
        //console.log(this.cards)
        this.emptyDeckBox();
        this.showDeck()
    }
    pushCardOnField(id=null, x="50px", y="50px"){
       // alert("pop any card if id==null")//Если id указан (например по двойному клику) то конкретная карта на поле
       // console.log(this)
        if (typeof id == "number") {
            this.cards[id].addToField()
        }else{
            const cardsInDeck = DECKS.filter(item => item.deckId == this.deckId)[0].cards.filter(item => !item.isOnField );
            if (cardsInDeck.length < 1) {
                alert("В колоде кончились карты");
                return
            }
            id = Math.floor(Math.random()*(cardsInDeck.length))
            //console.log(id)
            cardsInDeck[id].addToField()
        }
    }
    showDeck(){
        const deckElement = document.getElementById("deck-box");
        this.cards.map(item =>{
            if (!item.isOnField){
                deckElement.appendChild(item.createCardHTML());
            }
        })
        this.isShown = true;
        document.getElementById("deck-control-open-cards").checked = this.isOpen;
    }
    emptyDeckBox(){
        const deckElement = document.getElementById("deck-box");
        deckElement.innerHTML = '';
        this.isShown = false;
    }
}






//   let card = new Card();
//   card.addToField()
//   let card2 = new Card  ("emotion", "2", "./img/queen.png","170px", "120px");
//   card2.addToField("200px","200px")
//   let card3 = new Card  ("emotion", "3","./img/jack.png", "170px", "120px");
//   card3.addToField("300px","300px")

  const imgs = ["./img/king.png", "./img/queen.png","./img/jack.png","./img/king.png", "./img/queen.png","./img/jack.png"]
  DECKS.push(new Deck("poker", imgs));
  DECKS[0].pushCardOnField(0);
  DECKS[selectedDeck].showDeck()
  DECKS[selectedDeck].open()





//=================================================================================//
//                                  Кнопки                                         //
//=================================================================================//
//выброс карты
const pushToFieldBtn = document.getElementById("deck-push-to-field-btn");
pushToFieldBtn.onclick = DECKS[selectedDeck].pushCardOnField;
//перемешивание текущей колоды
const shuffleBtn = document.getElementById("deck-shuffle-btn");
shuffleBtn.onclick = () =>{
    DECKS[selectedDeck].shuffle;
}
//открытие текущей колоды
const openCardsBtn = document.getElementById("deck-open-cards-bth");
const openCardsCheckbox = document.getElementById("deck-control-open-cards");
openCardsBtn.onclick =() =>{
    console.log("open deck")
     DECKS[selectedDeck].open();
    }
openCardsCheckbox.checked = DECKS[selectedDeck].isOpen;
//Вид колоды
const cardsViewBtn = document.getElementById("deck-cards-view-bth");
const cardsViewCheckbox = document.getElementById("deck-control-cards-view");
cardsViewBtn.onclick = () =>{
    const deckBox= document.getElementById("deck-box");
    if (cardsViewCheckbox.checked){
        deckBox.classList.remove("cards-split")
        deckBox.classList.add("cards-overlap");
    } else {
        deckBox.classList.remove("cards-overlap")
        deckBox.classList.add("cards-split");
    }
}

//следующая колода
const nextDeckBtn = document.getElementById("next-deck-btn");
nextDeckBtn.onclick = () =>{
    console.log(selectedDeck, DECKS.length, (selectedDeck >= DECKS.length -1 ))
    selectedDeck = (selectedDeck >= DECKS.length -1 ) ? 0 : ++selectedDeck;
    console.log(selectedDeck)
    DECKS[selectedDeck].emptyDeckBox();
    DECKS[selectedDeck].showDeck();
}
//предыдущая колода
const prevDeckBtn = document.getElementById("prev-deck-btn");
prevDeckBtn.onclick = () =>{
    selectedDeck = (selectedDeck==0)? DECKS.length - 1 : --selectedDeck;
    console.log(selectedDeck)
    DECKS[selectedDeck].emptyDeckBox();
    DECKS[selectedDeck].showDeck();
}