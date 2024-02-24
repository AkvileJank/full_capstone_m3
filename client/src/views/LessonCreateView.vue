<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import AlertError from '@/components/AlertError.vue'
import LessonInput from '@/components/LessonInput.vue'

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
        <LessonInput :lesson="lessonForm"></LessonInput>
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
