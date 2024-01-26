import { defineStore } from "pinia";

export const useTodoStore = defineStore("posts", {
  state: () => ({
    todoList: [],
  }),
  getters: {
    getTodoList: (state) => state.todoList,
  },
  actions: {
    setTodoList(data: any) {
      this.todoList = data;
    },
  },
});
