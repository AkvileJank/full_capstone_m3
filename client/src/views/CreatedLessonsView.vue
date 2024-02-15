<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbAlert, FwbButton, FwbHeading } from 'flowbite-vue'
import LessonPreviewComp from '@/components/LessonPreview.vue'
import type { LessonPreview } from '@mono/server/src/shared/entities'

const lessonsCreated = ref<LessonPreview[]>([])

onBeforeMount(async () => {
  lessonsCreated.value = await trpc.user.findOwned.query()
})
</script>

<template>
  <div class="h-screen bg-[url('../assets/dotsDash.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
    <div class="container mx-auto px-6 py-8 lg:h-full">
      <FwbHeading tag="h4" class="mb-3">Your created lessons:</FwbHeading>
      <div
        v-if="lessonsCreated.length"
        data-testid="lessonsCreatedList"
        class="grid grid-cols-1 lg:grid-cols-2 lg:gap-6"
      >
        <LessonPreviewComp
          v-for="lesson in lessonsCreated"
          :key="lesson.id"
          :lesson="lesson"
          class="card2"
        />
      </div>
      <FwbAlert v-else>No lessons yet!</FwbAlert>

      <div class="mb-8 mt-4 flex justify-center">
        <!-- prettier-ignore -->
        <FwbButton
        component="RouterLink"
        tag="router-link"
        :href="({ name: 'LessonCreate' } as any)"
        data-testid="createLesson"
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
</style>
