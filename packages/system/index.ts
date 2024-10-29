
import router from "./router";
import type { App, Component } from "vue";
import * as Icons from "@packages/components/icons";

export function registerRouter(app: App) {
  for (const icon in Icons) {
    app.component(icon, (Icons as any)[icon] as Component);
  }
  app.use(router);
}