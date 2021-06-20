const FIELD_ID = "field";
const USER_ID = Math.random().toString(36).substr(2, 9);
const DECKS = []; //массив колод в комнате
let selectedDeck = null; 

function deleteAllCards() { //delete all cardc from field
    let onFieldElems = document.getElementById(FIELD_ID).childNodes;
    onFieldElems.forEach((e) => { //помечаем карты в колодах как не на поле
        if (e.classList && e.classList.contains("card")) {
            let cardDeck = DECKS.find((deck) => (deck.deckId == e.id.split("-")[0]));
            cardDeck.cards[e.id.split("-")[1]].reset();
        }
    })
    document.getElementById(FIELD_ID).innerHTML = '';
}

function fieldByText(text) { //put or move cards on field by json text config 
    try {
        let loadedData = JSON.parse(text);
        if (loadedData.length - 1 < document.getElementById('field').childNodes.length) {
            deleteAllCards();
        }

        loadedData.forEach(loadedCard => {
            if (loadedCard.userId) return;
            let curCard = DECKS.find(deck => (deck.deckId == loadedCard.deckId)).cards[loadedCard.cardId.split("-")[1]];
            curCard.isRotated = loadedCard.isRotated;
            curCard.isOpen = loadedCard.isOpen;
            curCard.isMirrorred = loadedCard.isMirrorred;
            curCard.scale = loadedCard.scale;
            curCard.zIndex = loadedCard.zIndex;
            curCard.top = loadedCard.top;
            curCard.left = loadedCard.left;
            let cardOnField = document.getElementById(curCard.cardId);
            if (cardOnField) {
                curCard.refreshByWS(curCard.top, curCard.left, curCard.isRotated, curCard.isOpen, curCard.isMirrorred, curCard.scale, curCard.zIndex);
            } else {
                curCard.addToField();
            }
        })
    } catch (err) {
        if (err) {
            console.log("Не удалось распознать данные", err);
        }
    }
}


function getDataForSend() { //prepare data for send or save
    const dataForSave = [{
        userId: USER_ID
    }];
    let onFieldElems = document.getElementById(FIELD_ID).childNodes
    onFieldElems.forEach((element) => { //собираем информацию о картах на поле:
        if (element.classList && element.classList.contains("card")) {
            let cardDeck = DECKS.find((deck) => (deck.deckId == element.id.split("-")[0]));
            dataForSave.push(cardDeck.cards[element.id.split("-")[1]]);
        }
    })
    return JSON.stringify(dataForSave);
}

//=================================================================================//
//                                 ws sync                                         //
//=================================================================================//
let socket = null;

function openWS(isReopening = false) {
    if (!socket || (socket.readyState !== socket.OPEN)) {
        socket = new WebSocket("ws://localhost:8080");
        socket.onopen = function (e) {
            console.log("[open] Соединение установлено");
            if (isReopening) alert("[open] Соединение установлено");
        };
        socket.onmessage = function (event) {
            fieldByText(event.data);
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                alert('[close] Соединение прервано');
            }
        };

        socket.onerror = function (error) {
            alert(`[error] Ошибка при соединение с сервером ${error.message}`);
        };
    } else {
        alert('Соединение активно');
    }
    //return socket
}
openWS();

function sendToWS() {
    socket.send(getDataForSend());
}

