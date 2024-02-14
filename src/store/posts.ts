import { deletePost, updatePost, createPost } from "@/helpers/PostService";
import { OnePost } from "@/helpers/Types";
import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [] as OnePost[],
    showModal: false,
  }),
  getters: {
    getShowModal: (state) => state.showModal,
    getPosts: (state) => state.posts,
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
    async addPost(id: number, post: OnePost) {
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
    async updatePost(updatedPost: OnePost, id: number): Promise<void> {
      const status = await updatePost(id, updatedPost);
      if (status === 200 || status === 201) {
        const index = this.posts.findIndex((post) => post.id === id);
        if (index !== -1) {
          console.log("Post updated successfully");
          this.posts[index] = updatedPost;
        }
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
