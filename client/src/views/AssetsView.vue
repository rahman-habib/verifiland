<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span
          class="shadow inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-black dark:bg-slate-900/70 dark:text-white mr-3"
        >
          <BaseIcon :path="mdiHomeSilo" />
        </span>
        <h1 class="text-2xl leading-tight">Assets</h1>
      </div>
    </section>
    <div class="shadow rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex p-4">
      <div class="flex items-center justify-between pb-4">
        <select
          @change="($event) => filterAssetByStatus($event)"
          id="countries"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700"
        >
          <option value="" selected>All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
        <div class="pb-4 bg-white dark:bg-gray-900">
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <BaseIcon :path="mdiMagnify" />
            </div>
            <input
              @input="($event) => searchAssetByLandID($event)"
              type="text"
              id="table-search"
              class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for asset by Land ID or Owner Name"
            />
          </div>
        </div>
      </div>
      <div class="flex-1">
        <table v-if="allAssets.length > 0" class="table">
          <thead>
            <tr class="text-xs">
              <th />
              <th v-if="registry">Current Owner</th>
              <th>Land ID</th>
              <th>Plot coordinate</th>
              <th>State</th>
              <th>City</th>
              <th>Created</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(asset, i) in allAssets" :key="`${i}_asset`">
              <td class="border-b-0 lg:w-6 before:hidden"></td>
              <td data-label="fullname" v-if="registry">{{ asset.fullname }}</td>
              <td data-label="land_id">{{ asset.land_id }}</td>
              <td data-label="area">{{ asset.lat }} {{ asset.long }}</td>
              <td data-label="City">{{ asset.city }}</td>
              <td data-label="lga">{{ asset.lga }}</td>
              <td data-label="Created" class="lg:w-1 whitespace-nowrap">
                <small class="text-gray-500 dark:text-slate-400">{{
                  new Date(asset.created_at).toDateString()
                }}</small>
              </td>
              <td>
                <span v-text="asset.is_govt_approved ? 'Approved' : 'Pending'"></span>
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <a href="#" @click.prevent="showModal(i)"
                  ><BaseIcon :path="mdiDotsVertical"
                /></a>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="flex flex-col justify-center items-center h-screen">
            <BaseIcon :path="mdiHomeSilo" class="text-gray-300" />
            <h2 class="mt-2 mb-4 text-lg font-medium text-gray-900">No assets</h2>
            <p class="text-sm text-gray-500 mb-6">
              <span v-if="registry">There are currently no registered assets.</span>
              <span v-else>You currently do not have any registered assets.</span>
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

    <Modal :size="'3xl'" v-if="isShowModal" @close="closeModal">
      <template #header> </template>
      <template #body>
        <table>
          <tr v-if="registry">
            <th>Owner Email</th>
            <td class="text-right">{{ modalAsset.email }}</td>
          </tr>
          <tr v-if="registry">
            <th>Owner Address</th>
            <td class="text-right">{{ modalAsset.current_owner }}</td>
          </tr>
          <tr v-if="modalAsset.files.deeds">
            <th>Supporting Document (Deeds)</th>
            <td class="text-right">
              <a href="#" @click.prevent="openFile(modalAsset.files.deeds)"
                >Click to Open <BaseIcon :path="mdiDownload" />
              </a>
            </td>
          </tr>
          <tr>
            <th>Length</th>
            <td class="text-right">
              {{ modalAsset.lth }}
            </td>
          </tr>
          <tr>
            <th>Breadth</th>
            <td class="text-right">
              {{ modalAsset.breadth }}
            </td>
          </tr>
          <tr>
            <th>Surveyor No.</th>
            <td class="text-right">
              {{ modalAsset.surveyor_no }}
            </td>
          </tr>
          <tr>
            <th>Land Registry Approval Status</th>
            <td class="text-right">
              <span
                :class="[
                  'p-2 rounded text-xs text-white',
                  !modalAsset.is_govt_approved ? 'bg-yellow-300' : 'bg-green-600',
                ]"
                v-text="modalAsset.is_govt_approved ? 'Approved' : 'Pending Approval'"
              ></span>
            </td>
          </tr>
        </table>
      </template>
      <template #footer>
        <div class="flex" :class="canApprove() ? 'justify-between' : 'justify-end'">
          <button
            @click="closeModal"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Close
          </button>
          <button
            v-if="canApprove()"
            @click="approve"
            type="button"
            class="mr-2 text-indigo-600 border-2 hover:border-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Approve
          </button>
        </div>
      </template>
    </Modal>
  </DashboardContainer>
</template>

<script lang="ts">
import BaseIcon from "@/components/BaseIcon.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { mdiHomeSilo, mdiDotsVertical, mdiDownload, mdiMagnify } from "@mdi/js";
import { defineComponent, ref, watchEffect } from "vue";
import { useWeb3Store } from "@/stores/web3";
import { storeToRefs } from "pinia";
import BaseButton from "@/components/BaseButton.vue";
import { Modal } from "flowbite-vue";
import { useUserStore } from "@/stores/user";
import type { Land } from "@/stores/types";
export default defineComponent({
  components: {
    DashboardContainer,
    BaseIcon,
    BaseButton,
    Modal,
  },

  setup() {
    const { assets } = storeToRefs(useWeb3Store());
    const modalAsset = ref<{ [index: string]: any }>({});
    const isShowModal = ref(false);
    const registry = ref(false);
    const { isAdmin } = useUserStore();
    const { approveLand, getAllLands } = useWeb3Store();
    registry.value = isAdmin();
    const filter = ref({ search: "", status: "" });
    const allAssets = ref<Land[]>([]);
    watchEffect(() => (allAssets.value = assets.value));

    function closeModal() {
      isShowModal.value = false;
    }
    function showModal(index: number) {
      //@ts-ignore
      modalAsset.value = assets.value[index];
      isShowModal.value = true;
    }

    async function openFile(file: any) {
      let pdfWindow = window.open("");
      pdfWindow?.document.write(
        `<html<head><title>${modalAsset.value.land_id} - Asset Proof</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>`
      );
      pdfWindow?.document.write(
        "<body><embed width='100%' height='100%' src='" +
          encodeURI(`${file.data}`) +
          "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>"
      );
      // window.open(`data:application/pdf;${file.data}`);
    }

    function canApprove(): boolean {
      return isAdmin() && !modalAsset.value.is_govt_approved;
    }

    function searchAssetByLandID($event: Event) {
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
      allAssets.value = assets.value;

      if (filter.value.search.length > 0) {
        allAssets.value = assets.value.filter((asset) => {
          return (
            asset.land_id.includes(filter.value.search) ||
            asset.fullname.includes(filter.value.search)
          );
        });
      }

      if (filter.value.status.length > 0) {
        const statuses = { pending: false, approved: true };
        allAssets.value = assets.value.filter((asset) => {
          return (
            asset.is_govt_approved ==
            statuses[filter.value.status as keyof typeof statuses]
          );
        });
      }
    }

    async function approve() {
      await approveLand(modalAsset.value.land_id);
      await getAllLands();
      closeModal();
    }

    return {
      mdiHomeSilo,
      mdiMagnify,
      allAssets,
      mdiDotsVertical,
      isShowModal,
      closeModal,
      showModal,
      modalAsset,
      mdiDownload,
      openFile,
      registry,
      approve,
      canApprove,
      searchAssetByLandID,
      filterAssetByStatus,
    };
  },
  async mounted() {
    const getLands = async () => {
      if (useUserStore().isAdmin()) {
        return await useWeb3Store().getAllLands();
      }
      await useWeb3Store().getOwnedLands();
    };

    getLands();
  },
});
</script>
