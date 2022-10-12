import { createApp } from "vue";
//import 'floating-vue/dist/style.css'

import FloatingVue from 'floating-vue'
import App from "sfc/app.vue";


const app = createApp(App)
.use(FloatingVue)
.mount("#app");
