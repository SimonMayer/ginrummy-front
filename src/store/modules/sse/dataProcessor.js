const actions = {
    async processSSEData({dispatch, rootGetters}, {data, matchId}) {
        const newCurrentRoundId = data.current_status.round_id;
        const newCurrentTurnId = data.current_status.turn_id;

        const latestActionId = rootGetters['registry/matchAction/getLatestActionIdByMatchId'](matchId);
        if (data.action.action_id > latestActionId) {
            await dispatch('registry/matchAction/setLatestActionId', {
                matchId,
                actionId: data.action.action_id,
            }, {root: true});
        }

        await dispatch('turns/appendActionToTurn', {turnId: data.turn_id, action: data.action}, {root: true});

        const roundChanged = newCurrentRoundId !== rootGetters['registry/matchRound/getCurrentRoundIdByMatchId'](matchId);
        await dispatch('registry/matchRound/setCurrentRoundId', {matchId, roundId: newCurrentRoundId}, {root: true});

        const currentRoundId = newCurrentRoundId;
        const latestRoundId = await rootGetters['registry/matchRound/getLatestRoundIdByMatchId'](matchId);

        const betweenRounds = currentRoundId === null;
        const turnChanged = newCurrentTurnId !== rootGetters['registry/roundTurn/getCurrentTurnByRoundId'](currentRoundId)?.id;
        const cardsDrawn = ['draw'].includes(data.action.action_type);
        const cardsMelded = ['play_meld', 'extend_meld'].includes(data.action.action_type);

        if (!betweenRounds && (roundChanged || turnChanged)) {
            await dispatch('registry/roundTurn/fetchCurrentTurn', {
                matchId,
                roundId: currentRoundId,
                forceFetch: true,
            }, {root: true});
        }
        if (!betweenRounds && (turnChanged || cardsDrawn)) {
            await dispatch('rounds/discardPiles/fetchDiscardPile', {
                roundId: latestRoundId,
                forceFetch: true,
            }, {root: true});
        }
        if (!betweenRounds && cardsDrawn) {
            await dispatch('rounds/stockPiles/fetchStockPileData', {
                roundId: latestRoundId,
                forceFetch: true,
            }, {root: true});
        }
        if (cardsMelded) {
            await dispatch('rounds/melds/fetchMelds', {roundId: latestRoundId, forceFetch: true}, {root: true});
        }
        if (roundChanged || turnChanged || cardsDrawn || cardsMelded) {
            await dispatch('players/round/fetchPlayersRoundData', {
                roundId: latestRoundId,
                forceFetch: !roundChanged || betweenRounds,
            }, {root: true});
        }
    },
};

export default {
    namespaced: true,
    actions,
};
