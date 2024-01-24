import { HEADERS, URL_USERS } from "@/config";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { Response, User } from "./ReponseArray";

const userStore = useUserStore();
export const getUser = async (id: number) => {
  const url = URL_USERS + id;

  try {
    const response = await axios.get(url, { headers: HEADERS });
    updateUserStore(response);
  } catch (error) {
    console.log("Error:", error);
  }
};

export const updateUserStore = (response: Response) => {
  const userData: User = {
    id: response.data.id,
    email: response.data.email,
    gender: response.data.gender,
    name: response.data.name,
    status: response.data.status,
  };
  userStore.setUserData(userData);
};

export const deleteUser = async () => {
  const id = userStore.userData.id;
  const url = URL_USERS + id;
  try {
    const response = await axios.delete(url, { headers: HEADERS });
    console.log("User delete");
    localStorage.removeItem("UserData");
    userStore.isAuth = false;
    userStore.setUserData({
      id: 0,
      email: "",
      gender: "",
      name: "",
      status: "",
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
