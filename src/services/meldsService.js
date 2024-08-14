const meldsService = {
    areAllCardsOfSameRank(cards) {
        if (cards.length === 0) {
            return false;
        }
        return cards.every(card => card.rank === cards[0].rank);
    },
    areAllCardsOfSameSuit(cards) {
        if (cards.length === 0) {
            return false;
        }
        return cards.every(card => card.suit === cards[0].suit);
    },
    getRankIndicesInRunOrder(ranks, runOrder) {
        return ranks.map(rank => runOrder.indexOf(rank));
    },
    areIndicesConsecutive(indices) {
        if (indices.includes(-1)) {
            return false;
        }
        const sortedIndices = [...indices].sort((a, b) => a - b);
        return sortedIndices.every((index, i) => i === 0 || index === sortedIndices[i - 1] + 1);
    },
    areRanksConsecutiveInRunOrder(ranks, runOrder){
        const indices = this.getRankIndicesInRunOrder(ranks, runOrder);
        return this.areIndicesConsecutive(indices);
    },
    doCardsMakeValidRun(cards, runOrders) {
        const ranks = cards.map(card => card.rank);
        return this.areAllCardsOfSameSuit(cards) && runOrders.some(runOrder => {
            return this.areRanksConsecutiveInRunOrder(ranks, runOrder);
        });
    },
    sortCardsByRunOrders(cards, runOrders) {
        const ranks = cards.map(card => card.rank);
        for (let runOrder of runOrders) {
            const indices = this.getRankIndicesInRunOrder(ranks, runOrder);
            if (this.areIndicesConsecutive(indices)) {
                return [...cards].sort((a, b) => runOrder.indexOf(a.rank) - runOrder.indexOf(b.rank));
            }
        }
        return cards;
    },
};

export default meldsService;
