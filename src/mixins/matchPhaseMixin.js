import {mapGetters} from 'vuex';

export default {
    computed: {
        ...mapGetters({
            getMatchById: 'matches/matches/getMatchById',
            currentRoundId: 'trackers/derived/rounds/currentRoundId',
            latestRoundId: 'trackers/derived/rounds/latestRoundId',
            matchId: 'trackers/matchPhase/getMatchId',
            visibleRoundId: 'trackers/derived/rounds/visibleRoundId',
        }),
        match() {
            return this.getMatchById(this.matchId);
        },
    },
};
