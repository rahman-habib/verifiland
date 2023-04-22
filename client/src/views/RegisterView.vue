<template>
  <AuthContainer>
    <div class="w-full bg-white lg:w-6/12 xl:w-5/12">
      <div
        class="flex flex-col items-start justify-start w-full h-full p-10 lg:p-16 xl:p-24"
      >
        <NotificationBar
          :color="Color.danger"
          :icon="mdiAlertCircle"
          v-if="error.message"
        >
          <template #right>
            <span> {{ error.message }}</span>
          </template>
        </NotificationBar>
        <h4 class="w-full text-3xl font-bold">Signup</h4>
        <p class="text-sm text-gray-500">
          or, if you have an account you can
          <router-link
            to="/signin"
            class="text-blue-600 underline"
            data-primary="blue-600"
            >sign in</router-link
          >
        </p>
        <div class="relative w-full mt-10 space-y-8">
          <div class="relative">
            <label class="font-medium text-gray-900">Full Name</label>
            <input
              type="text"
              class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
              data-primary="blue-600"
              data-rounded="rounded-lg"
              placeholder="Enter Your Full Name"
              v-model="fullname"
            />
            <span class="text-xs text-red-600" v-if="error && error.fullname">{{
              error.fullname
            }}</span>
          </div>
          <div class="relative">
            <label class="font-medium text-gray-900">Email</label>
            <input
              type="text"
              class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
              data-primary="blue-600"
              data-rounded="rounded-lg"
              placeholder="Enter Your Email Address"
              v-model="email"
            />
            <span class="text-xs text-red-600" v-if="error && error.email">{{
              error.email
            }}</span>
          </div>
          <div class="relative">
            <label class="font-medium text-gray-900"
              >National Identification Number</label
            >
            <input
              type="text"
              class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
              data-primary="blue-600"
              data-rounded="rounded-lg"
              placeholder="Enter NIN"
              v-model="nin"
              pattern="[0-9]{11}"
            />
            <span class="text-xs text-red-600" v-if="error && error.nin">{{
              error.nin
            }}</span>
          </div>
          <div class="relative grid grid-cols-2 gap-2">
            <div class="relative" v-if="!metaMaskLoginSupported">
              <label class="font-medium text-gray-900">Password</label>
              <input
                type="password"
                class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
                data-primary="blue-600"
                data-rounded="rounded-lg"
                placeholder="Password"
                v-model="password"
              />
              <span class="text-xs text-red-600" v-if="error && error.password">{{
                error.password
              }}</span>
            </div>
            <div class="relative" v-if="!metaMaskLoginSupported">
              <label class="font-medium text-gray-900">Confirm Password</label>
              <input
                type="password"
                class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
                data-primary="blue-600"
                data-rounded="rounded-lg"
                placeholder="Re-type Password"
                v-model="passwordConfirm"
              />
              <span class="text-xs text-red-600" v-if="error && error.passwordConfirm">{{
                error.passwordConfirm
              }}</span>
            </div>
          </div>
          <div class="relative">
            <button
              @click="registerUser"
              class="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-blue-700 ease"
              data-primary="blue-600"
              data-rounded="rounded-lg"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </AuthContainer>
</template>

<script lang="ts">
import { mdiAlertCircle } from "@mdi/js";
import NotificationBar from "@/components/NotificationBar.vue";
import AuthContainer from "@/components/AuthContainer.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { defineComponent, ref } from "vue";
import { Color } from "@/stores/types";
import { useWeb3Store } from "@/stores/web3";
import { useLoginWithMetaMask } from "@/composables/useLoginWithMetaMask";
export default defineComponent({
  components: {
    AuthContainer,
    NotificationBar,
  },

  setup() {
    const { register } = useUserStore();
    const error = ref<{ [index: string]: string }>({});
    const fullname = ref<string>("");
    const email = ref<string>("");
    const nin = ref<number>();
    const password = ref<string>("");
    const passwordConfirm = ref<string>("");
    const { metaMaskLoginSupported } = useLoginWithMetaMask();

    if (metaMaskLoginSupported) {
      // set default password
      password.value = passwordConfirm.value = "P@assw#12rd";
    }

    const registerUser = async () => {
      const account = await useWeb3Store().getWeb3();
      if (!account) {
        throw new Error("Metamask Account not connected");
      }
      register({
        publicAddress: account,
        fullname: fullname.value,
        email: email.value,
        nin: Number(nin.value),
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      })
        .then(() => {
          // show success alert
          router.push("/assets");
        })
        .catch((err) => {
          //show error alert
          error.value = err;
          console.log(err);
        });
    };

    return {
      nin,
      email,
      password,
      passwordConfirm,
      fullname,
      error,
      Color,
      registerUser,
      mdiAlertCircle,
      metaMaskLoginSupported,
    };
  },
});
</script>
