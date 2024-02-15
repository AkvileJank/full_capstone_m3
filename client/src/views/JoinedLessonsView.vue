<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbAlert, FwbButton, FwbHeading } from 'flowbite-vue'
import LessonPreviewComp from '@/components/LessonPreview.vue'
import type { LessonPreview } from '@mono/server/src/shared/entities'

const lessonsJoined = ref<LessonPreview[]>([])

onBeforeMount(async () => {
  lessonsJoined.value = await trpc.user.findJoinedLessons.query()
})
</script>

<template>
  <div class="bg-[url('../assets/dotsDash.jpg')] bg-cover bg-fixed bg-center bg-no-repeat h-full">
    <div class="container mx-auto px-6 py-8">
      <FwbHeading tag="h4" class="mb-3">Your joined lessons:</FwbHeading>
      <div
        v-if="lessonsJoined.length"
        data-testid="lessonsCreatedList"
        class="grid grid-cols-1 lg:grid-cols-2 lg:gap-6"
      >
        <LessonPreviewComp v-for="lesson in lessonsJoined" :key="lesson.id" :lesson="lesson" />
      </div>
      <FwbAlert v-else>No lessons yet!</FwbAlert>

      <div class="mb-8 mt-4 flex justify-center">
        <!-- prettier-ignore -->
        <FwbButton
        component="RouterLink"
        tag="router-link"
        :href="({ name: 'Lessons' } as any)"
        data-testid="findLessons"
        size="xl"
       class="btn"
      >
        Find a lesson to join
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
