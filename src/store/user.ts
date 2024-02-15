import { CreateUser, User } from "@/components/UserDetails/models";
import {
  createUser,
  deleteUser,
  getIsAuth,
  updateUser,
} from "@/helpers/UserService";
import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => ({
    isAuth: false,
    userId: null as number | null,
    userData: {
      id: 0,
      email: "",
      gender: "",
      name: "",
      status: "",
    },
  }),
  getters: {
    getAuth: (state) => state.isAuth,
    getId: (state) => state.userData.id,
  },
  actions: {
    setUserLocalStorage(data: User) {
      const encodedUserData = btoa(JSON.stringify(data));
      localStorage.setItem("UserData", encodedUserData);
    },
    async updateUser(data: User) {
      const user = await updateUser(this.userData.id, data);
      this.userData = user;
    },
    async createUser(data: CreateUser) {
      const user = await createUser(data);
      this.userData = user;
      this.isAuth = true;
      this.setUserLocalStorage(user);
    },
    async setUserData(id: number) {
      const user = await getIsAuth(id);
      if (user && typeof user.id === "number") {
        this.userData = user;
      }
      this.userData = user;
      this.isAuth = true;
    },
    getUserData(): User {
      return this.userData;
    },
    outUser() {
      (this.isAuth = false),
        (this.userData = {
          id: 0,
          email: "",
          gender: "",
          name: "",
          status: "",
        });
    },
    getUserId(id: number) {
      this.userId = id;
    },
    async removeUser(id: number) {
      const status = await deleteUser(id);
      if (status === 204) {
        this.outUser();
        this.getAuthFalse();
      }
    },
    getAuthTrue() {
      this.isAuth = true;
    },
    getAuthFalse() {
      this.isAuth = false;
    },
  },
});
