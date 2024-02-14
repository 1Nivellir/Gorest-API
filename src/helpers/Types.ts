export type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

export type Response = {
  data: User;
};

export type OnePost = {
  body: string;
  id?: number;
  title: string;
  user_id?: number;
};

export type Comments = {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
};
