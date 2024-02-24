<script setup lang="ts">
import { trpc } from '@/trpc'
import { FwbButton } from 'flowbite-vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AlertError from '@/components/AlertError.vue'
import Card from '@/components/Card.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import LessonDetails from '@/components/LessonDetails.vue'

const route = useRoute()
const router = useRouter()

const lesson = ref()

const lessonId = Number(route.params.id)

onBeforeMount(async () => {
  const [lessonFound] = await Promise.all([trpc.lesson.findById.query({ id: lessonId })])
  lesson.value = lessonFound
})

const [joinLesson, errorMessage] = useErrorMessage(async () => {
  await trpc.lesson.join.mutate({ id: lessonId })
  router.push({ name: 'JoinConfirmation' })
})

const [removeFromLesson] = useErrorMessage(async () => {
  await trpc.lesson.removeFromLesson.mutate({ id: lessonId })
})
</script>

<template>
  <div class="h-screen bg-[url('../assets/dotsDash.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
    <div class="container mx-auto px-6 py-8">
      <div v-if="lesson">
        <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
          <Card data-testid="lessonDetails">
            <LessonDetails :lesson="lesson" :is-lesson-owned="lesson.isOwned"></LessonDetails>

            <AlertError :message="errorMessage" />

            <!-- prettier-ignore -->
            <div class="mt-8">
        <FwbButton
          v-if="lesson.isOwned"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'LessonUpdate' } as any)"
          data-testid="updateLesson"
          size="xl"
          >Edit lesson</FwbButton>

           <FwbButton
           @click="removeFromLesson"
          v-else-if="lesson.isJoined"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'Dashboard' } as any)"
          data-testid="removeFromLesson"
          size="xl"
          color="red"
          >Withdraw from lesson</FwbButton>

        <FwbButton
          v-else
          @click="joinLesson"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'JoinConfirmation' } as any)"
          data-testid="joinLesson"
          size="xl"
          >Join lesson</FwbButton
        >
      </div>
          </Card>
        </Transition>
      </div>
    </div>
  </div>
</template>
