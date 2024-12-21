import './assets/main.css';
import './assets/paginator.css';
import './assets/pgs-1.css';
import './assets/pgs-2.css';
import './assets/pgs-3.css';
import './assets/pgs-4.css';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

var app = createApp(App);

app.use(router);
app.mount('#app');
