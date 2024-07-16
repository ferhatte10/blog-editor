<template>
  <div>
    <div class="text-center mt-3">
      <h1>Register</h1>
    </div>
    <v-card
      class="mx-auto mt-5 pb-7 mb-3"
      elevation="8"
      max-width="448"
    >
      <v-card-text >
        <v-form  @submit.prevent="submitRegister()" ref="form">
          <v-file-input
              :rules="rules"
              accept="image/png, image/jpeg, image/bmp"
              label="Please select your image"
              placeholder="Pick an avatar"
              variant="outlined"
              prepend-icon=""
              @change="handleFileChange($event.target)"
              @click:clear="onClearAvatar"
          >
            <template #prepend>
              <v-avatar class="mb-2" size="60">
                <v-img
                  :src="image_src"
                  alt="Avatar"
                ></v-img>
              </v-avatar>
            </template>
          </v-file-input>

          <v-text-field
            v-model="formData.first_name"
            density="compact"
            :placeholder="identifierFirstName"
            :rules="[v=>!!v || 'First name is required']"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            name="first_name"
            class="mt-2"
          />
          <v-text-field
            v-model="formData.last_name"
            density="compact"
            :placeholder="identifierLastName"
            :rules="[v=>!!v || 'Last name is required']"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            name="last_name"
            class="mt-2"
          />

          <v-text-field
            v-model="formData.email"
            density="compact"
            :placeholder="identifierPlaceholder"
            :rules="[v=>!!v || 'E-mail is required', v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid']"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            name="email"
            class="mt-2"
          />

          <v-text-field
            v-model="formData.mobile"
            density="compact"
            :placeholder="identifierMobile"
            :rules="[v=>!v || /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v) || 'Mobile must be valid']"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            name="mobile"
            class="mt-2"
          />

          <v-text-field
            v-model="formData.password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            :placeholder="passwordPlaceholder"
            :rules="[v => !!v || 'Password is required']"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            autocomplete
            class="mt-2"
          ></v-text-field>

          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            :placeholder="passwordPlaceholder"
            :rules="[v => !!v || 'Password is required', v => v === formData.password || 'Passwords do not match']"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            autocomplete
            class="mt-2"
          ></v-text-field>

          <v-btn
            class="rounded-0 mb-2 mt-2"
            x-large
            variant="tonal"
            color="blue"
            type="submit"
            :loading="apiLoading"
          >Register</v-btn>

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

          <v-card-actions class="text--secondary">
            <v-spacer></v-spacer>
            Already have an account?
            <a @click="redirectTo('/login')" class="pl-2" style="color: #000000; cursor: pointer;">Sign In</a>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>


</template>

<script setup>
import { useRouter } from 'vue-router';
import {reactive, ref} from "vue";
import {fetchWrapper} from "../helpers";
const router = useRouter();

const redirectTo = (path) => {
  router.push(path);
}

const visible =  ref(false)
const form = ref(null)
const apiError = ref(null)
const apiLoading = ref(false)

const image_src = ref("http://localhost:3000/api/uploads/default")

const identifierPlaceholder = 'email@example.com'
const identifierFirstName = 'Jean-du-Pont'
const identifierLastName = 'Dupont'
const identifierMobile = '+33 6 12 34 56 78'
const passwordPlaceholder = 'Enter your password'

const rules = [
  value => !value || !value.length || value[0].type === 'image/png' || value[0].type === 'image/jpeg' || value[0].type === 'image/jpg' || value[0].type === 'image/bmp' || 'Avatar must be an image!',
  value => {
    return !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!'
  },

]

const formData = reactive({
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  mobile: '',
  picture: null
})

const handleFileChange = (event) => {
  let file = event.files[0]
  if (file && file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/bmp') {
    return
  }
  formData.picture = file
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    image_src.value = e.target.result
  }
}

const onClearAvatar = () => {
  formData.picture = null
  image_src.value = `${import.meta.env.VITE_API_URL}/api/uploads/default`
}

const submitRegister = async () => {
  apiError.value = null

  const { valid } = await form.value.validate()

  if (valid) {
    apiLoading.value = true

    let formdataSend = new FormData()
    formdataSend.append('email', formData.email)
    formdataSend.append('password', formData.password)
    formdataSend.append('first_name', formData.first_name)
    formdataSend.append('last_name', formData.last_name)
    if (formData.mobile !== "") {
      formdataSend.append('mobile', formData.mobile)
    }
    if (formData.picture !== null) {
      formdataSend.append('picture', formData.picture)
    }


    fetchWrapper.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,{},false, formdataSend)
      .then(() => {
        router.push('/login')
      })
      .catch(error => {
        apiError.value = (error.response.data && error.response.data.error) || error.response.statusText;
      }).finally(() => {
      apiLoading.value = false
    })
  }
}

</script>

<style scoped>

</style>
