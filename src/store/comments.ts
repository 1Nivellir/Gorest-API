import { Comments } from "@/helpers/Types";
import { defineStore } from "pinia";

export const useCommentsStore = defineStore("comments", {
  state: () => ({
    commentsList: [] as Comments[],
  }),
  getters: {
    getListComments: (state) => state.commentsList,
  },
  actions: {
    addComment(data: Comments) {
      this.commentsList.push(data);
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
    removeComment(commentId: any) {
      const index = this.commentsList.findIndex(
        (comment) => comment.id === commentId
      );
      if (index !== -1) {
        this.commentsList.splice(index, 1);
      }
    },
    updateComment(updatedComment: Comments): void {
      const index = this.commentsList.findIndex(
        (comment) => comment.id === updatedComment.id
      );
      if (index !== -1) {
        this.commentsList[index] = updatedComment;
      }
    },
  },
});
