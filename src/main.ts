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
    name: 'sub-vue3-app',
    entry: import.meta.env.MODE === 'development' ? 'http://localhost:5174' : '/sub-vue3-app/',
    container: '#sub-app-container',
    activeRule: '/sub/vue3',
    props: {
      msg: "我是来自主应用的值-vue3"
    }
  },
  {
    name: 'sub-react-app',
    entry: import.meta.env.MODE === 'development' ? 'http://localhost:5174' : '/sub-react-app/',
    container: '#sub-app-container',
    activeRule: '/sub/react',
    props: {
      msg: "我是来自主应用的值-react"
    }
  }
])
const app = createApp(App)
const router = registerRouter(app)
registerStore(app)
app.mount('#app')
router.afterEach(() => {
  start()
})