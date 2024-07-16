<template>
  <div class="loaders" v-if="api_loading">
    <v-skeleton-loader class="m-1 mt-2" :elevation="5" type="article"></v-skeleton-loader>
  </div>
  <Blog_post v-else
    :title="blogData.title"
    :description="blogData.description"
    :content="blogData.content"
    :author_pic_url="blogData.author_pic_path"
    :author_name="blogData.author_name"
    :date_created="blogData.date_created"
    :blog_id="blogData.id"
    :view_count="blogData.view_count"
    view_mode="full"
    @postDeleted="onDeletedPost"
    class="m-1 mt-2 post"
  />
</template>

<script setup>
import Blog_post from "@/components/Blog_post.vue";
import { useRouter } from 'vue-router';
import {onBeforeMount, ref} from "vue";
import {fetchWrapper} from "../helpers";

const router = useRouter();
const blog_id = ref(null)
const api_loading = ref(true);
const blogData = ref(null)

const fetchBlog = async () => {

  fetchWrapper.get(`${import.meta.env.VITE_API_URL}/api/articles/${blog_id.value}`)
    .then((response) => {
      blogData.value = {
        id: response.data.id,
        author_pic_path: response.data.author.picture,
        author_name: `${response.data.author.first_name} ${response.data.author.last_name}`,
        date_created: new Date(response.data.published_at).toLocaleDateString(),
        title: response.data.title,
        description: response.data.description,
        content: response.data.content,
        view_count: response.data.view_count
      }
      incrementView()
      api_loading.value = false;
    })
    .catch((error) => {
      if (error.response.status === 404) {
        router.push('/article/new')
      }
      console.log(error);
    })

}
const incrementView = async () => {
  fetchWrapper.post(`${import.meta.env.VITE_API_URL}/api/articles/${blog_id.value}/view`)
    .then((response) => {
      if (response.status === 200 && response.statusText === 'OK') {
        blogData.value.view_count += 1;
      }
    })
    .catch((error) => {
      console.log(error);
    })
}

const onDeletedPost = () => {
  router.push('/')
}
onBeforeMount(() => {
  try {
    blog_id.value = parseInt(router.currentRoute.value.params.id)
    if (blog_id.value === undefined || blog_id.value === null || typeof blog_id.value !== 'number') {
      console.log('Invalid blog id', blog_id.value);
      router.go(-1);
    }
  } catch (e) {
    console.log(e)
    router.go(-1);
  }
  fetchBlog()
})


</script>

<style scoped>
.post {
  max-width: 850px !important;
}
</style>
