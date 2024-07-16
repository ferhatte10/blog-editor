<template>
  <v-skeleton-loader v-if="api_loading"
    :elevation="3"
    class=" m-3 border"
    max-width="700"
    type="article,actions"
  ></v-skeleton-loader>
  <div v-else class="edit-card flex-grow-1 d-flex flex-column m-3">
        <h3>New post :</h3>
        <Form class="flex-grow-1 d-flex flex-column"
          :validation-schema="schema"
          @submit="submitArticle"
          v-slot="{ errors }"
          >
          <div class="d-flex">
              <div class="form-group m-2">
                  <label for="title" class="mb-1">Title :</label>
                  <Field name="title" v-model="formData.title" type="texte" class="form-control" :class="{ 'is-invalid': errors.title }" id="title" aria-describedby="titleHelp" placeholder="Enter title" />
                  <div class="invalid-feedback">{{errors.title}}</div>
              </div>
              <div class="form-group flex-grow-1 m-2">
                  <label for="description" class="mb-1">Description :</label>
                  <Field name="description" v-model="formData.description" type="texte" class="form-control" :class="{ 'is-invalid': errors.description }" id="description" aria-describedby="descriptionHelp" placeholder="Enter description" />
                  <div class="invalid-feedback">{{errors.description}}</div>
              </div>
          </div>

          <div class="form-group m-2 flex-grow-1 d-flex flex-column">
              <label for="txt-editor" class="mb-1">Content :</label>
              <QuillEditor
                  class="flex-grow-1"
                  id="txt-editor"
                  v-model:content="formData.content"
                  :options="editor_option"
                  toolbar='full'
                  contentType='html'
                  @blur="onBlur"
                   />
                  <div class="invalid-feedback"
                      :class="!!content_error?'d-block':'d-none'">
                      {{content_error}}
                  </div>
          </div>
          <span class="d-flex flex-wrap">
            <v-btn
              block
              class="m-2 flex-grow-0"
              :color="updateMode ? 'purple' : 'green'"
              style="width:100px; min-width: 100px;"
              size="large"
              variant="tonal"
              type="submit"
              :loading="api_loading"
            >
              {{updateMode ? 'Update' : 'Create'}}
            </v-btn>
          </span>


        </Form>

    </div>
</template>

<script setup>

import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import {onBeforeMount, reactive, ref} from 'vue';
import {fetchWrapper} from "../helpers";
import { useRouter } from 'vue-router';
const router = useRouter()

const updateMode = ref(router.currentRoute.value.name === 'editBlog')
const articleId = ref(null)

const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
});

const contentSchema = Yup.object().shape({
    // must be a string not empty and equal "<p><br></p>"
    content: Yup.string().test('empty','Content is required', (value) => {
        return value !== "" && value !== "<p><br></p>";
    })
});

const content_error = ref('');
const api_loading = ref(false);


let oldData = {}

const formData = reactive({
    title: '',
    description: '',
    content: ''
})

const editor_option = {
        //debug: 'info',
        placeholder: 'Compose your blog...',
        theme: 'snow',
}

const validate_content = () => {
    contentSchema.validate(
        {content: formData.content}
    ).then(() => {
        content_error.value = '';
    }
    ).catch((err) => {
        content_error.value = err.errors[0];
    });
}

const createArticle = async () => {
  fetchWrapper.post(`${import.meta.env.VITE_API_URL}/api/articles`,
    {
      title: formData.title,
      description: formData.description,
      content: formData.content
    }).then((response) => {
      router.push(`/article/${response.data.article.id}`)
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      api_loading.value = false;
    })
}
const updateArticle = async () => {
    fetchWrapper.put(`${import.meta.env.VITE_API_URL}/api/articles/${articleId.value}`,
      {
        title: formData.title,
        description: formData.description,
        content: formData.content
      }).then((response) => {
        router.push(`/article/${response.data.id}`)
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        api_loading.value = false;
      })
}
const submitArticle =  () => {
  api_loading.value = true;
  // validate the formData.content
  contentSchema.validate(
      {content: formData.content}
  ).then(() => {
      content_error.value = '';
      if (updateMode.value) {
        if (oldData.title === formData.title &&
            oldData.description === formData.description &&
            oldData.content === formData.content) {

          throw new Error('No changes detected');
        }
        updateArticle()
      } else {
        createArticle()
      }
  }
  ).catch((err) => {
      content_error.value = err.errors ? err.errors[0] : err.message
      api_loading.value = false;
  });
}

const onBlur = () => {
    validate_content();
}

const fetchBlog = async () => {

  fetchWrapper.get(`${import.meta.env.VITE_API_URL}/api/articles/${articleId.value}`)
    .then((response) => {
      oldData = response.data

      formData.title = response.data.title
      formData.description = response.data.description
      formData.content = response.data.content

      api_loading.value = false;
    })
    .catch((error) => {
      if (error.response.status === 404) {
        router.push('/article/new')
      }
      console.log(error);
    })

}

onBeforeMount(() => {
  console.log(formData)

  if (updateMode.value) {
    try {
      articleId.value = parseInt(router.currentRoute.value.params.id)
      if (articleId.value === undefined || articleId.value === null || typeof articleId.value !== 'number') {
        console.log('Invalid blog id', articleId.value);
        router.go(-1);
      }
    } catch (e) {
      console.log(e)
      router.go(-1);
    }
    fetchBlog()
  }else {
    // creation mode
    updateMode.value = false;
    formData.title = '';
    formData.description = '';
    formData.content = '';
  }

})

</script>

<style scoped>

.edit-card {
    background-color: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.1);
    max-width: 733px;
}

</style>
