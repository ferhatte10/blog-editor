// Plugins
import { registerPlugins } from '@/plugins'

//text editor
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// Styles
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'

//store configuration
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores';
const pinia = createPinia();


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { router } from './helpers'

const app = createApp(App)

app.component('QuillEditor', QuillEditor)
app.use(pinia)

const {initializeUser} = useAuthStore();
initializeUser()

app.use(router)

registerPlugins(app)

app.mount('#app')