//=================================================================================//
//                                  Карта                                          //
//=================================================================================//
class Card {
    constructor(deckId = "emotion", number = "1", img = "./img/king.png", height = "170px", width = "120px", scale = 1, isHorizontal = false) {
        this.fieldId = FIELD_ID;
        this.deckId = deckId;
        this.cardId = deckId + '-' + number;
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
        this.isHorizontal = isHorizontal;
    }
    reset() {

        this.isRotated = false; //false - карта не перевернута на 180 градусов
        this.isMirrorred = false; //false - карта не отражена по вертикальной оси
        this.isOnField = false; //false - карта в колоде, не вынесена на поле
        this.isOpen = DECKS.find(deck => deck.deckId == this.deckId).isOpen; //false - рубашкой вверх
        this.scale = DECKS.find(deck => deck.deckId == this.deckId).scale;
        this.zIndex = 500;
        this.top = "50px";
        this.left = "50px";
    }
    setCoord(top, left) {
        this.top = top;
        this.left = left;
        sendToWS();
    }
    createCardHTML() {
        let cardImgWrp = document.createElement("div"); //оболочка позволяет отделить преобразования. Отражается изображение, а переворачивается оболочка.
        cardImgWrp.id = this.cardId + "-img-wrp";
        cardImgWrp.className = "card-img-wrp";

        let cardImg = document.createElement("img");
        cardImg.src = this.cardImg;
        cardImg.id = this.cardId + "-img";
        cardImgWrp.appendChild(cardImg);


        let newCardControls = document.createElement("div");
        newCardControls.className = "card-controls-wrp card-controls";

        //rotate    
        let rotateIconWrp = document.createElement("div");
        rotateIconWrp.className = "card-checkbox-btn card-rotate-btn";
        let rotateIcon = document.createElement("div");
        rotateIcon.className = "icon card-icon card-icon-rotate";
        rotateIcon.setAttribute("data-icon", "e");
        rotateIconWrp.appendChild(rotateIcon);

        let rotateCheckbox = document.createElement("input");
        rotateCheckbox.type = "checkbox";
        rotateCheckbox.className = "card-checkbox card-rotate-checkbox";
        rotateCheckbox.id = this.cardId + "-isrotated";
        rotateCheckbox.name = this.cardId + "-isrotated";
        rotateCheckbox.onchange = () => {
            this.isRotated = rotateCheckbox.checked;
            sendToWS();
            if (rotateCheckbox.checked) {
                document.getElementById(this.cardId + "-img-wrp").classList.add("rotated-card");
            } else {
                document.getElementById(this.cardId + "-img-wrp").classList.remove("rotated-card");
            }
        }
        rotateIconWrp.appendChild(rotateCheckbox); //собралась кнопка
        newCardControls.appendChild(rotateIconWrp);
        //end rotate
        let deleteIcon = document.createElement("div");
        deleteIcon.className = "icon card-icon";
        deleteIcon.setAttribute("data-icon", "g");
        deleteIcon.onclick = () => this.deleteFromField();

        newCardControls.appendChild(deleteIcon);

        let downIcon = document.createElement("div");
        downIcon.className = "icon card-icon";
        downIcon.setAttribute("data-icon", "h");
        downIcon.onclick = () => {
            if (this.zIndex > 1) {
                this.zIndex--;
                newCardHTML.style.zIndex = this.zIndex;
            } else {
                alert("Карта на нижнем слое");
            }
            sendToWS();
        }

        newCardControls.appendChild(downIcon);

        let upIcon = document.createElement("div");
        upIcon.className = "icon card-icon";
        upIcon.setAttribute("data-icon", "i");
        upIcon.onclick = () => {
            if (this.zIndex < 1000) {
                this.zIndex++;
                newCardHTML.style.zIndex = this.zIndex;
            } else {
                alert("Карта очень высоко");
            }
            sendToWS();
        }
        newCardControls.appendChild(upIcon);

        let scaleUpIcon = document.createElement("div");
        scaleUpIcon.className = "icon card-icon";
        scaleUpIcon.setAttribute("data-icon", "v");
        scaleUpIcon.onclick = () => {
            if ((this.scale + 0.2) <= 5) {
                this.scale += 0.2;
                newCardHTML.style.transform = `scale(${this.scale})`;
            }
            sendToWS();
        }
        newCardControls.appendChild(scaleUpIcon);

        let scaleDownIcon = document.createElement("div");
        scaleDownIcon.className = "icon card-icon";
        scaleDownIcon.setAttribute("data-icon", "u");
        scaleDownIcon.onclick = () => {
            if ((this.scale - 0.2) > 0.49) {
                this.scale -= 0.2;
                newCardHTML.style.transform = `scale(${this.scale})`;
            }
            sendToWS();
        }
        newCardControls.appendChild(scaleDownIcon);
        //mirror
        let mirrorIconWrp = document.createElement("div");
        mirrorIconWrp.className = "card-checkbox-btn card-mirror-btn";
        let mirrorIcon = document.createElement("div");
        mirrorIcon.className = "icon card-icon";
        mirrorIcon.setAttribute("data-icon", "j");
        let mirrorCheckbox = document.createElement("input");
        mirrorCheckbox.type = "checkbox";
        mirrorCheckbox.className = "card-checkbox card-mirror-checkbox";
        mirrorCheckbox.id = this.cardId + "-ismirrorred";
        mirrorCheckbox.name = this.cardId + "-ismirrorred";
        mirrorCheckbox.checked = this.isMirrorred;
        if (mirrorCheckbox.checked) {
            cardImg.classList.add("mirrorred-card");
        } else {
            cardImg.classList.remove("mirrorred-card");
        }
        mirrorCheckbox.onchange = () => {
            this.isMirrorred = mirrorCheckbox.checked;
            sendToWS();
            if (mirrorCheckbox.checked) {
                document.getElementById(this.cardId + "-img").classList.add("mirrorred-card");
            } else {
                document.getElementById(this.cardId + "-img").classList.remove("mirrorred-card");
            }
        }
        mirrorIconWrp.appendChild(mirrorIcon);
        mirrorIconWrp.appendChild(mirrorCheckbox);
        newCardControls.appendChild(mirrorIconWrp);
        //end mirror
        //open       
        let openIconWrp = document.createElement("div");
        openIconWrp.className = "card-checkbox-btn card-open-btn";
        let openIcon = document.createElement("div");
        openIcon.className = "icon card-icon";
        openIcon.setAttribute("data-icon", "l");
        let openCheckbox = document.createElement("input");
        openCheckbox.type = "checkbox";
        openCheckbox.className = "card-checkbox card-open-checkbox";
        openCheckbox.id = this.cardId + "-isopen";
        openCheckbox.name = this.cardId + "-isopen";
        openCheckbox.checked = this.isOpen; //приводим в соответствие вид карты и содержимое объекта
        //if будет методом класса по сокрытию карты
        if (openCheckbox.checked) {
            cardImg.classList.remove("hidden-card");
        } else {
            cardImg.classList.add("hidden-card");
        }
        openCheckbox.onchange = () => {
            this.isOpen = openCheckbox.checked;
            if (openCheckbox.checked) {
                document.getElementById(this.cardId + "-img").classList.remove("hidden-card");
            } else {
                document.getElementById(this.cardId + "-img").classList.add("hidden-card");
            }
            sendToWS();
        }
        openIconWrp.appendChild(openIcon);
        openIconWrp.appendChild(openCheckbox);
        newCardControls.appendChild(openIconWrp);
        //end open
        let newCardHTML = document.createElement("div");
        newCardHTML.className = "card";
        if (this.isHorizontal) {
            newCardHTML.classList.add("card-horizontal");
        }
        newCardHTML.id = this.cardId;

        newCardHTML.style = `transform: scale(${this.scale})`;
        newCardHTML.style.zIndex = this.zIndex;
        newCardHTML.style.top = this.top;
        newCardHTML.style.left = this.left;
        newCardHTML.style.width = this.width;
        newCardHTML.style.height = this.height;

        newCardHTML.appendChild(cardImgWrp);
        newCardHTML.appendChild(newCardControls);
        //drag&grop
        let setCoord = this.setCoord.bind(this);
        newCardControls.onmousedown = function (event) {
            event.stopPropagation();
        } //Запрет drag&drop на меню

        newCardHTML.ondragstart = function () {
            return false;
        };
        const that = this;
        newCardHTML.onmousedown = function (event) { // (1) отследить нажатие
            let timer = setInterval(() => {
                setCoord(newCardHTML.style.top, newCardHTML.style.left);
            }, 100); //for send to ws
            if (newCardHTML.onmouseup) { //Если карта ждет события прекращаем все события на ней, значит был клик и событие mouseup не сработало
                window.addEventListener(onmousemove, function (event) {
                    event.stopPropagation();
                    clearInterval(timer);
                }, true);
            } else {
                newCardHTML.style.zIndex = 1600; //убирать карту под меню неудобно
                if (!that.isOnField) {
                    that.addToField(event.pageY - newCardHTML.offsetHeight / 2 + 'px', event.pageX - newCardHTML.offsetWidth / 2 + 'px');
                    newCardHTML = document.getElementById(that.cardId);
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

                newCardHTML.onmouseup = function () {
                    setCoord(newCardHTML.style.top, newCardHTML.style.left);
                    document.removeEventListener('mousemove', onMouseMove);
                    newCardHTML.onmouseup = null;
                    newCardHTML.style.zIndex = that.zIndex;
                    clearInterval(timer);
                }
            }
        }
        //END drag&grop
        return newCardHTML;
    }

    addToField(top, left) {
        if (!this.isOnField) {
            this.top = top ? top : this.top;
            this.left = top ? left : this.left;
            
            let field = document.getElementById(this.fieldId);
            field.appendChild(this.createCardHTML());
            this.isOnField = true;
        }
        DECKS.map(item => {
            if (item.deckId == this.deckId && item.isShown) {
                item.emptyDeckBox();
                item.showDeck();
            }
        })
    }
    deleteFromField() {
        document.getElementById(this.cardId).remove();
        this.isOnField = false;
        this.reset();
        this.isOpen = DECKS.find(deck => deck.deckId == this.deckId).isOpen;
        DECKS.map(item => {
            if (item.deckId == this.deckId && item.isShown) {
                item.emptyDeckBox();
                item.showDeck();
            }
        })
        sendToWS();
    }
    open(isOpen) {
        this.isOpen = (typeof isOpen !== 'undefined') ? !this.isOpen : isOpen;
        document.getElementById(this.cardId + "-isopen").checked = this.isOpen;
        if (this.isOpen) {
            document.getElementById(this.cardId + "-img").classList.remove("hidden-card");
        } else {
            document.getElementById(this.cardId + "-img").classList.add("hidden-card");
        }
    }

    refreshByWS(top, left, isRotated, isOpen, isMirrorred, scale, zIndex) {
        const card = document.getElementById(this.cardId);
        const cardImg = document.getElementById(this.cardId + "-img");
        const cardImgWrp = document.getElementById(this.cardId + "-img-wrp");
        card.style.top = top;
        card.style.left = left;
        card.style.zIndex = zIndex;
        card.style.transform = `scale(${scale})`;

        const rotateCheckbox = document.getElementById(this.cardId + "-isrotated");
        rotateCheckbox.checked = isRotated;
        if (rotateCheckbox.checked) {
            cardImgWrp.classList.add("rotated-card");
        } else {
            cardImgWrp.classList.remove("rotated-card");;
        }

        const openCheckbox = document.getElementById(this.cardId + "-isopen");
        openCheckbox.checked = isOpen;

        if (openCheckbox.checked) {
            cardImg.classList.remove("hidden-card");
        } else {
            cardImg.classList.add("hidden-card");
        }

        const mirrorCheckbox = document.getElementById(this.cardId + "-ismirrorred");
        mirrorCheckbox.checked = isMirrorred;
        if (mirrorCheckbox.checked) {
            cardImg.classList.add("mirrorred-card");
        } else {
            cardImg.classList.remove("mirrorred-card");
        }
    }
}
//=================================================================================//
//                                  Колода                                         //
//=================================================================================//
class Deck {
    constructor(name = "Колода", deckId = "emotion", cardImgs, height = "170px", width = "120px", scale = 1, isHorizontal = false) {
        this.fieldId = FIELD_ID;
        this.deckId = deckId;
        this.cardHeight = height;
        this.CardWidth = width;
        this.isShown = false;
        this.isOpen = false; //false - рубашкой вверх
        this.scale = 1;
        this.cards = []; //Массив всех карт колоды
        cardImgs.map((item, index) => this.cards[index] = new Card(deckId, index, item, height, width, scale, isHorizontal));
        this.pushCardOnField = this.pushCardOnField.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.open = this.open.bind(this);
        this.isHorizontal = isHorizontal;
        this.isAvaluable = false; //Для полного списка колод. Доступны в лотке будут только помеченные доступными в общем списке
        this.name = name;
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
        this.emptyDeckBox();
        this.showDeck();
    }
    open() {
        this.isOpen = !this.isOpen;
        this.cards.map(item => {
            if (!item.isOnField) {
                item.open(this.isOpen);
            }
        })
        this.emptyDeckBox();
        this.showDeck();
    }
    pushCardOnField(id = null, x = "50px", y = "50px") {
        if (typeof id == "number") {
            this.cards[id].addToField();
        } else {
            const cardsInDeck = DECKS.filter(item => item.deckId == this.deckId)[0].cards.filter(item => !item.isOnField);
            if (cardsInDeck.length < 1) {
                alert("В колоде кончились карты");
                return
            }
            id = Math.floor(Math.random() * (cardsInDeck.length));
            cardsInDeck[id].addToField();
        }
        sendToWS();
    }
    showDeck() {
        const deckElement = document.getElementById("deck-box");
        this.cards.map(item => {
            if (!item.isOnField) {
                deckElement.appendChild(item.createCardHTML());
            }
        })
        this.isShown = true;
        document.getElementById("deck-control-open-cards").checked = this.isOpen;
    }
    emptyDeckBox() {
        const deckElement = document.getElementById("deck-box");
        deckElement.innerHTML = '';
        this.isShown = false;
    }
}

//Меню выбора колоды
const genDeckSelectorMenu = () => {
    const deckSelector = document.getElementById("deck-select-menu");
    deckSelector.innerHTML = '';
    for (let i = 0; i < DECKS.length; i++) {
        let menuItem = document.createElement("li");
        let menuItemLabel = document.createElement("label");
        menuItemLabel.innerText = DECKS[i].name;
        let menuItemCheckbox = document.createElement("input");
        menuItemCheckbox.type = "checkbox";
        menuItemCheckbox.name = DECKS[i].deckId;
        menuItemCheckbox.checked = DECKS[i].isAvaluable;
        menuItemCheckbox.onclick = () => {
            DECKS[i].isAvaluable = menuItemCheckbox.checked;
            if (menuItemCheckbox.checked) {
                let newAvailableDeck = document.createElement("li");
                newAvailableDeck.id = "available-deck-" + i;
                newAvailableDeck.title = DECKS[i].name;
                if (typeof (selectedDeck) == "number") { //(document.getElementById("available-deck-"+selectedDeck)){
                    document.getElementById("available-deck-" + selectedDeck).classList.remove("selected-deck");
                    DECKS[selectedDeck].emptyDeckBox();
                }
                newAvailableDeck.classList.add("selected-deck");
                selectedDeck = i;
                DECKS[selectedDeck].emptyDeckBox();
                DECKS[selectedDeck].showDeck();
                newAvailableDeck.onclick = () => {
                    if (typeof (selectedDeck) == "number") { //(document.getElementById("available-deck-"+selectedDeck)){
                        document.getElementById("available-deck-" + selectedDeck).classList.remove("selected-deck");
                        DECKS[selectedDeck].emptyDeckBox();
                    }

                    selectedDeck = i;
                    DECKS[selectedDeck].showDeck();
                    document.getElementById("available-deck-" + selectedDeck).classList.add("selected-deck");
                }
                document.getElementById("available-decks-selector").appendChild(newAvailableDeck);
            } else {
                document.getElementById("available-deck-" + i).remove();
                if (selectedDeck == i) {
                    DECKS[selectedDeck].emptyDeckBox();
                    selectedDeck = null;
                }
            }
        }

        menuItemLabel.prepend(menuItemCheckbox);
        menuItem.appendChild(menuItemLabel);
        deckSelector.appendChild(menuItem);
    }
}

//Добавление колоды в интерфейс. Используется в файлах колод
const addDeck = (name, id, imgs, height = "170px", width = "120px", scale = 1, isHorizontal = false) => {
    DECKS.push(new Deck(name, id, imgs, height, width, scale, isHorizontal));
    genDeckSelectorMenu();
}

//DEBUG
const imgsPoker = ["./img/king.png", "./img/queen.png", "./img/jack.png", "./img/king.png", "./img/queen.png", "./img/jack.png"]
addDeck("Покерная колода", "poker", imgsPoker);
//endDEBUG

//=================================================================================//
//                                  Кнопки колоды                                  //
//=================================================================================//
//выброс карты
const pushToFieldBtn = document.getElementById("deck-push-to-field-btn");
pushToFieldBtn.onclick = () => {
    if (typeof (selectedDeck) == "number") {
        DECKS[selectedDeck].pushCardOnField();
    }
};
//перемешивание текущей колоды
const shuffleBtn = document.getElementById("deck-shuffle-btn");
shuffleBtn.onclick = () => {
    if (typeof (selectedDeck) == "number") {
        DECKS[selectedDeck].shuffle();
    }
}
//открытие текущей колоды
const openCardsBtn = document.getElementById("deck-open-cards-bth");
const openCardsCheckbox = document.getElementById("deck-control-open-cards");
openCardsBtn.onclick = () => {
    if (typeof (selectedDeck) == "number") {
        DECKS[selectedDeck].open();
    }
}
openCardsCheckbox.checked = selectedDeck ? DECKS[selectedDeck].isOpen : false;
//Вид колоды
const cardsViewBtn = document.getElementById("deck-cards-view-bth");
const cardsViewCheckbox = document.getElementById("deck-control-cards-view");
cardsViewBtn.onclick = () => {
    const deckBox = document.getElementById("deck-box");
    if (cardsViewCheckbox.checked) {
        deckBox.classList.remove("cards-split");
        deckBox.classList.add("cards-overlap");
    } else {
        deckBox.classList.remove("cards-overlap");
        deckBox.classList.add("cards-split");
    }
}

//следующая колода
const nextDeckBtn = document.getElementById("next-deck-btn");
nextDeckBtn.onclick = () => {
    if (typeof (selectedDeck) == "number") {
        const oldSelectedDeck = selectedDeck;
        selectedDeck = (selectedDeck >= DECKS.length - 1) ? 0 : ++selectedDeck;
        while (!DECKS[selectedDeck].isAvaluable && selectedDeck != oldSelectedDeck) {
            selectedDeck = (selectedDeck >= DECKS.length - 1) ? 0 : ++selectedDeck;
        }
        if (selectedDeck != oldSelectedDeck) {
            DECKS[oldSelectedDeck].emptyDeckBox();
            DECKS[selectedDeck].showDeck();
            document.getElementById("available-deck-" + oldSelectedDeck).classList.remove("selected-deck");
            document.getElementById("available-deck-" + selectedDeck).classList.add("selected-deck");
        }
    }
}
//предыдущая колода
const prevDeckBtn = document.getElementById("prev-deck-btn");
prevDeckBtn.onclick = () => {
    if (typeof (selectedDeck) == "number") {
        const oldSelectedDeck = selectedDeck;
        selectedDeck = (selectedDeck == 0) ? DECKS.length - 1 : --selectedDeck;
        while (!DECKS[selectedDeck].isAvaluable && selectedDeck != oldSelectedDeck) {
            selectedDeck = (selectedDeck == 0) ? DECKS.length - 1 : --selectedDeck;
        }
        if (selectedDeck != oldSelectedDeck) {
            DECKS[oldSelectedDeck].emptyDeckBox();
            DECKS[selectedDeck].showDeck();
            document.getElementById("available-deck-" + oldSelectedDeck).classList.remove("selected-deck");
            document.getElementById("available-deck-" + selectedDeck).classList.add("selected-deck");
        }
    }
}


//=================================================================================//
//                                  Кнопки меню                                    //
//=================================================================================//
//new
const newFieldBtn = document.getElementById("newFieldBtn");
newFieldBtn.onclick = () => {
    if (confirm("Очистить поле? Восстановить расположение карт будет невозможно!")) {
        deleteAllCards();
        if (typeof (selectedDeck) == "number") {
            DECKS[selectedDeck].emptyDeckBox();
            document.getElementById("available-deck-" + selectedDeck).classList.remove("selected-deck");
            selectedDeck = null;
        }
        sendToWS();
    }
}
//open
document.getElementById("openField").onclick = () => {
    let openForm = document.createElement("form");
    openForm.id = "open-field-form";
    openForm.style.position = "absolute";
    openForm.style.width = "50%";
    openForm.style.height = "50%";
    let savedTextField = document.createElement("textarea");
    savedTextField.style.width = "100%";
    savedTextField.style.height = "100%";
    savedTextField.placeholder = "Вставьте текст сохранения сюда";
    document.getElementById(FIELD_ID).appendChild(openForm);

    savedTextField.onkeydown = (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            fieldByText(savedTextField.value);
            openForm.remove();
            sendToWS();
        }
        if ((event.key == 'Escape') || (event.key == 'Esc')) {
            event.preventDefault();
            openForm.remove();
        }
    }

