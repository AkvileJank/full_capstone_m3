import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { authenticate } from './guards'
import HomeLayout from '@/layouts/HomeLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'lesson/create',
          name: 'LessonCreate',
          component: () => import('../views/LessonCreateView.vue'),
        },
        {
          path: 'lesson/:id',
          name: 'Lesson',
          component: () => import('../views/SingleLessonView.vue'),
        },
        {
          path: 'lesson/:id/update',
          name: 'LessonUpdate',
          component: () => import('../views/LessonEditView.vue'),
        },
        {
          path: 'lessons',
          name: 'Lessons',
          component: () => import('../views/LessonsView.vue'),
        },
        // {
        //   path: 'lesson/:id/join',
        //   name: 'LessonJoin',
        //   component: () => import('../views/LessonJoinView.vue'),
        // },
        {
          path: 'lesson/:id/join/confirmation',
          name: 'JoinConfirmation',
          component: () => import('../views/ConfirmationView.vue'),
        },
        {
          path: 'lessons/joinedLessons',
          name: 'JoinedLessons',
          component: () => import('../views/JoinedLessonsView.vue'),
        },
        {
          path: 'lessons/createdLessons',
          name: 'CreatedLessons',
          component: () => import('../views/CreatedLessonsView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
      ],
    },
  ],
})

export default router
