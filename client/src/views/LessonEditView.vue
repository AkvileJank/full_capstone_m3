<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import AlertError from '@/components/AlertError.vue'
import LessonInput from '../components/LessonInput.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const route = useRoute()

const lesson = ref()
const lessonId = Number(route.params.id)

const isShowModal = ref(false)

function closeModal() {
  isShowModal.value = false
}

function removeAndClose() {
  removeLesson()
  isShowModal.value = false
  router.push({ name: 'Dashboard' })
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
      <!-- eslint-disable vue/require-toggle-inside-transition  -->
      <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
        <form aria-label="Lesson" @submit.prevent="updateLesson">
          <Card>
            <LessonInput :lesson="lesson"></LessonInput>
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

              <FwbButton
                @click.prevent="isShowModal = true"
                data-testid="deleteLesson"
                size="xl"
                color="red"
                >Remove lesson</FwbButton
              >
            </div>
          </Card>
        </form>
      </Transition>
    </div>
  </div>
  <Modal
    :is-show-modal="isShowModal"
    @close-modal="closeModal"
    @remove-and-close="removeAndClose"
  ></Modal>
</template>
