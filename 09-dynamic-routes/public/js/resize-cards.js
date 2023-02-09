const resizeCards = () => {
    const cardsMap = new Map();
    for (const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect();
        if (!cardsMap.get(rect.top)) {
            cardsMap.set(rect.top, []);
        }
        cardsMap.get(rect.top).push(card);
    }
    cardsMap.forEach((value, key) => {
        resizeRow(value);
    });
}

const resizeRow = (row) => {
    for (const card of row) {
        card.style.height = "auto";
    }
    let maxHeight = 0;
    for (const card of row) {
        const height = card.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    }
    for (const card of row) {
        card.style.height = maxHeight + "px";
    }
}

resizeCards();
window.onresize = resizeCards;