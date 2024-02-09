<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbAlert, FwbButton, FwbHeading } from 'flowbite-vue'
import Lesson from '@/components/Lesson.vue'
import type { LessonPreview } from '@server/entities/lesson'

const lessonsCreated = ref<LessonPreview[]>([])
const lessonsJoined = ref<LessonPreview[]>([])

onBeforeMount(async () => {
  lessonsCreated.value = await trpc.lesson.findOwned.query()
  lessonsJoined.value = await trpc.user.findJoinedLessons.query()
})
</script>

<template>
  <div class="DashboardView">
    <FwbHeading tag="h4" class="mb-3">You are attending these lessons:</FwbHeading>

    <div v-if="lessonsJoined.length" data-testid="projectList">
      <Lesson v-for="lesson in lessonsJoined" :key="lesson.id" :lesson="lesson" />
    </div>
    <FwbAlert v-else data-testid="projectListEmpty">No lessons yet!</FwbAlert>

    <div class="mb-16 mt-4">
      <!-- prettier-ignore -->
      <FwbButton
        component="RouterLink"
        tag="router-link"
        :href="({ name: 'Lessons' } as any)"
        data-testid="createProject"
        size="xl"
      >
        Find a lesson to join
      </FwbButton>
    </div>

    <FwbHeading tag="h4" class="mb-3">Your created lessons:</FwbHeading>
    <div v-if="lessonsCreated.length" data-testid="lessonsCreatedList">
      <Lesson v-for="lesson in lessonsCreated" :key="lesson.id" :lesson="lesson" />
    </div>
    <FwbAlert v-else data-testid="projectListEmpty">No lessons yet!</FwbAlert>

    <div class="mb-8 mt-4">
      <!-- prettier-ignore -->
      <FwbButton
        component="RouterLink"
        tag="router-link"
        :href="({ name: 'ProjectCreate' } as any)"
        data-testid="createProject"
        size="xl"
      >
        Create a new lesson
      </FwbButton>
    </div>
  </div>
</template>
