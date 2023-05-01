<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span
          class="shadow inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-black dark:bg-slate-900/70 dark:text-white mr-3"
        >
          <BaseIcon :path="mdiAccountGroup" />
        </span>
        <h1 class="text-2xl leading-tight">Accounts</h1>
      </div>
    </section>
    <div class="shadow rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex p-4">
      <div class="flex items-center justify-between pb-4">
        <div class="pb-4 bg-white dark:bg-gray-900">
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <BaseIcon :path="mdiMagnify" />
            </div>
            <input
              @input="($event) => searchAccounts($event)"
              type="text"
              id="table-search"
              class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name or address or email"
            />
          </div>
        </div>
      </div>
      <div class="flex-1">
        <table v-if="allAccounts.length > 0" class="table">
          <thead>
            <tr class="text-xs">
              <th />
              <th>Full Name</th>
              <th>Email Address</th>
              <th>NIN</th>
              <th>Public Ethereum address</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(account, i) in allAccounts" :key="`${i}_account`">
              <td class="border-b-0 lg:w-6 before:hidden"></td>
              <td data-label="fullname">{{ account.fullname }}</td>
              <td data-label="land_id">{{ account.email }}</td>
              <td data-label="area">{{ account.nin }}</td>
              <td data-label="City">{{ account.publicAddress }}</td>

              <td class="before:hidden lg:w-1 whitespace-nowrap"></td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="flex flex-col justify-center items-center h-screen">
            <BaseIcon :path="mdiAccountGroup" class="text-gray-300" />
            <h2 class="mt-2 mb-4 text-lg font-medium text-gray-900">
              No registered accounts
            </h2>
            <p class="text-sm text-gray-500 mb-6">
              <span v-if="registry">There are currently no registered accountss.</span>
            </p>
            <BaseButton
              v-if="!registry"
              as="router-link"
              label="Register Asset"
              class="btn-primary"
              :to="'/add-assets'"
            />
          </div>
        </div>
      </div>
    </div>
  </DashboardContainer>
</template>

<script lang="ts">
import BaseIcon from "@/components/BaseIcon.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import {
  mdiHomeSilo,
  mdiDotsVertical,
  mdiDownload,
  mdiMagnify,
  mdiAccountGroup,
} from "@mdi/js";
import { defineComponent, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import BaseButton from "@/components/BaseButton.vue";
import { useUserStore } from "@/stores/user";
import type { User } from "@/stores/types";
export default defineComponent({
  components: {
    DashboardContainer,
    BaseIcon,
    BaseButton,
  },

  setup() {
    const { accounts } = storeToRefs(useUserStore());
    const isShowModal = ref(false);
    const registry = ref(false);
    const { isAdmin } = useUserStore();
    registry.value = isAdmin();
    const filter = ref({ search: "", status: "" });
    const allAccounts = ref<User[]>([]);
    watchEffect(() => (allAccounts.value = accounts?.value ?? []));

    function searchAccounts($event: Event) {
      const value = ($event.target as HTMLInputElement).value;
      filter.value.search = value;

      applyFilter();
    }

    function filterAssetByStatus($event: Event) {
      const value = ($event.target as HTMLInputElement).value;
      filter.value.status = value;

      applyFilter();
    }

    function applyFilter() {
      allAccounts.value = accounts.value;

      if (filter.value.search.length > 0) {
        allAccounts.value = accounts.value.filter((account) => {
          return (
            account.fullname.includes(filter.value.search) ||
            account.email.includes(filter.value.search) ||
            account.publicAddress?.includes(filter.value.search)
          );
        });
      }
    }

    return {
      mdiAccountGroup,
      mdiHomeSilo,
      mdiMagnify,
      allAccounts,
      mdiDotsVertical,
      isShowModal,
      mdiDownload,
      registry,
      searchAccounts,
      filterAssetByStatus,
    };
  },
  async mounted() {
    const getAccounts = async () => {
      if (useUserStore().isAdmin()) {
        return await useUserStore().getAllUsers();
      }
    };

    getAccounts();
  },
});
</script>
