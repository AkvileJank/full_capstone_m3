<script setup lang="ts">
import { trpc } from '@/trpc'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { UserBare } from '@server/entities/user'
import Card from '@/components/Card.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/vue/24/outline'

type Student = Pick<UserBare, 'firstName' | 'lastName'> // this should be in User entity types

const route = useRoute()
const router = useRouter()

const lesson = ref()
const students = ref<Student[]>()

const lessonId = Number(route.params.id)

const isLessonOwned = ref<boolean>()
const isLessonJoined = ref<boolean>()

const lessonDate = ref<string>('')
const hours = ref<string>('')
const minutes = ref<string>('')

onBeforeMount(async () => {
  const [lessonFound] = await Promise.all([trpc.lesson.findById.query({ id: lessonId })])
  lesson.value = lessonFound
  lessonDate.value = new Date(lessonFound.dateTime).toISOString().split('T')[0]
  hours.value = String(new Date(lessonFound.dateTime).getHours()).padStart(2, '0')
  minutes.value = String(new Date(lessonFound.dateTime).getMinutes()).padStart(2, '0')

  isLessonOwned.value = await trpc.lesson.isOwned.query({ id: lessonId })
  isLessonJoined.value = !isLessonOwned.value
    ? await trpc.lesson.isJoined.query({ id: lessonId })
    : undefined
  students.value = isLessonOwned.value
    ? await trpc.lesson.findAttendingUsers.query({ id: lessonId })
    : []
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
  <div class="container mx-auto px-6 py-8">
    <div v-if="lesson">
      <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
        <Card data-testid="lessonDetails">
          <div class="mb-4 flex flex-row">
            <FwbHeading tag="h1" class="mb-3 !text-xl">
              {{ lesson.title }}
            </FwbHeading>
          </div>
          <div class="flex gap-10">
            <div class="mb-3 flex gap-2">
              <CalendarIcon class="inline h-5 w-4"></CalendarIcon>
              <p>{{ lessonDate }}</p>
            </div>

            <div class="mb-3 flex gap-2">
              <ClockIcon class="inline h-5 w-4"></ClockIcon>
              <p>{{ `${hours}:${minutes}` }}</p>
            </div>

            <div class="mb-3 flex gap-2">
              <h3 class="inline font-bold">Duration:</h3>
              <p>{{ `${lesson.duration} min` }}</p>
            </div>
          </div>

          <div class="mb-6 flex gap-2">
            <MapPinIcon class="inline h-5 w-4"></MapPinIcon>
            <p>{{ lesson.location }}</p>
          </div>

          <div class="mb-2" v-if="!isLessonOwned">
            <h3 class="font-bold">Teacher:</h3>
            <p>{{ lesson.teacher }}</p>
          </div>

          <div class="mb-2">
            <h3 class="font-bold">Capacity:</h3>
            <p>{{ lesson.capacity }}</p>
          </div>

          <div class="mb-2">
            <h3 class="font-bold">Description:</h3>
            <p>{{ lesson.description }}</p>
          </div>

          <div v-if="isLessonOwned">
            <h3 class="font-bold">Students:</h3>
            <ul v-if="lesson.attendingUsers.length > 0">
              <li v-for="(student, index) in students" :key="student.firstName + student.lastName">
                {{ index + 1 + '. ' + student.firstName + ' ' + student.lastName }}
              </li>
            </ul>
            <p v-else>No students at the moment</p>
          </div>

          <FwbAlert v-if="errorMessage" data-testid="errorMessage" type="danger">
          {{ errorMessage }}
        </FwbAlert>

          <!-- prettier-ignore -->
          <div class="mt-8">
        <FwbButton
          v-if="isLessonOwned"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'LessonUpdate' } as any)"
          data-testid="updateLesson"
          size="xl"
          >Edit lesson</FwbButton>

           <FwbButton
           @click="removeFromLesson"
          v-else-if="isLessonJoined"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'Dashboard' } as any)"
          data-testid="removeFromLesson"
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
  </div>
</template>
