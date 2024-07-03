Game.prototype.selectCard = function(playerIndex, cardIndex) {
    if (!this.hasDrawnCard) {
        alert('You must draw a card to begin your turn.');
        return;
    }

    const cardKey = `${playerIndex}-${cardIndex}`;
    const cardElement = document.getElementById(cardKey);

    if (this.selectedCards.includes(cardKey)) {
        this.selectedCards = this.selectedCards.filter(item => item !== cardKey);
        cardElement.classList.remove('selected');
    } else {
        this.selectedCards.push(cardKey);
        cardElement.classList.add('selected');
    }

    this.checkButtons();
};

Game.prototype.getSelectedCards = function() {
    return this.selectedCards.map(cardKey => {
        const [playerIndex, cardIndex] = cardKey.split('-').map(Number);
        return this.players[playerIndex].hand.cards[cardIndex];
    });
};
