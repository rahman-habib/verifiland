<template>
  <div>
    <ol class="relative border-l border-gray-200 dark:border-gray-700" v-if="asset">
      <li class="ml-6">
        <span
          class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"
        >
          <svg
            aria-hidden="true"
            class="w-3 h-3 text-blue-800 dark:text-blue-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
        <h3
          class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white"
        >
          {{ asset.fullname }}
          <span
            class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3"
            >Current Owner</span
          >
        </h3>
        <span class="text-sm font-normal leading-none"
          >Initial registration date of asset
        </span>
        <time
          class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
          >{{ new Date(asset.created_at).toDateString() }}</time
        >
        <span class="text-sm font-normal leading-none"
          >Date Approved by land registry</span
        >
        <time
          class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
          >{{ new Date(asset.approved_at).toDateString() }}</time
        >
        <span class="text-sm font-normal leading-none"> Lat Long </span>
        <span
          class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
        >
          ({{ asset.lat }}, {{ asset.long }})
        </span>
        <span class="text-sm font-normal leading-none"> City, LGA </span>
        <span
          class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
        >
          {{ asset.city }}, {{ asset.lga }}
        </span>
      </li>
    </ol>
  </div>
</template>
<script lang="ts" setup>
import type { Land } from "@/stores/types";

defineProps<{
  asset?: Land;
}>();
</script>
