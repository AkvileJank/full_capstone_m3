<script lang="ts" setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { FwbButton } from 'flowbite-vue'
import Card from './Card.vue'
import type { LessonPreview } from '@server/entities/lesson'

defineProps<{
  lesson: LessonPreview
}>()
</script>

<template>
  <Card class="flex flex-row items-center justify-between" data-testid="project">
    <h5 class="text-lg tracking-tight text-gray-900 dark:text-white">
      {{ lesson.title }}
    </h5>
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
  </Card>
</template>
