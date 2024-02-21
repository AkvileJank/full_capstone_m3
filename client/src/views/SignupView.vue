<script lang="ts" setup>
import { signup } from '@/stores/user'
import { ref } from 'vue'
import PageForm from '@/components/PageForm.vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import useErrorMessage from '@/composables/useErrorMessage'

const userForm = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const hasSucceeded = ref(false)

const [submitSignup, errorMessage] = useErrorMessage(async () => {
  await signup(userForm.value)
  hasSucceeded.value = true
})
</script>

<template>
  <div class="h-screen bg-[url('../assets/dots.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
    <PageForm heading="Sign up for an account" formLabel="Signup" @submit="submitSignup">
      <template #default>
        <FwbInput label="Email" type="email" v-model="userForm.email" :required="true" />

        <FwbInput
          label="Password"
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          v-model="userForm.password"
          :required="true"
        />
        <FwbInput
          label="First name"
          id="firstName"
          name="firstName"
          type="text"
          v-model="userForm.firstName"
          :required="true"
        />

        <FwbInput
          label="Last name"
          id="lastName"
          name="lastName"
          type="text"
          v-model="userForm.lastName"
          :required="true"
        />

        <FwbAlert v-if="hasSucceeded" data-testid="successMessage" type="success">
          You have successfully signed up! You can now log in.
          <RouterLink
            :to="{ name: 'Login' }"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >Go to the login page</RouterLink
          >
        </FwbAlert>

        <AlertError :message="errorMessage">
          {{ errorMessage }}
        </AlertError>

        <div class="grid">
          <FwbButton color="green" type="submit" size="xl">Sign up</FwbButton>
        </div>
      </template>

      <template #footer>
        <FwbAlert class="bg-transparent text-center">
          Already a member?
          {{ ' ' }}
          <RouterLink
            :to="{ name: 'Login' }"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >Log in</RouterLink
          >
        </FwbAlert>
      </template>
    </PageForm>
  </div>
</template>
