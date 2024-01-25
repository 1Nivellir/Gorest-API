import { OnePost } from "@/helpers/Types";
import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [] as OnePost[],
    showModal: false,
  }),
  getters: {
    getShowModal: (state) => state.showModal,
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
    addPost(post: OnePost): void {
      this.posts.push(post);
    },
    removePost(postId: number) {
      const index = this.posts.findIndex((posts) => posts.id === postId);
      if (index !== -1) {
        this.posts.splice(index, 1);
      }
    },
    updatePost(updatedPost: OnePost): void {
      const index = this.posts.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) {
        this.posts[index] = updatedPost;
      }
    },
    setPosts(posts: OnePost[]): void {
      this.posts = posts;
    },
    clearPosts() {
      this.posts = [];
    },
  },
});
