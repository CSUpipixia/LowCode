import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/index'

const vue = createApp(App)

vue.use(router)

router.isReady().then(() => vue.mount('#app')) 