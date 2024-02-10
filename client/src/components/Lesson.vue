<script lang="ts" setup>
import { ArrowRightIcon, CalendarIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { FwbButton } from 'flowbite-vue'
import Card from './Card.vue'
import type { LessonPreview } from '@server/entities/lesson'
import dateFormatter from '../utils/dateFormatter'

const props = defineProps<{
  lesson: LessonPreview
}>()

const dateTime = dateFormatter(props.lesson.dateTime)
</script>

<template>
  <Card class="flex flex-col justify-between" data-testid="project">
    <div class="mb-2 flex flex-col gap-2">
      <h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        {{ lesson.title }}
      </h5>
      <div class="flex gap-2">
        <CalendarIcon class="h-5 w-4" />
        <p>{{ `${dateTime.date} ${dateTime.time}` }}</p>
      </div>
      <div class="flex gap-2">
        <MapPinIcon class="h-5 w-4" />
        <p>{{ lesson.location }}</p>
      </div>
    </div>
    <div class="flex flex-row justify-end">
      <!-- prettier-ignore -->
      <FwbButton
      component="RouterLink"
      tag="router-link"
      data-testid="viewProjectBugs"
      :href="({ name: 'Lesson', params: { id: lesson.id } } as any)"
      class="pr-3"
    >
      See lesson details
      <ArrowRightIcon aria-hidden="true" class="inline h-4 w-4" />
    </FwbButton>
    </div>
  </Card>
</template>
