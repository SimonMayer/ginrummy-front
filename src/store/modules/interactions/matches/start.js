import matchesService from '@/services/matchesService';

const actions = {
    async startMatch({ dispatch, rootGetters }) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const key = `startMatch_${matchId}`;
        const response = {key, responses: {}};

        dispatch('sessionState/indicators/loading/recordLoadingStart', key, { root: true });
        try {
            response.responses.startMatch = await matchesService.startMatch(matchId);

            response.responses.fetchMatch = await dispatch('storage/matches/matches/fetchMatch', { matchId, forceFetch: true }, { root: true });
            response.responses.fetchPlayersMatchData = await dispatch(
                'storage/players/matchData/fetchPlayersMatchData',
                { matchId, forceFetch: true },
                { root: true }
            );

            const currentRoundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
            response.responses.fetchCurrentTurn = await dispatch(
                'storage/registry/roundTurns/fetchCurrentTurn',
                { matchId, roundId: currentRoundId, forceFetch: true },
                { root: true }
            );

            response.responses.fetchPlayersRoundData = await dispatch(
                'storage/players/roundData/fetchPlayersRoundData',
                { roundId: currentRoundId, forceFetch: true },
                { root: true }
            );

            response.responses.initializeSse = await dispatch('storage/sse/connection/initializeSse', matchId, { root: true });
            response.isSuccess = true;
        } catch (error) {
            dispatch('sessionState/errorLog/addLogEntry', { title: 'Failed to start match!', error }, { root: true });
            response.isSuccess = false;
            response.error = error;
        } finally {
            dispatch('sessionState/indicators/loading/recordLoadingEnd', key, { root: true });
        }
        return response;
    },
};

export default {
    namespaced: true,
    actions,
};
