import { HEADERS, URL_COMMENTS, URL_POSTS, URL_USERS } from "@/config";
import { Comments } from "@/helpers/ReponseArray";
import { useCommentsStore } from "@/store/comments";
import axios from "axios";

const commentStore = useCommentsStore();

export type PostDetails = {
  postTitle: string;
  postBody: string;
  userName: string;
  userEmail: string;
  commentsList: Comments[];
  showData: boolean;
};

export async function getPostDetails(id: number) {
  const commentsDetails: PostDetails = {
    showData: false,
    commentsList: [],
    userName: "",
    userEmail: "",
    postTitle: "",
    postBody: "",
  };

  try {
    console.log("Сработал хук");

    const postResponse = await axios.get(URL_POSTS + id, {
      headers: HEADERS,
    });
    const userId = postResponse.data.user_id;
    commentsDetails.postTitle = postResponse.data.title;
    commentsDetails.postBody = postResponse.data.body;
    const userResponse = await axios.get(URL_USERS + userId, {
      headers: HEADERS,
    });
    commentsDetails.userName = userResponse.data.name;
    commentsDetails.userEmail = userResponse.data.email;
    const commentsResponse = await axios.get(URL_POSTS + id + "/comments", {
      headers: HEADERS,
    });
    commentStore.setComments(commentsResponse.data);
    commentsDetails.commentsList = commentsResponse.data;
  } catch (error) {
    console.error("Error", error);
  } finally {
    commentsDetails.showData = true;
  }

  return commentsDetails;
}

export function deleteComment(id: number) {
  try {
    const response = axios.delete(URL_COMMENTS + id, {
      headers: HEADERS,
    });
    commentStore.removeComment(id);
  } catch (error) {
    console.log("Ошибка при удалении комментария:", error);
  }
}
