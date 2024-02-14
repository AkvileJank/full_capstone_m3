<script lang="ts" setup>
import calendarFormatter from '@/utils/calendarFormatter'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { FwbInput, FwbTextarea } from 'flowbite-vue'

defineProps<{
  lesson: any
}>()
</script>

<template>
  <div class="mb-3">
    <FwbInput
      name="title"
      aria-label="Lesson title"
      v-model="lesson.title"
      :minlength="2"
      label="Title:"
    ></FwbInput>
  </div>
  <label
    for="datepicker"
    class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
    aria-label="Lesson date and time"
    >Date and time:</label
  >
  <div class="mb-3">
    <VueDatePicker v-model="lesson.dateTime" :format="calendarFormatter" data-testid="datepicker" />
  </div>

  <div class="mb-3">
    <label for="number-input" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >Duration: (min)</label
    >
    <input
      data-testid="duration"
      v-model="lesson.duration"
      type="number"
      id="number-input"
      aria-label="Lesson duration"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      required
    />
  </div>

  <div class="mb-3">
    <FwbInput
      aria-label="Lesson location"
      v-model="lesson.location"
      :minlength="2"
      label="Location:"
    ></FwbInput>
  </div>

  <div class="mb-3">
    <label for="number-input" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >Capacity:</label
    >
    <input
      data-testid="capacity"
      v-model="lesson.capacity"
      type="number"
      id="number-input"
      aria-label="Lesson capacity"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      required
    />
  </div>

  <div class="mb-3">
    <FwbTextarea
      data-testid="description"
      aria-label="Lesson description"
      v-model="lesson.description"
      :minlength="2"
      label="Description:"
    ></FwbTextarea>
  </div>
</template>
