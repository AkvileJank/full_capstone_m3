<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FwbButton, FwbHeading, FwbInput, FwbRange, FwbTextarea } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import AlertError from '@/components/AlertError.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import calendarFormatter from '@/utils/calendarFormatter'

const router = useRouter()

const lessonForm = ref({
  title: '',
  dateTime: new Date(),
  duration: 0,
  location: '',
  capacity: 0,
  description: '',
})

const [createLesson, errorMessage] = useErrorMessage(async () => {
  await trpc.lesson.create.mutate(lessonForm.value)

  router.push({ name: 'Dashboard' })
})
</script>

<template>
  <div class="container mx-auto px-6 py-8">
    <form aria-label="Lesson" @submit.prevent="createLesson" name="Lesson">
      <div class="space-y-6">
        <FwbHeading tag="h4">Create a new lesson</FwbHeading>

        <div class="mt-6">
          <FwbInput
            aria-label="Lesson title"
            v-model="lessonForm.title"
            :minlength="2"
            label="Title"
            placeholder="My lesson"
            name="Title"
          />
        </div>

        <div class="mt-6">
          <label
            for="number-input"
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Date and time:</label
          >
          <VueDatePicker
            data-testid="datepicker"
            v-model="lessonForm.dateTime"
            :format="calendarFormatter"
            placeholder="Select date and time"
          />
        </div>

        <div class="mt-6">
          <label
            for="number-input"
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Duration: (min)</label
          >
          <input
            data-testid="duration"
            v-model="lessonForm.duration"
            id="number-input"
            type="number"
            aria-label="Lesson duration"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
        </div>

        <div class="mt-6">
          <FwbInput
            name="Location"
            aria-label="Lesson location"
            v-model="lessonForm.location"
            :minlength="2"
            label="Location:"
            placeholder="Enter location"
          />
        </div>
        <div class="mt-6">
          <label
            for="number-input"
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Capacity:</label
          >
          <input
            data-testid="capacity"
            v-model="lessonForm.capacity"
            id="number-input"
            type="number"
            aria-label="Lesson capacity"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Enter a number"
            required
          />
        </div>

        <div class="mt-6">
          <FwbTextarea
            data-testid="description"
            aria-label="Lesson description"
            v-model="lessonForm.description"
            :minlength="2"
            label="Description"
            placeholder="Enter description"
          />
        </div>
      </div>

      <AlertError :message="errorMessage" />

      <div class="flex justify-center gap-6">
        <div class="mt-6 grid grid-cols-2 items-center gap-3">
          <FwbButton type="submit" size="lg">Save</FwbButton>
          <RouterLink
            class="text-center text-lg font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            component="RouterLink"
            :to="{ name: 'Dashboard' }"
            >Cancel</RouterLink
          >
        </div>
      </div>
    </form>
  </div>
</template>
