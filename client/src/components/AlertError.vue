<script lang="ts" setup>
import { FwbAlert } from 'flowbite-vue'
import { computed } from 'vue'

const props = defineProps<{
  message: string
}>()

const errors = computed(() => {
  return props.message.replace('Validation error: ', '').split(';')
})
</script>

<template>
  <ul v-if="message" data-testid="errorMessage">
    <li v-for="error in errors" :key="error">
      <FwbAlert type="danger" class="mb-1">{{ error }}</FwbAlert>
    </li>
  </ul>
</template>
