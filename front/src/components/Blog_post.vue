<template>
    <v-card id="post">
        <v-card-title>
            {{ props.title }}
        </v-card-title>

        <v-card-subtitle>
            {{ props.description }}
        </v-card-subtitle>

        <v-card-text v-html=blogContent></v-card-text>

        <v-card-actions>

            <v-list-item-title v-if="props.view_mode === 'short' ">
                <v-btn icon @click="redirectToBlog()">
                    <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              Read More
            </v-list-item-title>

            <v-list-item-title>
                <v-btn icon @click="redirectToUpdate">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
              Edit Post
            </v-list-item-title>

            <v-list-item-title>
                <v-btn icon @click="deletePost">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
              Delete Post
            </v-list-item-title>

            <v-list-item-title class="d-flex flex-row ms-3">
                <v-icon class="me-1">mdi-eye</v-icon><span>{{props.view_count}}</span>
            </v-list-item-title>

        </v-card-actions>

        <v-list-item
            :title="props.author_name"
            :subtitle="props.date_created"
        >
            <template  v-slot:prepend >
                <v-skeleton-loader v-if="!pic_url" type="avatar"></v-skeleton-loader>
                <v-avatar v-else size="x-large">
                <v-img
                    alt="Avatar"
                    :src="pic_url"
                />
                </v-avatar>
            </template>
        </v-list-item>
    </v-card>
</template>

<script setup>

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores';
import { onBeforeMount, onBeforeUpdate, ref } from 'vue';
import { fetchWrapper} from '@/helpers';
import { useRouter } from 'vue-router';

const emit = defineEmits(['postDeleted']);
const router = useRouter();

const pic_url = ref(null);

const authStore = useAuthStore();
const { token : token } = storeToRefs(authStore);

const props = defineProps({
  title: {
      type: String,
      required: true,
  },
  description: {
      type: String,
      required: true
  },
  content: {
      type: String,
      required: true
  },
  author_pic_url: {
      type: String,
      required: true
  },
  author_name: {
      type: String,
      required: true
  },
  date_created: {
      type: String,
      required: true,
      default: new Date().toLocaleDateString()
  },
  blog_id: {
    type: Number,
    required: true
  },
  view_mode: {
    type: String,
    required: false,
    validator: (value) => {
        return ['full', 'short'].includes(value);
    },
    default: 'short'
  },
  view_count: {
    type: Number,
    required: false,
    default: 0
  }
});

const lines = props.content.split('<br>');
// Take the first three lines and join them back together
const visibleLines = lines.slice(0, 1).join('<br>');
// Set the visible content
let blogContent  = props.view_mode ==="full" ? props.content : visibleLines + '...';



const redirectToBlog = () => {
  router.push(`/article/${props.blog_id}`);
}

const redirectToUpdate = () => {
  router.push(`/article/edit/${props.blog_id}`);
}


const fetchPicture = async () => {
  if (token.value) { // if the user is logged in
        fetchWrapper // fetch the picture with token in header then transform it to base64
        .get(`${import.meta.env.VITE_API_URL}/api/uploads/${props.author_pic_url}`,{},true)
        .then(response => {
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
          // Set the avatar source
          pic_url.value = `data:image/jpeg;base64,${base64Image}`;
        });
    }
}

const deletePost = async () => {
  fetchWrapper.delete(`${import.meta.env.VITE_API_URL}/api/articles/${props.blog_id}`)
  .then(() => {
    emit('postDeleted', props.blog_id)
  })
  .catch((error) => {
    console.log(error);
  });
}
onBeforeMount(() => { //once the component is mounted, fetch the picture
    fetchPicture();
})

onBeforeUpdate(() => { // when the user changes, fetch the picture
    fetchPicture();
})


</script>

<style scoped>
#post{
  max-width: 733px !important;
}
</style>
