import { createApp } from "vue";

import { createI18n } from "vue-i18n";
//import 'floating-vue/dist/style.css'

import FloatingVue from 'floating-vue'
import App from "sfc/app.vue";


setTimeout(()=>{
    const i18n = createI18n({
        locale: navigator.language,
        fallbackLocale: "en",
    });

    const app = createApp(App)
        .use(FloatingVue)
        .use(i18n)
        .mount("#app")
    ;
}, 0);
