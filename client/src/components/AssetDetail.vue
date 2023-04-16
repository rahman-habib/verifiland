<template>
  <div>
    <ol class="relative border-l border-gray-200 dark:border-gray-700" v-if="asset">
      <li class="ml-6">
        <span
          class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white"
        >
          <BaseIcon :path="mdiCalendarText" />
        </span>
        <h3
          class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white"
        >
          {{ asset.users?.get(asset.current_owner)?.fullname }}
          <span
            class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3"
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
      <li class="ml-6" v-for="(owner, i) in asset.previous_owners" :key="`${i}_p_o`">
        <span
          class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white"
        >
          <BaseIcon :path="mdiCalendarText" />
        </span>
        <h3
          class="flex items-center mb-1 text-lg font-semibold text-gray-500 dark:text-white"
        >
          {{ asset.users?.get(owner)?.fullname }}
          <span
            class="bg-gray-100 text-gray-500 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3"
            >Previous Owner</span
          >
        </h3>
      </li>
    </ol>
  </div>
</template>
<script lang="ts" setup>
import type { Land } from "@/stores/types";
import BaseIcon from "./BaseIcon.vue";
import { mdiCalendarText } from "@mdi/js";

defineProps<{
  asset?: Land;
}>();
</script>
