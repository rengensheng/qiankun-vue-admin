import { createApp } from 'vue'
import './style.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'
import App from './App.vue'
import { registerRouter } from '@packages/system/index.ts'
import { registerStore } from '@packages/store/index.ts'

const app = createApp(App)
registerRouter(app)
registerStore(app)
app.mount('#app')
