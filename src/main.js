import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

app.use(router);
app.use(store);

store.dispatch('sessionState/client/capabilities/detectTouchSupport');

app.mount('#app');
