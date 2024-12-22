<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';

var props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    default: 15,
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

var pageRange = ref(3);
var totalPages = computed(() => Math.ceil(props.totalItems / props.limit));
var pageNum = ref(
  Number.parseInt(route.query[props.pageArgument], 10) || 1
);

var pages = computed(() => {
  var items = [];

  if (totalPages.value <= pageRange.value) {

    items = Array.from({ length: totalPages.value },
      (_, i) => i + 1);

  } else {

    var min = 2;
    var max = totalPages.value - 1;

    var rangeHalf = Math.floor(pageRange.value / 2);

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

function calcPageRange() {
  // 640, 768, 1024, 1280, 1536

  if (window.innerWidth < 640) {
    pageRange.value = 3;
  }

  else if (window.innerWidth < 768) {
    pageRange.value = 5;
  }

  // else if (window.innerWidth < 1024) {
  //   pageRange.value = 7;
  // }

  else if (window.innerWidth < 1280) {
    pageRange.value = 7;
  }

  else {
    pageRange.value = 9;
  }
}

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

onMounted(() => {
  calcPageRange();
  window.addEventListener('resize', calcPageRange);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calcPageRange);
});
</script>

<template>
  <nav aria-label="Pagination">

    <template v-for="page in pages">
      <span v-if="page === -1" class="separator" 
        :class="{ on: showLeftSeparator }">{{ separatorText }}</span>

      <span v-else-if="page === -2" class="separator" 
        :class="{ on: showRightSeparator }">{{ separatorText }}</span>

      <span v-else-if="page === pageNum" class="active"
        :tabindex="page" :aria-current="page">{{ page }}</span>

      <RouterLink v-else :to="toPageNum(page)" class="link"
        :tabindex="page" :aria-current="page">{{ page }}</RouterLink>
    </template>

  </nav>
</template>
