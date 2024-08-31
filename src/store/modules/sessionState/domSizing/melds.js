function calculateBaseMeldWidth(meldElement) {
    const meldCardCount = meldElement.querySelectorAll('.card').length;
    const meldWidth = meldElement.getBoundingClientRect().width;

    return meldWidth / RELATIVE_BRIDGE_FORMAT_MELD_WIDTH_BY_SIZE[meldCardCount];
}

const RELATIVE_BRIDGE_FORMAT_MELD_WIDTH_BY_SIZE = {
    3: 1,
    4: 1.0125,
    5: 1.05,
    6: 1.0375,
    7: 1.075,
    8: 1.1125,
    9: 1.15,
    10: 1.1875,
    11: 1.225,
    12: 1.2625,
    13: 1.3,
};

const state = {
    maximumViewportHeightProportion: null,
    containerElement: null,
    availableWidth: null,
    availableHeight: null,
    meldCardCounts: null,
    isShowingBridgeCards: null,
    bridgeFormatHorizontalSpaceBetweenChildren: null,
    bridgeFormatPlayAreaContainerWidth: null,
    bridgeFormatBaseMeldWidth: null,
    bridgeFormatHeightRequired: null,
    unallocatedWidthProportion: null,
    unallocatedHeightProportion: null,
};

const mutations = {
    REGISTER_CONTAINER_ELEMENT(state, element) {
        state.containerElement = element;
    },
    SET_MAXIMUM_VIEWPORT_HEIGHT_PROPORTION(state, proportion) {
        state.maximumViewportHeightProportion = parseFloat(proportion);
    },
    SET_AVAILABLE_WIDTH(state, availableWidth) {
        state.availableWidth = parseFloat(availableWidth);
    },
    SET_AVAILABLE_HEIGHT(state, availableHeight) {
        state.availableHeight = parseFloat(availableHeight);
    },
    SET_MELD_CARD_COUNTS(state, meldCardCounts) {
        if (Array.isArray(meldCardCounts) && meldCardCounts.every(count => Number.isInteger(count))) {
            state.meldCardCounts = meldCardCounts;
        }
    },
    SET_SHOWING_BRIDGE_CARDS(state, isShowingBridgeCards) {
        state.isShowingBridgeCards = isShowingBridgeCards;
    },
    SET_BRIDGE_FORMAT_HORIZONTAL_SPACE_BETWEEN_CHILDREN(state, space) {
        state.bridgeFormatHorizontalSpaceBetweenChildren = parseFloat(space);
    },
    SET_BRIDGE_FORMAT_PLAY_AREA_CONTAINER_WIDTH(state, width) {
        state.bridgeFormatPlayAreaContainerWidth = parseFloat(width);
    },
    SET_BRIDGE_FORMAT_BASE_MELD_WIDTH(state, width) {
        state.bridgeFormatBaseMeldWidth = parseFloat(width);
    },
    SET_BRIDGE_FORMAT_HEIGHT_REQUIRED(state, height) {
        state.bridgeFormatHeightRequired = parseFloat(height);
    },
    SET_UNALLOCATED_WIDTH_PROPORTION(state, proportion) {
        state.unallocatedWidthProportion = parseFloat(proportion);
    },
    SET_UNALLOCATED_HEIGHT_PROPORTION(state, proportion) {
        state.unallocatedHeightProportion = parseFloat(proportion);
    },
    RESET_STATE(state) {
        Object.keys(state).forEach(key => {
            state[key] = null;
        });
    },
};

