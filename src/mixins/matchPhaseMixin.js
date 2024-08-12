import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            getMatchById: 'matches/getMatchById',
            currentRoundId: 'matchPhaseTracker/getCurrentRoundId',
            latestRoundId: 'matchPhaseTracker/getLatestRoundId',
            matchId: 'matchPhaseTracker/getMatchId',
            visibleRoundId: 'matchPhaseTracker/getVisibleRoundId',
        }),
        match() {
            return this.getMatchById(this.matchId);
        },
    },
};
