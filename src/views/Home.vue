<script setup>
import { ref, computed, onMounted } from 'vue';

import PaginatorControls from '@/components/PaginatorControls.vue';
import PaginatorResponsive from '@/components/PaginatorResponsive.vue';
import Paginator from '@/components/Paginator.vue';

var pagination = ref({
  offset: 0,
  limit: 15,
});

var items = ref(Array.from({ length: 300 }, (_, i) => i + 1));

var paginationItems = computed(() => {
  return items.value.slice(
    pagination.value.offset,
    pagination.value.offset + pagination.value.limit);
});

function selectPage({ pageNum, limit, offset }) {
  pagination.value.offset = offset;
}

function deleteItem(n) {
  // Remove 1 element at index N
  items.value.splice(n + pagination.value.offset, 1);
}

onMounted(async () => {
  console.log('onMounted');
});
</script>

<template>
  <div class="container mx-auto p-5">

    <table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th class="text-start">Name</th>
          <th class="text-start">Age</th>
          <th class="text-start">Address</th>
          <th class="text-end">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, n) of paginationItems" :key="item" class="odd:bg-white even:bg-gray-100">
          <td class="text-start">Name {{ item }}</td>
          <td class="text-start">Age {{ item }}</td>
          <td class="text-start">Address {{ item }}</td>
          <td class="text-end">
            <button type="button"
              @click="deleteItem(n)"
              class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Without Controls -->
    <Paginator @select="selectPage" class="paginator pgs-1"
      :page-range="5"
      :limit="pagination.limit"
      :total-items="items.length" />

    <!-- With Controls -->
    <PaginatorControls @select="selectPage" class="paginator pgs-2"
      :limit="pagination.limit"
      :total-items="items.length" />

    <PaginatorControls @select="selectPage" class="paginator-4 pgs-4"
      :limit="pagination.limit"
      :total-items="items.length" />

    <!-- Responsive Paginator -->
    <PaginatorResponsive @select="selectPage" class="paginator pgs-3"
      :limit="pagination.limit"
      :total-items="items.length" />

  </div>
</template>

<style>
th {
  @apply uppercase text-gray-500
}

td {
  @apply text-gray-800
}

th, td {
  @apply px-6 py-2 text-sm whitespace-nowrap font-medium
}
</style>
