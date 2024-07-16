<template>
  <div>
    <slot name="logo">
      <h1 class="text-h4 text-center font-weight-bold mb-6 mt-12"
      >
        Login to your account
      </h1>
    </slot>

    <v-form @submit.prevent="submitLogin()" ref="form">
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field
          v-model="email"
          density="compact"
          :placeholder="identifierPlaceholder"
          :rules="[v=>!!v || 'E-mail is required', v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid']"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          name="email"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>

        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          :placeholder="passwordPlaceholder"
          :rules="[v => !!v || 'Password is required']"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          autocomplete
        ></v-text-field>

        <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          type="submit"
          :loading="apiLoading"
        >
          Log In
        </v-btn>

        <slot v-if="apiError" name="notice">
          <v-card
            class="mb-12"
            color="red"
            variant="tonal"
          >
            <v-card-text class="text-medium-emphasis text-caption">
              {{ apiError }}
            </v-card-text>
          </v-card>
        </slot>

        <v-card-text class="text-center ">
          <a
            id="register-link"
            class="text-blue cursor-pointer text-caption"
            @click="pushRegister()"
            rel="noopener noreferrer"
          >
            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {handleResponse} from '@/helpers';
import {useAuthStore} from '@/stores';
import { useRouter } from 'vue-router';
const router = useRouter();


const identifierPlaceholder = 'email@example.com'
const passwordPlaceholder = 'Enter your password'
const visible =  ref(false)
const form = ref(null)

const email = ref('')
const password = ref('')

const apiError = ref(null)
const apiLoading = ref(false)

const pushRegister = () => {
  router.push('/register')
}

const submitLogin = async () => {
  apiError.value = null

  const { valid } = await form.value.validate()

  if (valid) {
    apiLoading.value = true
    const authStore = useAuthStore();
    return authStore.login(email.value, password.value)
      .catch(error => {
        const { token, logout } = useAuthStore();
        handleResponse(error,token,logout);
        apiError.value = (error.response.data && error.response.data.error) || error.response.statusText;
      }).finally(() => {
        apiLoading.value = false
      })

  }
}
</script>


<style scoped>
/*on link hover*/
#register-link:hover {
  color: #000000 !important;
}
</style>
