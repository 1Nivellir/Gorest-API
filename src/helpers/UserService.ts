import { HEADERS, URL_USERS } from "@/config";
import axios from "axios";
import { User, CreateUser } from "@/components/UserDetails/models";

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
  } catch (error) {
    console.log("Error:", error);
  }
  return userData;
};

export const deleteUser = async (id: number) => {
  const url = URL_USERS + id;
  try {
    const response = await axios.delete(url, { headers: HEADERS });
    if (response.status === 204) {
      localStorage.removeItem("UserData");
    }
    return response.status;
  } catch (error) {
    console.log("Error:", error);
  }
};

export async function getIsAuth(id: number): Promise<User> {
  const url = URL_USERS + id;
  let user = {
    id: 0,
    email: "",
    gender: "",
    name: "",
    status: "",
  };
  try {
    const response = await axios.get(url, { headers: HEADERS });
    if (response.status === 200 || response.status === 201) {
      user = await response.data;
    }
  } catch (error) {
    console.log("Error:", error);
  }
  return user;
}

export async function updateUser(id: number, user: User): Promise<User> {
  const url = URL_USERS + id;
  const data = {
    name: user.name,
    email: user.email,
    status: user.status,
    gender: user.gender,
    id: user.id,
  };
  let updateUser = {} as User;
  try {
    const response = await axios.put(url, data, {
      headers: HEADERS,
    });
    updateUser = await response.data;
  } catch (error) {
    console.log("Error:", error);
  }
  return updateUser;
}

export async function createUser(user: CreateUser): Promise<User> {
  const url = URL_USERS;
  const data = {
    name: user.name,
    email: user.email,
    gender: user.gender,
    status: user.status,
  };
  let userNew = {} as User;
  try {
    const response = await axios.post(url, data, {
      headers: HEADERS,
    });
    userNew = await response.data;
  } catch (error) {
    console.log("Error:", error);
  }
  return userNew;
}
