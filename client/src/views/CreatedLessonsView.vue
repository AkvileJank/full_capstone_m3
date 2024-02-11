<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbAlert, FwbButton, FwbHeading } from 'flowbite-vue'
import Lesson from '@/components/Lesson.vue'
import type { LessonPreview } from '@mono/server/src/shared/entities'

const lessonsCreated = ref<LessonPreview[]>([])

onBeforeMount(async () => {
  lessonsCreated.value = await trpc.user.findOwned.query()
})
</script>

<template>
  <div class="cont">
    <img class="demo-bg" src="../assets/91002.jpg" alt="" />
    <div class="container mx-auto px-6 py-8 lg:h-screen">
      <FwbHeading tag="h4" class="mb-3">Your created lessons:</FwbHeading>
      <div
        v-if="lessonsCreated.length"
        data-testid="lessonsCreatedList"
        class="grid grid-cols-1 lg:grid-cols-2 lg:gap-6"
      >
        <Lesson v-for="lesson in lessonsCreated" :key="lesson.id" :lesson="lesson" class="card2" />
      </div>
      <FwbAlert v-else data-testid="projectListEmpty">No lessons yet!</FwbAlert>

      <div class="mb-8 mt-4 flex justify-center">
        <!-- prettier-ignore -->
        <FwbButton
        component="RouterLink"
        tag="router-link"
        :href="({ name: 'ProjectCreate' } as any)"
        data-testid="createProject"
        size="xl"
        color="green"
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

