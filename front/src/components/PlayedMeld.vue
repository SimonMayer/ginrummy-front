<template>
  <div :class="['meld', type]">
    <VisibleCard
        v-for="card in cards"
        :key="card.card_id"
        :cardProp="card"
        :selectable="false"
        class="card"
    />
  </div>
</template>

<script>
import VisibleCard from '@/components/VisibleCard.vue';

export default {
  name: 'PlayedMeld',
  components: {
    VisibleCard
  },
  props: {
    cards: {
      type: Array,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.meld {
  display: flex;
}

.card {
  &:not(:first-child) {
    margin-left: calc(var(--card-width) * -0.85);
  }
}
</style>
