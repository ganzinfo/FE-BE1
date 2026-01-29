import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import logger from './plugins/logger'

const app = createApp(App);
app.use(router);
app.use(logger, { prefix: '[TaskerPro]' });
app.mount('#app');
