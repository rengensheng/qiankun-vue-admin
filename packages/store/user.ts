import { defineStore } from "pinia";
import { getMenuList } from "@packages/api/menu";
import { UserLoginRes, Route } from "@packages/types"
type UserStoreState = {
  user: UserLoginRes | null;
  menuList: Route[];
}

type UserStoreAction = {
  login(userInfo: UserLoginRes): void;
  getUserInfo(): void;
  loadMenuList(): Promise<Route[]>;
}

let menuLoadPromise: Promise<any> | null = null

export const useUserStore = defineStore<string, UserStoreState, {}, UserStoreAction>("userStore", {
  state: () => ({
    user: null,
    menuList: []
  }),
  actions: {
    login(userInfo: UserLoginRes) {
      this.user = userInfo;
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("token", userInfo.token);
      this.loadMenuList()
    },
    async getUserInfo() {
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        this.user = JSON.parse(userInfo);
        this.loadMenuList()
      }
    },
    async loadMenuList(): Promise<Route[]> {
      if (!menuLoadPromise) {
        menuLoadPromise = getMenuList()
      }
      const menuListResp = await menuLoadPromise
      this.menuList = menuListResp.result || []
      return this.menuList
    }
  },
})