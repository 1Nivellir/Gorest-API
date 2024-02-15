import { OnePost, UpdatePost } from "@/components/PostsComponents/models";
import {
  createPost,
  deletePost,
  fetchPost,
  updatePost,
} from "@/helpers/PostService";
import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [] as OnePost[],
    showModal: false,

    postPage: 1,
    postTotal: 0,
    postPages: 1,
  }),
  getters: {
    getShowModal: (state) => state.showModal,
    getPagePosts: (state) => state.postPage,
    getPosts: (state) => state.posts,
    getPages: (state) => state.postPages,
  },
  actions: {
    getListPost(): OnePost[] {
      return this.posts;
    },
    showMessage() {
      this.showModal = true;
      setTimeout(() => {
        this.showModal = false;
      }, 3000);
    },
    async addPost(id: number, post: UpdatePost) {
      const res = await createPost(id, post);
      this.posts.push(res);
    },
    async removePost(postId: number) {
      const status = await deletePost(postId);
      if (status === 200 || status === 204) {
        const index = this.posts.findIndex((posts) => posts.id === postId);
        if (index !== -1) {
          this.posts.splice(index, 1);
        }
      }
    },
    async updatePost(updatedPost: UpdatePost, id: number) {
      const result = await updatePost(id, updatedPost);
      if (result && (result.status === 200 || result.status === 201)) {
        const index = this.posts.findIndex((post) => post.id === id);
        if (index !== -1) {
          console.log("Post updated successfully");
          this.posts[index] = result.post;
        }
      }
    },
    async setPosts(page: number, id: number) {
      const item = await fetchPost(page, id);
      this.posts = item;
    },
    clearPosts() {
      this.posts = [];
      (this.postPage = 1), (this.postTotal = 0), (this.postPages = 1);
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
  },
});
