import {mapGetters} from 'vuex';

export default {
    computed: {
        ...mapGetters({
            getMatchById: 'storage/matches/matches/getMatchById',
            currentRoundId: 'sessionState/derived/rounds/currentRoundId',
            latestRoundId: 'sessionState/derived/rounds/latestRoundId',
            matchId: 'sessionState/matchIdentifier/getMatchId',
            visibleRoundId: 'sessionState/derived/rounds/visibleRoundId',
        }),
        match() {
            return this.getMatchById(this.matchId);
        },
    },
};
