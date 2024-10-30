import { createApp } from 'vue'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import './style.css'
import getRouter from "./router"
import App from './App.vue'

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
    const { container } = props;
    container.innerHTML = '';
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}

function render(props: any) {
  if (!props.container) {
    const app = createApp(App)
    const router = getRouter("/micro/sub1/");
    app.use(router);
    app.mount('#app');
  } else {
    const app = createApp(App)
    const router = getRouter(props.menu.path.substring(0, props.menu.path.lastIndexOf('/') + 1));
    app.use(router);
    app.mount(props.container);
  }
}
