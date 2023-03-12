<template>
  <AuthContainer>
    <div class="w-full bg-white lg:w-6/12 xl:w-5/12">
      <div
        class="flex flex-col items-start justify-start w-full h-full p-10 lg:p-16 xl:p-24"
      >
        <h4 class="w-full text-3xl font-bold">Signin</h4>
        <p class="text-lg text-gray-500">
          or, if you don't have an account
          <router-link to="signup" class="text-blue-600 underline" data-primary="blue-600"
            >sign up</router-link
          >
        </p>
        <div class="relative w-full mt-10 space-y-8">
          <div class="relative">
            <label class="font-medium text-gray-900">Email</label>
            <input
              type="text"
              class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
              data-primary="blue-600"
              data-rounded="rounded-lg"
              placeholder="Enter Your Email Address"
            />
          </div>
          <div class="relative">
            <label class="font-medium text-gray-900">Password</label>
            <input
              type="password"
              class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
              data-primary="blue-600"
              data-rounded="rounded-lg"
              placeholder="Password"
            />
          </div>
          <div class="relative">
            <a
              href="#_"
              class="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-blue-700 ease"
              data-primary="blue-600"
              data-rounded="rounded-lg"
              >Sign in</a
            >
          </div>
        </div>
      </div>
    </div>
  </AuthContainer>
</template>

<script lang="ts">
import AuthContainer from "@/components/AuthContainer.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    AuthContainer,
  },
});
</script>
