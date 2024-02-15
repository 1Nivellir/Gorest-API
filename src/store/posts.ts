import { createPost, deletePost, updatePost } from "@/helpers/PostService";
import { OnePost, UpdatePost } from "@/components/PostsComponents/models";
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
    setPosts(posts: OnePost[]) {
      this.posts = posts;
    },
    clearPosts() {
      this.posts = [];
    },
  },
});
