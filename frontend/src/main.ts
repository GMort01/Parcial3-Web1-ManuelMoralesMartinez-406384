import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // <--- IMPORTAR

createApp(App)
  .use(router) // <--- USAR
  .mount('#app')