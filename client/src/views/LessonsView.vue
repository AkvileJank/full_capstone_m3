<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbButton, FwbHeading, FwbAlert } from 'flowbite-vue'
import type { LessonPreview } from '@mono/server/src/shared/entities'
import LessonPreviewComp from '@/components/LessonPreview.vue'

const PAGE_SIZE = 6

const currentPage = ref(1)
const totalPages = ref(1)
const lessonsFound = ref<LessonPreview[]>([])
const allJoinedLessons = ref<LessonPreview[]>([])

async function fetchLessons() {
  const result = await trpc.lesson.findAll.query({ page: currentPage.value, pageSize: PAGE_SIZE })
  lessonsFound.value = result.lessons
  totalPages.value = result.totalPages
}

onBeforeMount(async () => {
  await fetchLessons()
  allJoinedLessons.value = await trpc.user.findJoinedLessons.query()
})

const changePage = (newPage: number) => {
  currentPage.value = newPage
  fetchLessons()
}

const isJoined = (lesson: LessonPreview) => {
  return allJoinedLessons.value.some((joinedLesson) => joinedLesson.id === lesson.id)
}
</script>

<template>
  <div class="h-screen bg-[url('../assets/dotsDash.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
    <div class="container mx-auto px-6 py-8">
      <FwbHeading tag="h4" class="mb-6">Browse all lessons:</FwbHeading>

      <div class="DashboardView">
        <div
          v-if="lessonsFound.length"
          data-testid="lessonList"
          class="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-6"
        >
          <LessonPreviewComp
            v-for="lesson in lessonsFound"
            :key="lesson.id"
            :lesson="lesson"
            :class="{ joined: isJoined(lesson) }"
          />

          <div class="flex justify-center gap-6">
            <FwbButton @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
              Previous
            </FwbButton>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <FwbButton @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
              Next
            </FwbButton>
          </div>
        </div>

        <FwbAlert class="mb-3" v-else data-testid="lessonListEmpty">No lessons yet!</FwbAlert>
      </div>
    </div>
  </div>
</template>
<style scoped>
.joined {
  background-color: #ace49c;
  opacity: 0.7;
}
</style>