    openForm.appendChild(savedTextField);
    // openForm.onsubmit = (evt) => {
    //     evt.preventDefault();
    //     try {
    //         let newDECKS = JSON.parse(savedTextField.value)
    //     } catch {
    //         alert("Не удалось распознать данные")
    //     }
    //     document.getElementById("openForm").remove();
    // }



};
//save
document.getElementById("saveField").onclick = () => {
    navigator.clipboard.writeText(getDataForSend())
        .then(() => {
            alert("Данные скопированы. Сохраните скопированные данные в пустой текстовый файл");
        })
        .catch(err => {
            console.log('Something went wrong', err);
        });

};
//link
document.getElementById("linkToField").onclick = () => openWS(true); //alert ("Сетевые функции пока не готовы");

//grid
const fieldGridBtn = document.getElementById("control-field-grid-bth");
const fieldGridCheckBox = document.getElementById("control-field-grid");

fieldGridBtn.onclick = () => {
    const field = document.getElementById(FIELD_ID);
    if (fieldGridCheckBox.checked) {
        if (fieldChessCheckBox) {
            fieldChessCheckBox.checked = false;
            field.classList.remove("chess-on-field");
        }
        field.classList.add("grid-on-field");
    } else {
        field.classList.remove("grid-on-field");
    }
}

//chess
const fieldChessBtn = document.getElementById("control-field-chess-bth");
const fieldChessCheckBox = document.getElementById("control-field-chess");

fieldChessBtn.onclick = () => {
    const field = document.getElementById(FIELD_ID);
    if (fieldChessCheckBox.checked) {
        if (fieldGridCheckBox.checked) {
            fieldGridCheckBox.checked = false;
            field.classList.remove("grid-on-field");
        }
        field.classList.add("chess-on-field");
    } else {
        field.classList.remove("chess-on-field");
    }
}