const actions = {
    async processSseData({dispatch, rootGetters}, {data, matchId}) {
        const newCurrentRoundId = data.current_status.round_id;
        const newCurrentTurnId = data.current_status.turn_id;

        const latestActionId = rootGetters['storage/registry/matchAction/getLatestActionIdByMatchId'](matchId);
        if (data.action.action_id > latestActionId) {
            await dispatch('storage/registry/matchAction/setLatestActionId', {
                matchId,
                actionId: data.action.action_id,
            }, {root: true});
        }

        await dispatch('storage/turns/turns/appendActionToTurn', {turnId: data.turn_id, action: data.action}, {root: true});

        const roundChanged = newCurrentRoundId !== rootGetters['storage/registry/matchRound/getCurrentRoundIdByMatchId'](matchId);
        await dispatch('storage/registry/matchRound/setCurrentRoundId', {matchId, roundId: newCurrentRoundId}, {root: true});

        const currentRoundId = newCurrentRoundId;
        const latestRoundId = await rootGetters['storage/registry/matchRound/getLatestRoundIdByMatchId'](matchId);

        const betweenRounds = currentRoundId === null;
        const turnChanged = newCurrentTurnId !== rootGetters['storage/registry/roundTurn/getCurrentTurnByRoundId'](currentRoundId)?.id;
        const cardsDrawn = ['draw'].includes(data.action.action_type);
        const cardsMelded = ['play_meld', 'extend_meld'].includes(data.action.action_type);

        if (!betweenRounds && (roundChanged || turnChanged)) {
            await dispatch('storage/registry/roundTurn/fetchCurrentTurn', {
                matchId,
                roundId: currentRoundId,
                forceFetch: true,
            }, {root: true});
        }
        if (!betweenRounds && (turnChanged || cardsDrawn)) {
            await dispatch('storage/rounds/discardPiles/fetchDiscardPile', {
                roundId: latestRoundId,
                forceFetch: true,
            }, {root: true});
        }
        if (!betweenRounds && cardsDrawn) {
            await dispatch('storage/rounds/stockPiles/fetchStockPileData', {
                roundId: latestRoundId,
                forceFetch: true,
            }, {root: true});
        }
        if (cardsMelded) {
            await dispatch('storage/rounds/melds/fetchMelds', {roundId: latestRoundId, forceFetch: true}, {root: true});
        }
        if (roundChanged || turnChanged || cardsDrawn || cardsMelded) {
            await dispatch('storage/players/round/fetchPlayersRoundData', {
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
