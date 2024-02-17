<script lang="ts" setup>
import type { LessonPreview } from '@mono/server/src/shared/entities'
import LessonPreviewComp from '@/components/LessonPreview.vue'
import { FwbAlert } from 'flowbite-vue'

defineProps<{
  lessons: LessonPreview[]
  itemsPerScreen: number
}>()
</script>

<template>
  <div
    v-if="lessons.length"
    data-testid="lessonList"
    class="flex flex-col justify-stretch gap-x-6 lg:grid lg:grid-cols-3"
  >
    <LessonPreviewComp
      v-for="lesson in lessons.slice(0 - itemsPerScreen)"
      :key="lesson.id"
      :lesson="lesson"
      class="card"
    />
  </div>
  <FwbAlert v-else data-testid="lessonListEmpty">No lessons yet!</FwbAlert>
</template>
