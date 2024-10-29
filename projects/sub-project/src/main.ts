import { createApp } from 'vue'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import './style.css'
import App from './App.vue'


// some code
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
  console.log('render', props);
  if (!props.container) {
    console.log("here")
    createApp(App).mount('#app');
  } else {
    createApp(App).mount(props.container);
  }
}
