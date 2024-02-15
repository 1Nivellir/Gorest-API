export type Todo = {
  id: number;
  user_id: number;
  title: string;
  status: string;
  due_on: string;
};

export type CreateTodo = Omit<Todo, "id" | "user_id" | "due_on">;
