<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import { FwbButton, FwbHeading, FwbInput, FwbTextarea } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'

const router = useRouter()
const route = useRoute()

const lesson = ref()
const lessonId = Number(route.params.id)

onBeforeMount(async () => {
  const [lessonFound] = await Promise.all([trpc.lesson.findById.query({ id: lessonId })])
  lesson.value = lessonFound
})

const [updateLesson, errorMessage] = useErrorMessage(async () => {
  await trpc.lesson.update.mutate(lesson.value)
  router.push({name: 'Dashboard'})
})
</script>

<template>
  <div v-if="lesson">
    <div class="mb-4 flex flex-row">
      <FwbHeading tag="h1" class="mb-0 !text-xl"> Enter the changes: </FwbHeading>
    </div>

    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
      <form aria-label="Lesson" @submit.prevent="updateLesson">
        <Card>
          <div class="mb-3">
            <FwbInput
              aria-label="Lesson title"
              v-model="lesson.title"
              :minlength="2"
              label="Title:"
            ></FwbInput>
          </div>

          <div class="mb-3">
            <FwbInput
              aria-label="Lesson title"
              v-model="lesson.dateTime"
              :minlength="2"
              label="Date:"
            ></FwbInput>
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
            <label
              for="number-input"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >Capacity:</label
            >
            <input
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
              aria-label="Lesson description"
              v-model="lesson.description"
              :minlength="2"
              label="Description:"
            ></FwbTextarea>
          </div>

          <AlertError :message="errorMessage" />
          <!-- prettier-ignore -->
          <FwbButton
            type="submit"
            component="RouterLink"
            tag="router-link"
            :to="{ name: 'Dashboard' }"
            data-testid="updateLesson"
            size="xl"
            >Save changes</FwbButton>
        </Card>
      </form>
    </Transition>
  </div>
</template>
