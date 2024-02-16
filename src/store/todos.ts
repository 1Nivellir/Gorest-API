import { CreateTodo, Todo } from "@/components/TodoComponents/models";
import {
  createEvent,
  deleteEvent,
  fetchTodos,
  getTodoList,
  updateEvent,
} from "@/helpers/TodoService";
import { defineStore } from "pinia";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todoList: [] as Todo[],
    currentPage: 1,
    total: 0,
    pages: 1,
    filterTodo: "",
  }),
  getters: {
    getFilter: (state) => state.filterTodo,
    getTodoList: (state) => state.todoList,
    getCurrentPage: (state) => state.currentPage,
    getPages: (state) => state.pages,
  },
  actions: {
    setCurrentPage(page: number) {
      this.currentPage = page;
    },
    setTotalTodos(total: number) {
      this.total = total;
    },
    setTotalPages(total: number) {
      this.pages = total;
    },
    async updateTodo(id: number, data: CreateTodo) {
      const item = await updateEvent(id, data);
      const index = this.todoList.findIndex((item) => item.id === id);
      this.todoList[index] = item;
    },
    async getTodos(id: number) {
      this.todoList = await getTodoList(id);
      return this.todoList;
    },
    async setItem(text: string, id: number) {
      const res = await createEvent(text, id);
      this.todoList.push(res);
    },
    async removeItem(id: number) {
      const status = await deleteEvent(id);
      if (status === 200 || status === 204) {
        const index = this.todoList.findIndex((item) => item.id === id);
        this.todoList.splice(index, 1);
      }
    },
    async setTodoList(id: number, page: number, status: string) {
      console.log(status);
      const item = await fetchTodos(id, page, status);
      this.todoList = item;
    },

    clearTodos() {
      this.todoList = [];
      (this.currentPage = 1), (this.total = 0), (this.pages = 1);
    },
    setFilter(filter: string) {
      this.filterTodo = filter;
    },
  },
});
