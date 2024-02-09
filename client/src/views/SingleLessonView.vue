<script setup lang="ts">
import { trpc } from '@/trpc'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { UserBare } from '@server/entities/user'
import Card from '@/components/Card.vue'
import useErrorMessage from '@/composables/useErrorMessage'

type Student = Pick<UserBare, 'firstName' | 'lastName'> // this should be in User entity types

const route = useRoute()
const router = useRouter()

const lesson = ref()
const students = ref<Student[]>()

const lessonId = Number(route.params.id)

const isOwned = ref<boolean>()
const isJoined = ref<boolean>()

const lessonDate = ref<string>('')
const hours = ref<number>(0)
const minutes = ref<number>(0)



onBeforeMount(async () => {
  const [lessonFound] = await Promise.all([trpc.lesson.findById.query({ id: lessonId })])
  lesson.value = lessonFound
  lessonDate.value = new Date(lessonFound.dateTime).toISOString().split('T')[0]
  hours.value = new Date(lessonFound.dateTime).getHours()
  minutes.value = new Date(lessonFound.dateTime).getMinutes()

  isOwned.value = await trpc.lesson.isOwned.query({ id: lessonId })
  isJoined.value = await trpc.lesson.isJoined.query({ id: lessonId })

  students.value = await trpc.lesson.findAttendingUsers.query({ id: lessonId })

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
  <div v-if="lesson">
    <div class="mb-4 flex flex-row">
      <FwbHeading tag="h1" class="mb-0 !text-xl">
        {{ lesson.title }}
      </FwbHeading>
    </div>

    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
      <Card>
        <div class="mb-3">
          <h3 class="font-bold">Date:</h3>
          <p>{{ lessonDate }}</p>
        </div>

        <div class="mb-3">
          <h3 class="font-bold">Time:</h3>
          <p>{{ `${hours}:${minutes}` }}</p>
        </div>

        <div class="mb-3">
          <h3 class="font-bold">Location:</h3>
          <p>{{ lesson.location }}</p>
        </div>

        <div class="mb-3" v-if="!isOwned">
          <h3 class="font-bold">Teacher:</h3>
          <p>{{ lesson.teacher }}</p>
        </div>

        <div class="mb-3">
          <h3 class="font-bold">Capacity:</h3>
          <p>{{ lesson.capacity }}</p>
        </div>

        <div class="mb-3">
          <h3 class="font-bold">Description:</h3>
          <p>{{ lesson.description }}</p>
        </div>

        <div v-if="isOwned">
          <h3 class="font-bold">Students:</h3>
          <ul v-if="lesson.attendingUsers.length > 0">
            <li v-for="(student, index) in students" :key="student.firstName + student.lastName">
              {{ index + 1 + '. ' + student.firstName + ' ' + student.lastName }}
            </li>
          </ul>
          <p v-else>No students at the moment</p>
        </div>

        <!-- prettier-ignore -->
        <div class="mt-8">
        <FwbButton
          v-if="isOwned"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'LessonUpdate' } as any)"
          data-testid="updateLesson"
          size="xl"
          >Edit lesson</FwbButton>

           <FwbButton
           @click="removeFromLesson"
          v-else-if="isJoined"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'Dashboard' } as any)"
          data-testid="updateLesson"
          size="xl"
          color="red"
          >Withdraw from lesson</FwbButton>

        <!-- prettier-ignore -->
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
</template>
