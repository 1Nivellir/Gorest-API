import { CreateTodo, Todo } from "@/components/TodoComponents/models";
import { HEADERS, URL_TODOS, URL_USERS } from "@/config";
import { useTodoStore } from "@/store/todos";
import axios from "axios";

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

export async function fetchTodos(
  id: number,
  page: number,
  status: string = ""
): Promise<Todo[]> {
  const limit = 5;
  const todoStore = useTodoStore();
  let url = URL_USERS + id + "/todos";
  if (status !== "") {
    url = URL_USERS + id + `/todos?status=${status}`;
  }
  let data = [] as Todo[];
  try {
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
    data = await response.data;
    console.log(data);
    if (totalPages > 0) {
      todoStore.setTotalPages(totalPages);
    }
  } catch (error) {
    console.log(error);
  }
  return Promise.resolve(data);
}
