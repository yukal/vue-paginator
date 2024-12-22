<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';

var props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    default: 15,
  },
  pageRange: {
    type: Number,
    default: 3
  },
  pageArgument: {
    type: String,
    default: 'pg',
  },
  separatorText: {
    type: String,
    default: '…',
  },
});

var emit = defineEmits(['select']);
var route = useRoute();

var showLeftSeparator = ref(false);
var showRightSeparator = ref(false);

var totalPages = computed(() => Math.ceil(props.totalItems / props.limit));
var pageNum = ref(
  Number.parseInt(route.query[props.pageArgument], 10) || 1
);

var pages = computed(() => {
  var items = [];

  if (totalPages.value <= props.pageRange) {

    items = Array.from({ length: totalPages.value },
      (_, i) => i + 1);

  } else {

    var min = 2;
    var max = totalPages.value - 1;

    var rangeHalf = Math.floor(props.pageRange / 2);

    var rangeStart = pageNum.value - rangeHalf >= min
      ? pageNum.value - rangeHalf
      : min;

    var rangeEnd = rangeStart + rangeHalf * 2;

    if (rangeEnd >= totalPages.value) {
      rangeEnd = max;

      rangeStart = max - rangeHalf * 2 >= min
        ? rangeEnd - rangeHalf * 2
        : min;
    }

    var range = Array.from({ length: rangeEnd - rangeStart + 1 },
      (_, i) => i + rangeStart);

    items = [1, -1, ...range, -2, totalPages.value];

    showLeftSeparator.value = rangeStart > min;
    showRightSeparator.value = rangeEnd < max;
  }

  return items;
});

function toPageNum(n) {
  return n <= 1
    ? route.path
    : { query: { ...route.query, [props.pageArgument]: n } };
}

watch(() => route.query[props.pageArgument], (newPageNum) => {
  newPageNum = Number.parseInt(newPageNum, 10) || 1;

  if (pageNum.value === newPageNum) {
    return;
  }

  pageNum.value = newPageNum;

  emit('select', {
    pageNum: pageNum.value,
    limit: props.limit,
    offset: (pageNum.value - 1) * props.limit,
  });

});
</script>

<template>
  <nav v-if="pages.length > 0" aria-label="Pagination">

    <template v-for="page in pages">
      <span v-if="page === -1" class="separator" 
        :class="{ on: showLeftSeparator }">{{ separatorText }}</span>

      <span v-else-if="page === -2" class="separator" 
        :class="{ on: showRightSeparator }">{{ separatorText }}</span>

      <span v-else-if="page === pageNum" class="active"
        :tabindex="page" :aria-current="page">{{ page }}</span>

      <RouterLink v-else :to="toPageNum(page)"
        class="link"
        :tabindex="page" :aria-current="page">{{ page }}</RouterLink>
    </template>

  </nav>
</template>
