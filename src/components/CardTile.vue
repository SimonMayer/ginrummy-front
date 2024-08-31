<template>
  <div>
    <div class="suit">{{ suitEmoji }}</div>
    <div class="rank">{{ rank }}</div>
  </div>
</template>

<script>
export default {
  name: 'CardTile',
  props: {
    rank: {
      type: String,
      required: true,
    },
    suitEmoji: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/cards/variables' as card;

.rank,
.suit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.rank {
  color: card.$backgroundColor;
  font-size: var(--card-tile-rank-font-size);
}

.suit {
  font-size: var(--card-tile-suit-font-size);
}
</style>
