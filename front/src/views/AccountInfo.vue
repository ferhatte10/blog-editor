<template>
  <div>
    <div class="text-center mt-3">
      <h1>Account Informations</h1>
    </div>
    <v-card
      class="mx-auto mt-5 pb-7 mb-3"
      elevation="8"
      max-width="448"
    >
      <v-card-text >
        <v-card-actions class="justify-end">
          <v-btn
            class="rounded-0"
            x-large
            variant="text"
            color="dark"
            @click="readOnly = !readOnly"
          >
            <v-icon>{{readOnly?'mdi-pencil':'mdi-pencil-off'}}</v-icon>
          </v-btn>
        </v-card-actions>
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
            :readonly="readOnly"
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
            :readonly="readOnly"
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
            :readonly="readOnly"
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
            :readonly="readOnly"
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
            :readonly="readOnly"
          />

          <v-text-field
            v-model="formData.password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            :placeholder="passwordPlaceholder"
            :rules="[]"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            autocomplete
            class="mt-2"
            :readonly="readOnly"
          ></v-text-field>

          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            :placeholder="passwordPlaceholder"
            :rules="[v => !formData.password || v === formData.password || 'Passwords do not match']"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            autocomplete
            class="mt-2"
            :readonly="readOnly"
          ></v-text-field>

          <v-btn
            class="rounded-0 mb-2 mt-2"
            x-large
            variant="tonal"
            color="blue"
            type="submit"
            :loading="apiLoading"
            :readonly="readOnly"
            :disabled="readOnly"
          >Update</v-btn>

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
        </v-form>
      </v-card-text>
    </v-card>
  </div>


</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores';
import { useRouter } from 'vue-router';
import {onBeforeMount, reactive, ref} from "vue";
import {fetchWrapper} from "../helpers";
const router = useRouter()

const authStore = useAuthStore();
const { user: authUser,token } = storeToRefs(authStore);


const readOnly = ref(true)
const visible =  ref(false)
const form = ref(null)
const apiError = ref(null)
const apiLoading = ref(false)

const image_src = ref("http://localhost:3000/api/uploads/default")
const image_src_original = ref("")

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
  email: authUser.value.user_info.email,
  password: '',
  first_name: authUser.value.user_info.first_name,
  last_name: authUser.value.user_info.last_name,
  mobile: authUser.value.user_info.mobile || '',
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
  image_src.value = image_src_original.value
}

const submitRegister = async () => {
  apiError.value = null

  const { valid } = await form.value.validate()

  if (valid) {
    apiLoading.value = true
    let conditionFields =
      formData.first_name === authUser.value.user_info.first_name &&
      formData.last_name === authUser.value.user_info.last_name &&
      formData.email === authUser.value.user_info.email &&
      formData.mobile === authUser.value.user_info.mobile &&
      formData.picture === null && formData.password === ""

    if (conditionFields)
     {
      apiError.value = "No changes detected"
      apiLoading.value = false
      return
    }

    let formdataSend = new FormData()
    formdataSend.append('email', formData.email)
    formdataSend.append('first_name', formData.first_name)
    formdataSend.append('last_name', formData.last_name)
    if (formData.mobile !== "") {
      formdataSend.append('mobile', formData.mobile)
    }
    if (formData.picture !== null) {
      formdataSend.append('picture', formData.picture)
    }
    if (formData.password !== '') {
      console.log("password")
      formdataSend.append('password', formData.password)
    }


    fetchWrapper.patch(`${import.meta.env.VITE_API_URL}/api/users/${authUser.value.user_info.id}`,{},false, formdataSend)
      .then(() => {
        router.go(0)
      })
      .catch(error => {
        apiError.value = (error.response.data && error.response.data.error) || error.response.statusText;
      }).finally(() => {
      apiLoading.value = false
    })
  }
}

const fetchPicture = async () => {
  if (token.value) { // if the user is logged in
    fetchWrapper // fetch the picture with token in header then transform it to base64
      .get(`${import.meta.env.VITE_API_URL}/api/uploads/user`,{},true)
      .then(response => {
        const base64Image = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        // Set the avatar source
        image_src.value = `data:image/jpeg;base64,${base64Image}`;
        image_src_original.value = `data:image/jpeg;base64,${base64Image}`;
      });
  }
}

onBeforeMount(() => { //once the component is mounted, fetch the picture
  fetchPicture();
})

</script>

<style scoped>

</style>
