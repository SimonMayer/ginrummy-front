const state = {
    containerElement: null,
    availableHeight: null,
    isShowingBridgeCards: null,
    firstBridgeCardSpaceTaken: null,
    subsequentBridgeCardSpaceTaken: null,
    finalBridgeCardBottomPosition: null,
    maximumBridgeCardCapacity: null,
};

const mutations = {
    REGISTER_CONTAINER_ELEMENT(state, element) {
        state.containerElement = element;
    },
    SET_AVAILABLE_HEIGHT(state, availableHeight) {
        state.availableHeight = availableHeight;
    },
    SET_SHOWING_BRIDGE_CARDS(state, isShowingBridgeCards) {
        state.isShowingBridgeCards = isShowingBridgeCards;
    },
    SET_FIRST_BRIDGE_CARD_SPACE_TAKEN(state, spaceTaken) {
        state.firstBridgeCardSpaceTaken = parseFloat(spaceTaken);
    },
    SET_SUBSEQUENT_BRIDGE_CARD_SPACE_TAKEN(state, spaceTaken) {
        state.subsequentBridgeCardSpaceTaken = parseFloat(spaceTaken);
    },
    SET_FINAL_BRIDGE_CARD_BOTTOM_POSITION(state, position) {
        state.finalBridgeCardBottomPosition = parseFloat(position);
    },
    SET_MAXIMUM_BRIDGE_CARD_CAPACITY(state, capacity) {
        state.maximumBridgeCardCapacity = capacity;
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
    initializeCalculations({dispatch}) {
        dispatch('updateAvailableHeight');
        dispatch('updateCardType');
        dispatch('updateBridgeCardsSpaceTaken');
        dispatch('updateFinalBridgeCardBottomPosition');
        dispatch('updateMaximumBridgeCardCapacity');
    },
    updateAvailableHeight({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        const containerHeight = state.containerElement.getBoundingClientRect().height;
        const containerPaddingBottom = parseFloat(getComputedStyle(state.containerElement).paddingBottom);
        const discardPileComputedStyles = getComputedStyle(state.containerElement.querySelector('.discard-pile'));
        const discardPilePaddingBottom = parseFloat(discardPileComputedStyles.paddingBottom);
        const discardPileMarginBottom = parseFloat(discardPileComputedStyles.marginBottom);
        const unusableHeight = containerPaddingBottom + discardPilePaddingBottom + discardPileMarginBottom;

        const availableHeight = containerHeight - unusableHeight;

        commit('SET_AVAILABLE_HEIGHT', availableHeight);
        return availableHeight;
    },
    updateCardType({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        commit('SET_SHOWING_BRIDGE_CARDS', state.containerElement.classList.contains('bridge'));
    },
    updateBridgeCardsSpaceTaken({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.isShowingBridgeCards) {
            return;
        }
        const cards = state.containerElement.querySelectorAll('.discard-pile-card');

        if (!cards[0]) {
            return;
        }
        const firstCardBottomPosition = cards[0].getBoundingClientRect().bottom;
        const containerTopPosition = state.containerElement.getBoundingClientRect().top;
        commit('SET_FIRST_BRIDGE_CARD_SPACE_TAKEN', firstCardBottomPosition - containerTopPosition);

        if (!cards[1]) {
            return;
        }
        const secondCardBottomPosition = cards[1].getBoundingClientRect().bottom;
        commit('SET_SUBSEQUENT_BRIDGE_CARD_SPACE_TAKEN', secondCardBottomPosition - firstCardBottomPosition);
    },
    updateFinalBridgeCardBottomPosition({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.isShowingBridgeCards) {
            return;
        }
        const cards = state.containerElement.querySelectorAll('.discard-pile-card');

        if (!cards[0]) {
            return;
        }
        const lastCard = cards[cards.length - 1];

        commit('SET_FINAL_BRIDGE_CARD_BOTTOM_POSITION', lastCard.getBoundingClientRect().bottom);
    },
    updateMaximumBridgeCardCapacity({commit, state, rootGetters}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.availableHeight || !state.firstBridgeCardSpaceTaken || !state.subsequentBridgeCardSpaceTaken) {
            return null;
        }

        const viewportHeight = rootGetters['sessionState/domSizing/viewport/innerHeight'];

        let maximumBridgeCardCapacity;
        if (
            (state.finalBridgeCardBottomPosition > viewportHeight) ||
            (state.firstBridgeCardSpaceTaken > state.availableWidth)
        ) {
            maximumBridgeCardCapacity = 0;
        } else {
            const availableSpaceAfterFirstBridgeCard = state.availableHeight - state.firstBridgeCardSpaceTaken;
            const subsequentBridgeCardCount = Math.floor(
                availableSpaceAfterFirstBridgeCard / state.subsequentBridgeCardSpaceTaken,
            );

            maximumBridgeCardCapacity = 1 + subsequentBridgeCardCount;
        }

        commit('SET_MAXIMUM_BRIDGE_CARD_CAPACITY', maximumBridgeCardCapacity);
        return maximumBridgeCardCapacity;
    },
};

const getters = {
    maximumBridgeCardCapacity: state => state.maximumBridgeCardCapacity,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
