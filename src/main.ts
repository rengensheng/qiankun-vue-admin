import { createApp } from 'vue'
import './style.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'
import App from './App.vue'
import { registerMicroApps, start } from 'qiankun'
import { registerRouter } from '@packages/system/index.ts'
import { registerStore } from '@packages/store/index.ts'

registerMicroApps([
  {
    name: 'vue3-app',
    entry: import.meta.env.MODE === 'development' ? 'http://127.0.0.1:5174' : '/vue3-app/',
    container: '#sub-app-container',
    activeRule: '/vue3-app',
    props: {
      msg: "我是来自主应用的值-vue3"
    }
  }
])
start()
const app = createApp(App)
registerRouter(app)
registerStore(app)
app.mount('#app')
