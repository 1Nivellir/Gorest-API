import { CreateTodo, Todo } from "@/components/TodoComponents/models";
import { HEADERS, URL_TODOS, URL_USERS } from "@/config";
import axios from "axios";

import { useTodoStore } from "@/store/todos";
import { useUserStore } from "@/store/user";
import { computed, watch } from "vue";

export async function getTodoList(id: number): Promise<Todo[]> {
  let list: Todo[] = [];
  const url = URL_USERS + id + "/todos";
  try {
    const response = await axios.get(url, { headers: HEADERS });
    list = await response.data;
  } catch (error) {
    console.log(error);
  }
  return list;
}

export async function createEvent(text: string, id: number): Promise<Todo> {
  const url = URL_USERS + id + "/todos";
  let newData = {} as Todo;
  const data = {
    user_id: id,
    title: text,
    status: "pending",
    due_on: new Date(),
  };
  try {
    const response = await axios.post(url, data, { headers: HEADERS });
    if (response.status === 201 || response.status === 200) {
      newData = await response.data;
    }
  } catch (error: any) {
    console.log(error);
  }
  return newData;
}

export async function updateEvent(id: number, res: CreateTodo): Promise<Todo> {
  const url = URL_TODOS + id;
  let newData = {} as Todo;
  const data = {
    status: res.status,
    title: res.title,
  };
  try {
    const response = await axios.patch(url, data, { headers: HEADERS });
    newData = await response.data;
  } catch (error: any) {
    console.log(error);
  }
  return newData;
}

export async function deleteEvent(id: number): Promise<number> {
  const url = URL_TODOS + id;
  let status = 0;
  try {
    const response = await axios.delete(url, { headers: HEADERS });
    status = response.status;
  } catch (error: any) {
    console.log(error);
  }
  return status;
}

export const fetchTodos = async (page: number, id: number) => {
  const userStore = useUserStore();
  const todoStore = useTodoStore();
  const limit = 5;
  const userAuth = computed(() => userStore.getAuth);

  watch(
    userAuth,
    async (isAuth) => {
      if (isAuth) {
        try {
          const url = URL_USERS + id + "/todos";
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
          todoStore.setTotalTodos(totalPosts);
          todoStore.getPages;
          todoStore.setTodoList(response.data);
          if (totalPages > 0) {
            todoStore.setTotalPages(totalPages);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }
    },
    { immediate: true }
  );
};
