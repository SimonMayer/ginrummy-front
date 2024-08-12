import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            getMatchById: 'matches/matches/getMatchById',
            currentRoundId: 'trackers/matchPhase/getCurrentRoundId',
            latestRoundId: 'trackers/matchPhase/getLatestRoundId',
            matchId: 'trackers/matchPhase/getMatchId',
            visibleRoundId: 'trackers/matchPhase/getVisibleRoundId',
        }),
        match() {
            return this.getMatchById(this.matchId);
        },
    },
};
