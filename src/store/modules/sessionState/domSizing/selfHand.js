const state = {
    containerElement: null,
    availableWidth: null,
    availableHeight: null,
    isShowingBridgeCards: null,
    firstBridgeCardHorizontalSpaceTaken: null,
    subsequentBridgeCardHorizontalSpaceTaken: null,
    bridgeCardsBottomPosition: null,
    finalBridgeCardRightPosition: null,
    maximumBridgeCardCapacity: null,
};

const mutations = {
    REGISTER_CONTAINER_ELEMENT(state, element) {
        state.containerElement = element;
    },
    SET_AVAILABLE_WIDTH(state, availableWidth) {
        state.availableWidth = availableWidth;
    },
    SET_AVAILABLE_HEIGHT(state, availableHeight) {
        state.availableHeight = availableHeight;
    },
    SET_SHOWING_BRIDGE_CARDS(state, isShowingBridgeCards) {
        state.isShowingBridgeCards = isShowingBridgeCards;
    },
    SET_FIRST_BRIDGE_CARD_HORIZONTAL_SPACE_TAKEN(state, spaceTaken) {
        state.firstBridgeCardHorizontalSpaceTaken = parseFloat(spaceTaken);
    },
    SET_SUBSEQUENT_BRIDGE_CARD_HORIZONTAL_SPACE_TAKEN(state, spaceTaken) {
        state.subsequentBridgeCardHorizontalSpaceTaken = parseFloat(spaceTaken);
    },
    SET_BRIDGE_CARDS_BOTTOM_POSITION(state, position) {
        state.bridgeCardsBottomPosition = parseFloat(position);
    },
    SET_FINAL_BRIDGE_CARD_RIGHT_POSITION(state, position) {
        state.finalBridgeCardRightPosition = parseFloat(position);
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
        dispatch('updateAvailableWidth');
        dispatch('updateAvailableHeight');
        dispatch('updateCardType');
        dispatch('updateBridgeCardsHorizontalSpaceTaken');
        dispatch('updateBridgeCardsBottomPosition');
        dispatch('updateFinalBridgeCardRightPosition');
        dispatch('updateMaximumBridgeCardCapacity');
    },
    updateAvailableHeight({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        const containerHeight = state.containerElement.getBoundingClientRect().height;
        const containerPaddingBottom = parseFloat(getComputedStyle(state.containerElement).paddingBottom);
        const handComputedStyles = getComputedStyle(state.containerElement.querySelector('.hand'));
        const handPaddingBottom = parseFloat(handComputedStyles.paddingBottom);
        const handMarginBottom = parseFloat(handComputedStyles.marginBottom);
        const unusableHeight = containerPaddingBottom + handPaddingBottom + handMarginBottom;

        const availableHeight = containerHeight - unusableHeight;

        commit('SET_AVAILABLE_HEIGHT', availableHeight);
        return availableHeight;
    },
    updateAvailableWidth({commit, state}) {
        if (!state.containerElement) {
            return null;
        }

        const availableWidth = state.containerElement.getBoundingClientRect().width;
        commit('SET_AVAILABLE_WIDTH', availableWidth);
        return availableWidth;
    },
    updateCardType({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        commit('SET_SHOWING_BRIDGE_CARDS', state.containerElement.classList.contains('bridge'));
    },
    updateBridgeCardsHorizontalSpaceTaken({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.isShowingBridgeCards) {
            return;
        }
        const cards = state.containerElement.querySelectorAll('.self-hand-card');

        if (!cards[0]) {
            return;
        }
        const firstCardRightPosition = cards[0].getBoundingClientRect().right;
        const containerLeftPosition = state.containerElement.getBoundingClientRect().left;
        commit('SET_FIRST_BRIDGE_CARD_HORIZONTAL_SPACE_TAKEN', firstCardRightPosition - containerLeftPosition);

        if (!cards[1]) {
            return;
        }
        const secondCardRightPosition = cards[1].getBoundingClientRect().right;
        commit('SET_SUBSEQUENT_BRIDGE_CARD_HORIZONTAL_SPACE_TAKEN', secondCardRightPosition - firstCardRightPosition);
    },
    updateBridgeCardsBottomPosition({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.isShowingBridgeCards) {
            return;
        }
        const cards = state.containerElement.querySelectorAll('.self-hand-card');

        if (!cards[0]) {
            return;
        }

        const lowestBottomPosition = Array.from(cards).reduce(
            (currentLowestPosition, card) => {
                const bottomPosition = card.getBoundingClientRect().bottom;
                return bottomPosition < currentLowestPosition ? bottomPosition : currentLowestPosition;
            },
            Infinity,
        );

        commit('SET_BRIDGE_CARDS_BOTTOM_POSITION', lowestBottomPosition);
    },
    updateFinalBridgeCardRightPosition({commit, state}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.isShowingBridgeCards) {
            return;
        }
        const cards = state.containerElement.querySelectorAll('.self-hand-card');

        if (!cards[0]) {
            return;
        }
        const lastCard = cards[cards.length - 1];

        commit('SET_FINAL_BRIDGE_CARD_RIGHT_POSITION', lastCard.getBoundingClientRect().right);
    },
    updateMaximumBridgeCardCapacity({commit, state, rootGetters}) {
        if (!state.containerElement) {
            return null;
        }
        if (!state.availableWidth || !state.firstBridgeCardHorizontalSpaceTaken || !state.subsequentBridgeCardHorizontalSpaceTaken) {
            return null;
        }
        const viewportHeight = rootGetters['sessionState/domSizing/viewport/innerHeight'];
        const viewportWidth = rootGetters['sessionState/domSizing/viewport/innerWidth'];

        let maximumBridgeCardCapacity;
        if (
            (state.finalBridgeCardRightPosition > viewportWidth) ||
            (state.bridgeCardsBottomPosition > viewportHeight) ||
            (state.firstBridgeCardHorizontalSpaceTaken > state.availableWidth)
        ) {
            maximumBridgeCardCapacity = 0;
        } else {
            const availableSpaceAfterFirstBridgeCard = state.availableWidth - state.firstBridgeCardHorizontalSpaceTaken;
            const subsequentBridgeCardCount = Math.floor(
                availableSpaceAfterFirstBridgeCard / state.subsequentBridgeCardHorizontalSpaceTaken,
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
