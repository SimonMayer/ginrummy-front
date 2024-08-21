const state = {
    draggedVisibleCardIds: [],
    draggedNamedHiddenCard: null,
    draggedVisibleCardsImage: null,
    draggedHiddenCardImage: null,
    event: null,
    isDraggingItems: false,
};

const mutations = {
    REGISTER_DRAGGED_VISIBLE_CARDS_IMAGE(state, draggedVisibleCardsImage) {
        state.draggedVisibleCardsImage = draggedVisibleCardsImage;
    },
    REGISTER_DRAGGED_HIDDEN_CARD_IMAGE(state, draggedHiddenCardImage) {
        state.draggedHiddenCardImage = draggedHiddenCardImage;
    },
    START_DRAGGING_CARDS(state, {cardIds, event}) {
        state.draggedVisibleCardIds = cardIds;
        state.isDraggingItems = true;
        state.event = event;
    },
    START_DRAGGING_NAMED_HIDDEN_CARD(state, {name, event}) {
        state.draggedNamedHiddenCard = name;
        state.isDraggingItems = true;
        state.event = event;
    },
    STOP_DRAGGING_ITEMS(state) {
        state.isDraggingItems = false;
        state.event = null;
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
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setDragImage(state.draggedVisibleCardsImage, 0, 0);

        dispatch('clearDraggedItems');
        commit('START_DRAGGING_CARDS', {cardIds: selectedCardIds, event});
    },
    async startDraggingNamedHiddenCard({commit, dispatch}, {name, event}) {
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setDragImage(state.draggedHiddenCardImage, 0, 0);

        dispatch('clearDraggedItems');
        commit('START_DRAGGING_NAMED_HIDDEN_CARD', {name, event});
    },
    stopDraggingItems({commit}) {
        commit('STOP_DRAGGING_ITEMS');
    },
    clearDraggedItems({commit}) {
        commit('CLEAR_DRAGGED_ITEMS');
    },
};

const getters = {
    event: (state) => state.event,
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
