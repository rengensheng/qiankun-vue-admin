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
  loadMenuList(): void;
}

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
    async loadMenuList() {
      const menuListResp = await getMenuList()
      this.menuList = menuListResp.result || []
    }
  },
})