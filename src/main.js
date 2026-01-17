import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS e JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(App).use(router).mount('#app')