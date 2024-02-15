// Utilities
import { defineStore } from "pinia";
import { getUsers } from "@/helpers/AllUserService";
import { User } from "@/components/UserDetails/models";

export const useAppStore = defineStore("app", {
  state: () => ({
    animationInProgress: false,
    usersPage: 1,
    usersTotal: 0,
    usersPages: 1,
    usersList: [] as User[],
  }),
  getters: {
    getListUsers: (state) => state.usersList,
    getPageUsers: (state) => state.usersPage,
  },
  actions: {
    startAnimation() {
      this.animationInProgress = true;
    },
    endAnimation() {
      this.animationInProgress = false;
    },

    setTotalUsers(total: number) {
      this.usersTotal = total;
    },
    setCurrentPageUsers(page: number) {
      this.usersPage = page;
    },
    setPagesUsers(count: number) {
      this.usersPages = count;
    },
    getPagesUsers() {
      return this.usersPages;
    },
    async getAllUsers(page: number) {
      const item = await getUsers(page);
      this.usersList = item;
    },
  },
});
