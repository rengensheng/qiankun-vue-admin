import { StrictMode } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper.d.ts'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import './index.css'
import App from './App.tsx'
import '../global.d.ts'

let ReactDOM: Root;


function render(props: QiankunProps) {
  const { container } = props;
  const containerElement = container ? container.querySelector('#root') : document.querySelector('#root')
  ReactDOM = createRoot(containerElement!)
  ReactDOM.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

renderWithQiankun({
  mount(props: QiankunProps) {
    console.log('mount');
    render(props);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  unmount(props: QiankunProps) {
    const { container } = props;
    console.log('unmount', container);
    ReactDOM.unmount()
  },
  update(props: QiankunProps) {
    console.log('update', props.container);
  }
});
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}