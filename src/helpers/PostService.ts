import { OnePost, UpdatePost } from "@/components/PostsComponents/models";
import { HEADERS, URL_POSTS, URL_USERS } from "@/config";
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

export async function getPosts(id: number): Promise<OnePost[]> {
  let posts = [];
  const url = URL_USERS + id + "/posts";
  try {
    const response = await axios.get(url, {
      headers: HEADERS,
    });
    posts = await response.data;
  } catch (error) {
    console.log(error);
  }
  return posts;
}

export async function updatePost(
  id: number,
  data: UpdatePost
): Promise<{ status: number; post: OnePost }> {
  const url = URL_POSTS + id;
  let status = 0;
  let post: OnePost = {} as OnePost;
  try {
    const response = await axios.put(url, data, { headers: HEADERS });
    status = response.status;
    post = await response.data;
  } catch (error) {
    console.log("Error:", error);
  }
  return { status, post };
}

export async function deletePost(id: number): Promise<number> {
  const url = URL_POSTS + id;
  let status = 0;
  try {
    const response = await axios.delete(url, { headers: HEADERS });
    status = response.status;
  } catch (error) {
    console.log("Error:", error);
  }
  return status;
}

export async function createPost(
  id: number,
  data: UpdatePost
): Promise<OnePost> {
  const url = URL_USERS + id + "/posts/";
  let post = {} as OnePost;
  try {
    const response = await axios.post(url, data, {
      headers: HEADERS,
    });
    if (response.status === 201 || response.status === 200) {
      post = await response.data;
    }
  } catch (error: any) {
    console.error("Error:", error);
  }
  return post;
}
