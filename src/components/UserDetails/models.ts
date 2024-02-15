export type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

export type CreateUser = Omit<User, "id">;
export type Response = {
  data: User;
};
