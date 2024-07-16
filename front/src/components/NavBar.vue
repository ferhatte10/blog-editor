<template>
  <v-navigation-drawer
            id="nav"
            v-model="drawer"
            :rail="true"
            expand-on-hover
            permanent
            rail-width="65"
            >
    <v-list class="mt-2">
      <v-list-item
            :title="`${authUser.user_info.first_name} ${authUser.user_info.last_name}`"
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
     </v-list>


     <v-divider></v-divider>

              <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-account" title="My Account" value="account" @click="redirectTo('/account')"></v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-rss" title="Blog Posts" value="blogs" @click="redirectTo('/')"></v-list-item>
                <v-list-item prepend-icon="mdi-pencil" title="New Post" value="newpost" href="/article/new"></v-list-item>
              </v-list>

              <template v-slot:append>
                <div class="pa-2">
                  <v-list-item prepend-icon="mdi-logout" title="Logout" value="logout" @click="authStore.logout"></v-list-item>
                </div>
              </template>

            </v-navigation-drawer>
</template>

<script setup>

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores';
import { onBeforeMount, onBeforeUpdate, ref } from 'vue';
import { fetchWrapper} from '@/helpers';
import { useRouter } from 'vue-router';
const router = useRouter();

const drawer = ref(true);

const authStore = useAuthStore();
const { user: authUser, token : token } = storeToRefs(authStore);

const pic_url = ref(null);

const redirectTo = (route="/") => {
  router.push(route);
};

const fetchPicture = async () => {
  if (token.value) { // if the user is logged in
        fetchWrapper // fetch the picture with token in header then transform it to base64
        .get(`${import.meta.env.VITE_API_URL}/api/uploads/user`,{},true)
        .then(response => {
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
          // Set the avatar source
          pic_url.value = `data:image/jpeg;base64,${base64Image}`;
        });
    }
}
onBeforeMount(() => { //once the component is mounted, fetch the picture
    fetchPicture();
})

onBeforeUpdate(() => { // when the user changes, fetch the picture
    fetchPicture();
})

</script>

<style scoped>
#nav {
  /* border radius bottom right*/
  border-bottom-right-radius: 10px;
  /* border radius top right*/
  border-top-right-radius: 10px;

  /* background color degradé */
  background: linear-gradient(145deg, #e4e8f8, #f1b775);
}
#nav > *{
  animation: fadeIn 0.1s;
}
</style>
