import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            getMatchById: 'matches/matches/getMatchById',
            currentRoundId: 'trackers/derived/rounds/getCurrentRoundId',
            latestRoundId: 'trackers/derived/rounds/getLatestRoundId',
            matchId: 'trackers/matchPhase/getMatchId',
            visibleRoundId: 'trackers/derived/rounds/getVisibleRoundId',
        }),
        match() {
            return this.getMatchById(this.matchId);
        },
    },
};
