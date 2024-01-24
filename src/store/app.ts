// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    postPage: 1,
    postTotal: 0,
    postPages: 1,
    animationInProgress: false,
    usersPage: 1,
    usersTotal: 0,
    usersPages: 1,
  }),
  getters: {
    getPagePosts: (state) => state.postPage,
    getPageUsers: (state) => state.usersPage,
  },
  actions: {
    startAnimation() {
      this.animationInProgress = true;
    },
    endAnimation() {
      this.animationInProgress = false;
    },
    setTotalPosts(total: number) {
      this.postTotal = total;
    },
    setCurrentPage(page: number) {
      this.postPage = page;
    },
    setPages(count: number) {
      this.postPages = count;
    },
    getPages() {
      return this.postPages;
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
  },
});
