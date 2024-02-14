<script setup lang="ts">
import { trpc } from '@/trpc'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/Card.vue'
// import dateFormatter from '@/utils/dateFormatter'
import LessonDetails from '@/components/LessonDetails.vue'

const route = useRoute()

const lesson = ref()
const lessonId = Number(route.params.id)
// const lessonDate = ref<Record<string, string>>({})

onBeforeMount(async () => {
  const [lessonFound] = await Promise.all([trpc.lesson.findById.query({ id: lessonId })])
  lesson.value = lessonFound
  // lessonDate.value = dateFormatter(lesson.value.dateTime)
})
</script>

<template>
  <div class="container mx-auto px-6 py-8">
    <div v-if="lesson">
      <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
        <Card>
          <div class="mb-4 flex flex-row">
            <FwbHeading tag="h1" class="mb-3 !text-xl">
              You have successfully joined this lesson:
            </FwbHeading>
          </div>
          <LessonDetails
            :lesson="lesson"

            :is-confirm="true"
          ></LessonDetails>

          <!-- prettier-ignore -->
          <div class="mt-8">
        <FwbButton
          component="RouterLink"
          tag="router-link"
          :href="({ name: 'Dashboard' } as any)"
          data-testid="updateLesson"
          size="xl"
          >Close</FwbButton>
      </div>
        </Card>
      </Transition>
    </div>
  </div>
</template>
