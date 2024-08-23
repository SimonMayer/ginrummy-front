const state = {
    draggedVisibleCardIds: [],
    draggedNamedHiddenCard: null,
    draggedVisibleCardsImage: null,
    draggedHiddenCardImage: null,
    isDraggingItems: false,
};

const mutations = {
    REGISTER_DRAGGED_VISIBLE_CARDS_IMAGE(state, draggedVisibleCardsImage) {
        state.draggedVisibleCardsImage = draggedVisibleCardsImage;
    },
    REGISTER_DRAGGED_HIDDEN_CARD_IMAGE(state, draggedHiddenCardImage) {
        state.draggedHiddenCardImage = draggedHiddenCardImage;
    },
    START_DRAGGING_CARDS(state, {cardIds}) {
        state.draggedVisibleCardIds = cardIds;
        state.isDraggingItems = true;
    },
    START_DRAGGING_NAMED_HIDDEN_CARD(state, {name}) {
        state.draggedNamedHiddenCard = name;
        state.isDraggingItems = true;
    },
    STOP_DRAGGING_ITEMS(state) {
        state.isDraggingItems = false;
    },
    CLEAR_DRAGGED_ITEMS(state) {
        state.draggedVisibleCardIds = [];
        state.draggedNamedHiddenCard = null;
    },
};

const actions = {
    registerVisibleCardsImage({commit}, draggedVisibleCardsImage) {
        commit('REGISTER_DRAGGED_VISIBLE_CARDS_IMAGE', draggedVisibleCardsImage);
    },
    registerDraggedHiddenCardImage({commit}, draggedHiddenCardImage) {
        commit('REGISTER_DRAGGED_HIDDEN_CARD_IMAGE', draggedHiddenCardImage);
    },
    async startDraggingVisibleCards({commit, dispatch, rootGetters, state}, {eventCardId, event}) {
        const selectedCardIds = rootGetters['sessionState/derived/selectedItems/allSelectedCardIds'];
        if (!selectedCardIds.includes(eventCardId)) {
            await dispatch('sessionState/uiOperations/selections/addSelectedCard', eventCardId, {root: true});
            selectedCardIds.push(eventCardId);
        }
        if (event?.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(state.draggedVisibleCardsImage, 0, 0);
        }

        dispatch('clearDraggedItems');
        commit('START_DRAGGING_CARDS', {cardIds: selectedCardIds});
    },
    async startDraggingNamedHiddenCard({commit, dispatch}, {name, event}) {
        if (event?.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(state.draggedHiddenCardImage, 0, 0);
        }

        dispatch('clearDraggedItems');
        commit('START_DRAGGING_NAMED_HIDDEN_CARD', {name});
    },
    stopDraggingItems({commit}) {
        commit('STOP_DRAGGING_ITEMS');
    },
    clearDraggedItems({commit}) {
        commit('CLEAR_DRAGGED_ITEMS');
    },
};

const getters = {
    isDraggingItems: (state) => state.isDraggingItems,
    draggedNamedHiddenCard: (state) => state.draggedNamedHiddenCard,
    draggedVisibleCardCount: (state) => state.draggedVisibleCardIds.length,
    draggedVisibleCardIds: (state) => state.draggedVisibleCardIds,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
