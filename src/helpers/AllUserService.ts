import axios from "axios";
import { URL_USERS, HEADERS } from "@/config";
import { useAppStore } from "@/store/app";
import { User } from "@/components/UserDetails/models";

export async function getUsers(page: number): Promise<User[]> {
  const limit = 10;
  const appStore = useAppStore();
  let data = [];
  try {
    const response = await axios.get(URL_USERS, {
      params: {
        page: page,
        per_page: limit,
      },
      headers: HEADERS,
    });
    data = await response.data;
    const totalPages = Math.ceil(
      response.headers["x-pagination-total"] / limit
    );
    const totalPosts = parseInt(response.headers["x-pagination-total"]);
    appStore.setTotalUsers(totalPosts);
    if (totalPages > 0) {
      appStore.setPagesUsers(totalPages);
    }
  } catch (error) {
    console.log("Error:", error);
  }
  return Promise.resolve(data);
}
