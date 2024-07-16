<template>
    <div class="home-view-elements m-2 mt-2">
        <div class="loaders" v-if="api_loading">
            <v-skeleton-loader class="m-1 mt-2" v-for=" item in [1,2,3,4]" :key="item" :elevation="5" type="article"></v-skeleton-loader>
        </div>
        <Blogpost v-else
            v-for="blog in postData.blogs"
                :key="blog.id"
                :title="blog.title"
                :description="blog.description"
                :content="blog.content"
                :author_pic_url="blog.author_pic_path"
                :author_name="blog.author_name"
                :date_created="blog.date_created"
                :blog_id="blog.id"
                :view_count="blog.view_count"
                @postDeleted="onDeletedPost"
                class="m-1 mt-2"
                />
    </div>
</template>

<script setup>
import {Blogpost} from '@/components';
import {onBeforeMount, reactive, ref} from 'vue';
import {fetchWrapper} from "../helpers";
import { useRouter } from 'vue-router';

const router = useRouter();
const postData = reactive({
    blogs : []
});

const api_loading = ref(true);

const fetchBlogs = async () => {
    fetchWrapper.get(`${import.meta.env.VITE_API_URL}/api/articles`)
        .then((response) => {
          postData.blogs = response.data.map((blog) => {
                return {
                    id: blog.id,
                    author_pic_path: blog.author.picture,
                    author_name: `${blog.author.first_name} ${blog.author.last_name}`,
                    date_created: new Date(blog.published_at).toLocaleDateString(),
                    title: blog.title,
                    description: blog.description,
                    content: blog.content,
                    view_count: blog.view_count
                }
            })
            api_loading.value = false;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            router.push('/article/new')
          }
          console.log(error);
          api_loading.value = false;
        })
}

const onDeletedPost = (e) => {
  postData.blogs = postData.blogs.filter((blog) => blog.id !== e)
  if (postData.blogs.length === 0) {
    router.push('/article/new')
  }
}
onBeforeMount(() => {
  fetchBlogs()
});

</script>

<style scoped>
#title {
  /* border radius*/
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;

  /* background color */
  background-color: #b9baca;


}
</style>
