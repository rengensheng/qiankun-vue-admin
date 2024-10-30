import { createRouter, createWebHistory } from "vue-router";

const routes = [{
  path: 'first',
  name: 'First',
  component: () => import('../views/First.vue')
}, {
  path: 'second',
  name: 'Second',
  component: () => import('../views/Second.vue')
}]

export default function getRouter(baseUrl: string = "/") {
  return createRouter({
    history: createWebHistory(),
    routes: [{
      path: baseUrl,
      name: 'BaseLayout',
      children: routes
    }]
  })
}