import { HEADERS, URL_USERS } from "@/config";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { User } from "./Types";

const userStore = useUserStore();

export const getUser = async (id: number): Promise<User> => {
  const url = URL_USERS + id;
  let userData: User = {
    id: 0,
    email: "",
    gender: "",
    name: "",
    status: "",
  };
  try {
    const response = await axios.get(url, { headers: HEADERS });
    userData = response.data;
    if (userStore.userData.id === 0) {
      userStore.setUserData(userData);
    }
  } catch (error) {
    console.log("Error:", error);
  }
  return userData;
};

export const deleteUser = async () => {
  const id = userStore.userData.id;
  const url = URL_USERS + id;
  try {
    const response = await axios.delete(url, { headers: HEADERS });
    if (response.status === 204) {
      localStorage.removeItem("UserData");
      userStore.isAuth = false;
      userStore.setUserData({
        id: 0,
        email: "",
        gender: "",
        name: "",
        status: "",
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
