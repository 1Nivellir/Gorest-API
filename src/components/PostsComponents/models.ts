export type OnePost = {
  body: string;
  id: number;
  title: string;
  user_id: number;
};

export type UpdatePost = Omit<OnePost, "id" | "user_id">;

export type Comments = {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
};

export type PostDetails = {
  postTitle: string;
  postBody: string;
  userName: string;
  userEmail: string;
  commentsList: Comments[];
  showData: boolean;
};
