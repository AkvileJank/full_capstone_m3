<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbAlert, FwbButton, FwbHeading } from 'flowbite-vue'
import Lesson from '@/components/Lesson.vue'
import type { LessonPreview } from '@server/entities/lesson'

const lessonsCreated = ref<LessonPreview[]>([])
const lessonsJoined = ref<LessonPreview[]>([])

onBeforeMount(async () => {
  lessonsCreated.value = await trpc.user.findOwned.query()
  lessonsJoined.value = await trpc.user.findJoinedLessons.query()
})
</script>

<template>
  <div class="cont">
    <img class="demo-bg" src="../assets/91002.jpg" alt="" />
    <div class="container mx-auto h-max px-6 py-8">
      <div class="DashboardView">
        <FwbHeading tag="h4" class="mb-3">You are attending these lessons:</FwbHeading>

        <div
          v-if="lessonsJoined.length"
          data-testid="projectList"
          class="grid grid-flow-col justify-stretch lg:gap-x-6"
        >
          <Lesson
            v-for="lesson in lessonsJoined.slice(0 - 4)"
            :key="lesson.id"
            :lesson="lesson"
            class="card"
          />
        </div>
        <FwbAlert v-else data-testid="projectListEmpty">No lessons yet!</FwbAlert>

        <div class="flex justify-end">
          <!-- prettier-ignore -->
          <FwbButton
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'JoinedLessons' } as any)"
          data-testid="createProject"
          size="xl"
          color="dark"
        >
          See all
        </FwbButton>
        </div>

        <div class="mb-6 flex justify-center">
          <!-- prettier-ignore -->
          <FwbButton
        component="RouterLink"
        tag="router-link"
        :href="({ name: 'Lessons' } as any)"
        data-testid="createProject"
        size="xl"
       class="btn"
      >
        Find a lesson to join
      </FwbButton>
        </div>
      </div>
      <FwbHeading tag="h4" class="mb-3">Your created lessons:</FwbHeading>
      <div
        v-if="lessonsCreated.length"
        data-testid="lessonsCreatedList"
        class="grid grid-flow-col justify-stretch lg:gap-x-6"
      >
        <Lesson
          v-for="lesson in lessonsCreated.slice(0 - 4)"
          :key="lesson.id"
          :lesson="lesson"
          class="card2"
        />
      </div>
      <FwbAlert v-else data-testid="projectListEmpty">No lessons yet!</FwbAlert>

      <div class="flex justify-end">
        <!-- prettier-ignore -->
        <FwbButton
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'CreatedLessons' } as any)"
          data-testid="createProject"
          size="xl"
          color="dark"
        >
          See all
        </FwbButton>
      </div>

      <div class="mb-8 mt-4 flex justify-center">
        <!-- prettier-ignore -->
        <FwbButton
        component="RouterLink"
        tag="router-link"
        :href="({ name: 'ProjectCreate' } as any)"
        data-testid="createProject"
        size="xl"
        class="btn"
      >
        Create a new lesson
      </FwbButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  background-color: #d5573b;
}

.demo-wrap {
  overflow: hidden;
  position: relative;
}

.demo-bg {
  opacity: 0.3;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: auto;
}

.container {
  position: relative;
}
</style>

<!-- #5173B3 blue -->
