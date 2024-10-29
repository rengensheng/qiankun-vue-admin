import { defineStore } from "pinia";
import { getMenuList } from "@packages/api/menu";
import { UserLoginRes, Route } from "@packages/types"

type UserStoreState = {
  user: UserLoginRes | null;
  menuList: Route[] | undefined;
}

type UserStoreAction = {
  login(userInfo: UserLoginRes): void;
  loadMenuList(menuList: Route[]): void;
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
      getMenuList()
    },
    async loadMenuList() {
      const menuListResp = await getMenuList()
      this.menuList = menuListResp.result
    }
  },
})