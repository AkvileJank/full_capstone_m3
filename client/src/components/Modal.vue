<script lang="ts" setup>
import { FwbButton, FwbModal } from 'flowbite-vue'

defineProps<{
  isShowModal: boolean
}>()

const emit = defineEmits(['closeModal', 'removeAndClose'])

function close() {
  emit('closeModal')
}

function remove() {
  emit('removeAndClose')
}
</script>

<template>
  <fwb-modal v-show="isShowModal" @close="close" data-testid="deleteModal">
    <template #header>
      <div class="flex items-center text-lg">Confirm delete</div>
    </template>
    <template #body>
      <p class="text-center text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Are you sure you want to remove this lesson?
      </p>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <fwb-button @click="close" color="alternative"> Cancel </fwb-button>
        <fwb-button @click="remove" color="red" data-testid="remove"> Remove </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
