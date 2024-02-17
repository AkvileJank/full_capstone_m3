<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import type { LessonPreview } from '@mono/server/src/shared/entities'
import DashboardPreviews from '@/components/DashboardPreviews.vue'

const lessonsCreated = ref<LessonPreview[]>([])
const lessonsJoined = ref<LessonPreview[]>([])

onBeforeMount(async () => {
  lessonsCreated.value = await trpc.user.findOwned.query()
  lessonsJoined.value = await trpc.user.findJoinedLessons.query()
})

const itemsPerScreen = 3
</script>

<template>
  <div class="bg-[url('../assets/dotsDash.jpg')] bg-cover bg-fixed bg-center bg-no-repeat h-screen">
    <div class="container mx-auto h-max px-6 py-8">
      <div class="DashboardView">
        <FwbHeading tag="h4" class="mb-3">You are attending these lessons:</FwbHeading>
        <DashboardPreviews
          :lessons="lessonsJoined"
          :items-per-screen="itemsPerScreen"
          data-testid="lessonsJoined"
        ></DashboardPreviews>

        <div class="flex justify-end">
          <!-- prettier-ignore -->
          <FwbButton
          v-show="lessonsJoined.length > itemsPerScreen"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'JoinedLessons' } as any)"
          data-testid="joinedLessons"
          size="xl"
          color="dark"
        >
          See all
        </FwbButton>
        </div>

        <div class="mb-6 mt-4 flex justify-center">
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

      <FwbHeading tag="h4" class="mb-3">Your created lessons:</FwbHeading>
      <DashboardPreviews
        :lessons="lessonsCreated"
        :items-per-screen="itemsPerScreen"
        data-testid="lessonsCreated"
      ></DashboardPreviews>

      <div class="flex justify-end">
        <!-- prettier-ignore -->
        <FwbButton
        v-show="lessonsCreated.length > itemsPerScreen"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'CreatedLessons' } as any)"
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
