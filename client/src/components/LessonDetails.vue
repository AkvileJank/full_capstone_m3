<script lang="ts" setup>
import type { LessonDetails } from '@mono/server/src/shared/entities'
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { FwbHeading } from 'flowbite-vue'
import dateFormatter from '@/utils/dateFormatter'

const props = defineProps<{
  lesson: LessonDetails
  isLessonOwned?: boolean
  isConfirm?: boolean
}>()

const dateFormatted = dateFormatter(props.lesson.dateTime)
</script>

<template>
  <div class="mb-4 flex flex-row">
    <FwbHeading tag="h1" class="mb-3 !text-xl">
      {{ lesson.title }}
    </FwbHeading>
  </div>
  <div class="flex gap-5 lg:gap-10">
    <div class="mb-3 flex gap-2">
      <CalendarIcon class="inline h-5 w-4"></CalendarIcon>
      <p>{{ dateFormatted.date }}</p>
    </div>

    <div class="mb-3 flex gap-2">
      <ClockIcon class="inline h-5 w-4"></ClockIcon>
      <p>{{ dateFormatted.time }}</p>
    </div>

    <div class="mb-3 flex gap-2">
      <h3 class="inline grow font-bold">Duration:</h3>
      <p class="grow">{{ `${lesson.duration} min` }}</p>
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

  <div v-if="!isConfirm" class="mb-2">
    <h3 class="font-bold">Capacity:</h3>
    <p>{{ lesson.capacity }}</p>
  </div>

  <div class="mb-2">
    <h3 class="font-bold">Description:</h3>
    <p>{{ lesson.description }}</p>
  </div>

  <div v-if="isLessonOwned">
    <h3 class="font-bold">Students:</h3>
    <ul v-if="lesson.attendingUsers && lesson.attendingUsers.length > 0">
      <li
        v-for="(student, index) in lesson.attendingUsers"
        :key="student.firstName + student.lastName"
      >
        {{ index + 1 + '. ' + student.firstName + ' ' + student.lastName }}
      </li>
    </ul>
    <p v-else>No students at the moment</p>
  </div>
</template>
