import {
  addCommentToServer,
  deleteComment,
  updateComment,
} from "@/helpers/CommentsService";
import { Comments } from "@/components/PostsComponents/models";
import { defineStore } from "pinia";

export const useCommentsStore = defineStore("comments", {
  state: () => ({
    commentsList: [] as Comments[],
  }),
  getters: {
    getListComments: (state) => state.commentsList,
  },
  actions: {
    async addComment(id: number, data: string) {
      const item = await addCommentToServer(id, data);
      this.commentsList.push(item);
    },
    getComment(id: any) {
      const arrComments = this.commentsList.filter(
        (item) => item.post_id === id
      );
      return arrComments;
    },
    setComments(item: any): void {
      this.commentsList = item;
    },
    async removeComment(commentId: number) {
      const status = await deleteComment(commentId);
      if (status === 200 || status === 204) {
        const index = this.commentsList.findIndex(
          (comment) => comment.id === commentId
        );
        if (index !== -1) {
          this.commentsList.splice(index, 1);
        }
      }
    },
    async updateComment(id: number, text: string) {
      const updatedComment = await updateComment(id, text);
      const index = this.commentsList.findIndex((comment) => comment.id === id);
      if (index !== -1) {
        this.commentsList[index] = updatedComment;
      }
    },
  },
});