const actions = {
    registerContainerElement({commit}, element) {
        commit('RESET_STATE');
        commit('REGISTER_CONTAINER_ELEMENT', element);
    },
    setMaximumViewportHeightProportion({commit}, proportion) {
        commit('SET_MAXIMUM_VIEWPORT_HEIGHT_PROPORTION', proportion);
    },
    initializeCalculations({dispatch}) {
        dispatch('updateAvailableWidth');
        dispatch('updateAvailableHeight');
        dispatch('updateCardCountsPerMeld');
        dispatch('updateCardType');
        dispatch('updateInternalHorizontalSpaceTakenOnBridgeFormat');
        dispatch('updateInternalVerticalSpaceTakenOnBridgeFormat');
        dispatch('updateUnallocatedWidthProportion');
        dispatch('updateUnallocatedHeightProportion');
    },
    updateAvailableWidth({commit, state, rootGetters}) {
        if (!state.containerElement) {
            return null;
        }
        const children = state.containerElement.querySelectorAll('.meld, .play-area-container');
        const playAreaContainer = state.containerElement.querySelector('.play-area-container');

        const firstChildLeftPosition = children[0].getBoundingClientRect().left;
        const containerLeftPosition = state.containerElement.getBoundingClientRect().left;
        const leftUnusableSpace = firstChildLeftPosition - containerLeftPosition;

        const containerPaddingRight = parseFloat(getComputedStyle(state.containerElement).paddingRight);
        const playAreaContainerMarginRight = parseFloat(getComputedStyle(playAreaContainer).marginRight);

        const visibleContainerWidth = rootGetters['sessionState/domSizing/viewport/innerWidth'] - state.containerElement.getBoundingClientRect().left;
        const unusableSpace = leftUnusableSpace + containerPaddingRight + playAreaContainerMarginRight;
        const availableWidth = visibleContainerWidth - unusableSpace;

        commit('SET_AVAILABLE_WIDTH', availableWidth);
        return availableWidth;
    },
    updateAvailableHeight({commit, state, rootGetters}) {
        if (!state.containerElement) {
            return null;
        }
        const viewportHeight = rootGetters['sessionState/domSizing/viewport/innerHeight'];
        const maxHeightDueToViewportProportion = viewportHeight * state.maximumViewportHeightProportion;

        const containerComputedStyle = getComputedStyle(state.containerElement);
        const unusableHeight = parseFloat(containerComputedStyle.paddingTop) + parseFloat(containerComputedStyle.paddingBottom);
        const availableHeight = maxHeightDueToViewportProportion - unusableHeight;

        commit('SET_AVAILABLE_HEIGHT', availableHeight);
        return availableHeight;
    },
    updateCardCountsPerMeld({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        const melds = state.containerElement.querySelectorAll('.meld');
        if (!melds[0]) {
            return;
        }

        const meldCardCounts = Array.from(melds).map(
            meld => meld.querySelectorAll('.card').length,
        );
        commit('SET_MELD_CARD_COUNTS', meldCardCounts);
    },
    updateCardType({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        commit('SET_SHOWING_BRIDGE_CARDS', state.containerElement.classList.contains('bridge'));
    },
    updateInternalHorizontalSpaceTakenOnBridgeFormat({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.isShowingBridgeCards) {
            return;
        }
        const children = state.containerElement.querySelectorAll('.meld, .play-area-container');

        if (children[1]) {
            const bridgeFormatHorizontalSpaceBetweenChildren = children[1].getBoundingClientRect().left - children[0].getBoundingClientRect().right;
            commit('SET_BRIDGE_FORMAT_HORIZONTAL_SPACE_BETWEEN_CHILDREN', bridgeFormatHorizontalSpaceBetweenChildren);
        }

        const playAreaContainer = state.containerElement.querySelector('.play-area-container');
        commit('SET_BRIDGE_FORMAT_PLAY_AREA_CONTAINER_WIDTH', playAreaContainer.getBoundingClientRect().width);

        const melds = state.containerElement.querySelectorAll('.meld');
        if (!melds[0]) {
            return;
        }
        commit('SET_BRIDGE_FORMAT_BASE_MELD_WIDTH', calculateBaseMeldWidth(melds[0]));
    },
    updateInternalVerticalSpaceTakenOnBridgeFormat({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.isShowingBridgeCards) {
            return;
        }

        const children = state.containerElement.querySelectorAll('.meld, .play-area-container');

        const highestChildHeightRequired = Array.from(children).reduce(
            (currentHighestHeight, child) => {
                const computedStyle = getComputedStyle(child);
                const marginTop = parseFloat(computedStyle.marginTop);
                const marginBottom = parseFloat(computedStyle.marginBottom);
                const height = child.getBoundingClientRect().height + marginTop + marginBottom;
                return height > currentHighestHeight ? height : currentHighestHeight;
            },
            0,
        );
        commit('SET_BRIDGE_FORMAT_HEIGHT_REQUIRED', highestChildHeightRequired);
    },
    updateUnallocatedWidthProportion({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.availableWidth || !state.bridgeFormatPlayAreaContainerWidth) {
            return null;
        }

        let requiredWidth = state.bridgeFormatPlayAreaContainerWidth;
        for (const count of state.meldCardCounts) {
            const meldWidth = RELATIVE_BRIDGE_FORMAT_MELD_WIDTH_BY_SIZE[count] * state.bridgeFormatBaseMeldWidth;
            requiredWidth += meldWidth;
            requiredWidth += state.bridgeFormatHorizontalSpaceBetweenChildren;
        }

        const unallocatedWidthProportion = 1 - (requiredWidth / state.availableWidth);

        commit('SET_UNALLOCATED_WIDTH_PROPORTION', unallocatedWidthProportion);
        return unallocatedWidthProportion;
    },
    updateUnallocatedHeightProportion({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.availableHeight || !state.bridgeFormatHeightRequired) {
            return null;
        }

        const unallocatedHeightProportion = 1 - (state.bridgeFormatHeightRequired / state.availableHeight);
        commit('SET_UNALLOCATED_HEIGHT_PROPORTION', unallocatedHeightProportion);
        return unallocatedHeightProportion;
    },
};

const getters = {
    unallocatedWidthProportion: state => state.unallocatedWidthProportion,
    unallocatedHeightProportion: state => state.unallocatedHeightProportion,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
