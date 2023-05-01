<template>
  <DashboardContainer>
    <section class="pt-6 mb-6 flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span
          class="shadow inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-black dark:bg-slate-900/70 dark:text-white mr-3"
        >
          <BaseIcon :path="mdiHomeSwitch" />
        </span>
        <h1 class="text-2xl leading-tight">Transfer Assets</h1>
      </div>
    </section>
    <Alert type="warning" class="mb-2"
      >Please make sure to double-check all details before submitting as this action
      cannot be undone.</Alert
    >
    <div class="shadow rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex">
      <div class="flex-1 p-6">
        <div class="mb-6 last:mb-0">
          <label class="block font-bold mb-2">Land ID</label>
          <div class="">
            <div class="relative">
              <select
                v-model="data.land_id"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              >
                <option value="">-- Select Land --</option>
                <option
                  v-for="(asset, i) in allAssets"
                  :key="`${i}_asset`"
                  :value="asset.land_id"
                >
                  {{ asset.land_id }}
                </option>
              </select>
              <span class="text-xs text-red-600" v-if="error && error.land_id">{{
                error.land_id
              }}</span>
            </div>
          </div>
        </div>
        <div class="mb-6 last:mb-0">
          <label class="block font-bold mb-2">New Owner Address</label>
          <div class="">
            <div class="relative">
              <input
                placeholder="Addressof the new owner"
                type="text"
                v-model="data.new_owner"
                class="px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800"
              />
              <span class="text-xs text-red-600" v-if="error && error.new_owner">{{
                error.new_owner
              }}</span>
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Ensure the Address is correct public address of the person you want to
              transfer the land to.
            </div>
          </div>
        </div>
        <div class="mb-6 last:mb-0 flex justify-end">
          <BaseButton
            as="button"
            label="Submit For Approval"
            class="btn-primary"
            @click="initTransferRequest"
          />
        </div>

        <Modal :size="'sm'" v-if="isShowModal" @close="closeModal">
          <template #body>
            <div class="p-6 text-center">
              <svg
                aria-hidden="true"
                class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Do you confirm the transfer of this asset to
                <small class="font-bold">{{ newOwner?.fullname }}</small
                >?
              </h3>
              <button
                @click="submitTransferRequest"
                type="button"
                class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              >
                Yes, Transfer
              </button>
              <button
                @click="closeModal"
                type="button"
                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
            </div>
          </template>
          <template #footer> </template>
        </Modal>
      </div>
    </div>
  </DashboardContainer>
</template>

<script lang="ts">
import BaseIcon from "@/components/BaseIcon.vue";
import BaseButton from "@/components/BaseButton.vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { mdiHomeSwitch } from "@mdi/js";
import { defineComponent, ref, watchEffect } from "vue";
import { useWeb3Store } from "@/stores/web3";
import type { TransferData } from "@/stores/web3";
import { storeToRefs } from "pinia";
import { Alert } from "flowbite-vue";
import { useUserStore } from "@/stores/user";
import type { User, Land } from "@/stores/types";
import { Modal } from "flowbite-vue";

export default defineComponent({
  components: {
    DashboardContainer,
    BaseIcon,
    BaseButton,
    Alert,
    Modal,
  },

  setup() {
    const data = ref<TransferData>({ land_id: "", new_owner: "" });
    let newOwner = ref<null | User>(null);
    const isShowModal = ref(false);
    const { createTransferRequest } = useWeb3Store();
    const { assets, transferredLands } = storeToRefs(useWeb3Store());
    const error = ref<{ [index: string]: string }>({});
    const allAssets = ref<Land[]>([]);
    watchEffect(
      () => (allAssets.value = assets.value.filter((asset) => asset.is_govt_approved))
    );

    const initTransferRequest = async () => {
      try {
        if (await formIsValid()) {
          showModal();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const submitTransferRequest = async () => {
      try {
        closeModal();
        await createTransferRequest(data.value);
      } catch (error) {
        console.log(error);
      }
    };

    const formIsValid = async () => {
      error.value = {};
      if (data.value.land_id.length < 1) {
        error.value.land_id = "Invalid land ID";
      }
      if (data.value.new_owner.length < 1) {
        error.value.new_owner = "Invalid new owner address";
      }
      if (data.value.new_owner.length > 0) {
        if (data.value.new_owner == useUserStore().user.publicAddress) {
          error.value.new_owner = "You can not transfer asset to yourself";
        } else {
          try {
            newOwner.value = await useUserStore().getUserByAddress(data.value.new_owner);
            if (!newOwner.value) {
              throw "Invalid address";
            }
          } catch (e) {
            error.value.new_owner = "Invalid new owner address";
          }
        }
      }

      return Object.keys(error.value).length < 1;
    };

    function showModal() {
      isShowModal.value = true;
    }

    function closeModal() {
      isShowModal.value = false;
    }

    return {
      mdiHomeSwitch,
      allAssets,
      data,
      initTransferRequest,
      submitTransferRequest,
      transferredLands,
      error,
      newOwner,
      isShowModal,
      closeModal,
    };
  },
  async mounted() {
    await useWeb3Store().getOwnedLands();
    await useWeb3Store().getTransferredLands();
  },
});
</script>
