import matchesService from '@/services/matchesService';

const actions = {
    async startMatch({ dispatch, rootGetters }) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const key = `startMatch_${matchId}`;

        dispatch('sessionState/indicators/loading/recordLoadingStart', key, { root: true });
        try {
            await matchesService.startMatch(matchId);

            await dispatch('storage/matches/matches/fetchMatch', { matchId, forceFetch: true }, { root: true });
            await dispatch(
                'storage/players/matchData/fetchPlayersMatchData',
                { matchId, forceFetch: true },
                { root: true }
            );

            const currentRoundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
            await dispatch(
                'storage/registry/roundTurns/fetchCurrentTurn',
                { matchId, roundId: currentRoundId, forceFetch: true },
                { root: true }
            );

            await dispatch(
                'storage/players/roundData/fetchPlayersRoundData',
                { roundId: currentRoundId, forceFetch: true },
                { root: true }
            );

            await dispatch('storage/sse/connection/initializeSse', matchId, { root: true });
        } catch (error) {
            dispatch('sessionState/errorLog/addLogEntry', { title: 'Failed to start match!', error }, { root: true });
        } finally {
            dispatch('sessionState/indicators/loading/recordLoadingEnd', key, { root: true });
        }
    },
};

export default {
    namespaced: true,
    actions,
};
