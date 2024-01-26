import { HEADERS, URL_USERS } from "@/config";
import { useAppStore } from "@/store/app";
import { usePostsStore } from "@/store/posts";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { computed, watch } from "vue";

export const fetchPost = async (page: number, id: number) => {
  const postsStore = usePostsStore();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const limit = 5;
  const userAuth = computed(() => userStore.getAuth);

  watch(
    userAuth,
    async (isAuth) => {
      if (isAuth) {
        try {
          const url = URL_USERS + id + "/posts";
          const response = await axios.get(url, {
            params: {
              page: page,
              per_page: limit,
            },
            headers: HEADERS,
          });
          const totalPages = Math.ceil(
            response.headers["x-pagination-total"] / limit
          );
          const totalPosts = parseInt(response.headers["x-pagination-total"]);
          appStore.setTotalPosts(totalPosts);
          appStore.getPages();
          postsStore.setPosts(response.data);
          if (totalPages > 0) {
            appStore.setPages(totalPages);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }
    },
    { immediate: true }
  );
};
