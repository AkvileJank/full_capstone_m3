<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbAlert, FwbButton, FwbHeading } from 'flowbite-vue'
import type { LessonPreview } from '@mono/server/src/shared/entities'
import Lesson from '@/components/Lesson.vue'

const PAGE_SIZE = 5

const currentPage = ref(1)
const totalPages = ref(1)
const lessonsFound = ref<LessonPreview[]>([])

async function fetchLessons() {
  const result = await trpc.lesson.findAll.query({ page: currentPage.value, pageSize: PAGE_SIZE })
  lessonsFound.value = result.lessons
  totalPages.value = result.totalPages
}

onBeforeMount(async () => {
  await fetchLessons()
})

const changePage = (newPage: number) => {
  currentPage.value = newPage
  fetchLessons()
}

</script>

<template>
  <FwbHeading tag="h4" class="mb-6">Browse lessons to join:</FwbHeading>

  <div class="DashboardView">
    <div v-if="lessonsFound.length" data-testid="projectList">
      <Lesson v-for="lesson in lessonsFound" :key="lesson.id" :lesson="lesson" />
    </div>
  </div>

  <FwbButton @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
    Previous Page
  </FwbButton>
  <span>Page {{ currentPage }} of {{ totalPages }}</span>
  <FwbButton @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
    Next Page
  </FwbButton>
</template>
