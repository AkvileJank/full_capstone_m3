<script setup lang="ts">
import Bug from '@/components/Bug.vue'
import { trpc } from '@/trpc'
import type { UserBare } from '@mono/server/src/shared/entities'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/Card.vue'
import useErrorMessage from '../composables/useErrorMessage/index';

const route = useRoute()

const lesson = ref()

const lessonId = Number(route.params.id)

onBeforeMount(async () => {
  const [lessonFound] = await Promise.all([trpc.lesson.findById.query({ id: lessonId })])
  lesson.value = lessonFound
})

const [joinLesson, errorMessage] = useErrorMessage(async() => {
  await trpc.lesson.join.mutate({id: lessonId})
})
</script>

<template>
  <div v-if="lesson">
    <div class="mb-4 flex flex-row">
      <FwbHeading tag="h1" class="mb-0 !text-xl">
        {{ lesson.title }}
      </FwbHeading>
    </div>

    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
      <Card>
        <div class="mb-3">
          <h3 class="font-bold">Date:</h3>
          <p>{{ lesson.dateTime }}</p>
        </div>

        <div class="mb-3">
          <h3 class="font-bold">Location:</h3>
          <p>{{ lesson.location }}</p>
        </div>

        <div class="mb-3">
          <h3 class="font-bold">Capacity:</h3>
          <p>{{ lesson.capacity }}</p>
        </div>

        <div class="mb-3">
          <h3 class="font-bold">Description:</h3>
          <p class="mb-8">{{ lesson.description }}</p>
        </div>

        <!-- prettier-ignore -->
        <FwbButton
          @click="joinLesson"
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'Dashboard' } as any)"
          data-testid="joinLesson"
          size="xl"
          >Join lesson</FwbButton
        >
      </Card>
    </Transition>
  </div>
</template>
