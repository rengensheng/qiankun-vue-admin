import { App as AppType, createApp } from 'vue'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import './style.css'
import getRouter from "./router"
import App from './App.vue'

let app: AppType | null = null

renderWithQiankun({
  mount(props) {
    console.log('mount');
    render(props);
  },
  update(props) {
    console.log('update');
    render(props);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  unmount(props: any) {
    console.log('unmount');
    if (props.container) {
      app?.unmount();
    }
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}

function render(props: any) {
  if (!props.container) {
    app = createApp(App);
    const router = getRouter("/micro/sub1/");
    app.use(router);
    app.mount('#app');
  } else {
    app = createApp(App);
    const router = getRouter(props.menu.path.substring(0, props.menu.path.lastIndexOf('/') + 1));
    app.use(router);
    app.mount(props.container);
  }
}
