<script lang="ts" setup>
import { FwbButton } from 'flowbite-vue'
</script>

<template>
  <!-- landing page with Tailwind -->
  <div class="background-container h-max">
    <div class="container mx-auto flex h-screen items-center justify-center px-6 py-8">
      <div class="text-center">
        <div class="">
          <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Start learning new skills today!
          </h2>
          <p class="mx-auto mt-4 text-xl text-gray-900 dark:text-gray-400 lg:max-w-md">
            Explore various live classes led by our community members or lead a class yourself to
            share your unique talents.
          </p>
        </div>
        <div class="mt-6">
          <!-- prettier-ignore -->
          <FwbButton
            component="RouterLink"
            tag="router-link"
            :href="({ name: 'Signup' } as any)"
            size="xl"
            class="btn"
          >
            Get Started
          </FwbButton>

          <!-- prettier-ignore -->
          <FwbButton
            component="RouterLink"
            tag="router-link"
            color="alternative"
            :href="({ name: 'Login' } as any)"
            class="ml-2"
            size="xl"
          >
            Log in
          </FwbButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background-container {
  background-image: url('@/assets/dots.jpg');
  background-size: cover;
}
.btn {
  background-color: #d5573b;
}
</style>
