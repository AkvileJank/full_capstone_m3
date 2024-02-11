<script setup lang="ts">
import { trpc } from '@/trpc'
import { FwbButton, FwbHeading } from 'flowbite-vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/Card.vue'
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/vue/24/outline'
import dateFormatter from '@/utils/dateFormatter'

const route = useRoute()

const lesson = ref()
const lessonId = Number(route.params.id)
const lessonDate = ref<Record<string, string>>({})

onBeforeMount(async () => {
  const [lessonFound] = await Promise.all([trpc.lesson.findById.query({ id: lessonId })])
  lesson.value = lessonFound
  lessonDate.value = dateFormatter(lesson.value.dateTime)
})
</script>

<template>
  <div class="container mx-auto px-6 py-8">
    <div v-if="lesson">
      <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
        <Card>
          <div class="mb-4 flex flex-row">
            <FwbHeading tag="h1" class="mb-3 !text-xl">
              You have successfully joined "{{ lesson.title }}"!
            </FwbHeading>
          </div>
          <div class="flex gap-10">
            <div class="mb-3 flex gap-2">
              <CalendarIcon class="inline h-5 w-4"></CalendarIcon>
              <p>{{ lessonDate.date }}</p>
            </div>

            <div class="mb-3 flex gap-2">
              <ClockIcon class="inline h-5 w-4"></ClockIcon>
              <p>{{ lessonDate.time }}</p>
            </div>

            <div class="mb-3 flex gap-2">
              <h3 class="inline font-bold">Duration:</h3>
              <p>{{ `${lesson.duration} min` }}</p>
            </div>
          </div>

          <div class="mb-6 flex gap-2">
            <MapPinIcon class="inline h-5 w-4"></MapPinIcon>
            <p>{{ lesson.location }}</p>
          </div>

          <div class="mb-2">
            <h3 class="font-bold">Teacher:</h3>
            <p>{{ lesson.teacher }}</p>
          </div>

          <div class="mb-2">
            <h3 class="font-bold">Description:</h3>
            <p>{{ lesson.description }}</p>
          </div>

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
