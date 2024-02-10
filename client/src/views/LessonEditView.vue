<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import { FwbButton, FwbHeading, FwbInput, FwbTextarea, FwbModal } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import calendarFormatter from '@/utils/calendarFormatter'

const router = useRouter()
const route = useRoute()

const lesson = ref()
const lessonId = Number(route.params.id)

const isShowModal = ref(false)

function closeModal() {
  isShowModal.value = false
}

function removeAndClose() {
  isShowModal.value = false
  removeLesson()
}

function showModal() {
  isShowModal.value = true
}

onBeforeMount(async () => {
  const [lessonFound] = await Promise.all([trpc.lesson.findById.query({ id: lessonId })])
  lesson.value = lessonFound
  lesson.value.dateTime = new Date(lesson.value.dateTime)
})

const [updateLesson, errorMessage] = useErrorMessage(async () => {
  await trpc.lesson.update.mutate(lesson.value)
  router.push({ name: 'Dashboard' })
})

const [removeLesson] = useErrorMessage(async () => {
  await trpc.lesson.remove.mutate({ id: lessonId })
})


</script>

<template>
  <div class="container mx-auto px-6 py-8">
    <div v-if="!lesson">This lesson does not exist</div>
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
            <label
              for="datepicker"
              class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
              aria-label="Lesson date and time"
              >Date and time:</label
            >
            <div class="mb-3">
              <VueDatePicker v-model="lesson.dateTime" :format="calendarFormatter" id="datepicker" />
            </div>

            <div class="mb-3">
              <label
                for="number-input"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Duration: (min)</label
              >
              <input
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

            <div class="flex justify-center gap-6">
              <!-- prettier-ignore -->
              <FwbButton
            type="submit"
            component="RouterLink"
            tag="router-link"
            :to="{ name: 'Dashboard' }"
            data-testid="updateLesson"
            size="xl"
            >Save changes</FwbButton>

              <FwbButton @click="showModal()" data-testid="updateLesson" size="xl" color="red"
                >Remove lesson</FwbButton
              >
            </div>
          </Card>
        </form>
      </Transition>
    </div>
  </div>

  <fwb-modal v-if="isShowModal" @close="closeModal">
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
        <fwb-button @click="closeModal" color="alternative"> Cancel </fwb-button>
        <fwb-button @click="removeAndClose()" color="red"> Remove </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
