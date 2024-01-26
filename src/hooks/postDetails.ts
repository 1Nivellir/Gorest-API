import { HEADERS, URL_COMMENTS, URL_POSTS } from "@/config";
import { Comments } from "@/helpers/Types";
import { getUser } from "@/helpers/UserServise";
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
    const postResponse = await axios.get(URL_POSTS + id, {
      headers: HEADERS,
    });
    const userId = postResponse.data.user_id;
    commentsDetails.postTitle = postResponse.data.title;
    commentsDetails.postBody = postResponse.data.body;

    const userResponse = await getUser(userId);
    commentsDetails.userName = userResponse.name;
    commentsDetails.userEmail = userResponse.email;

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

export async function deleteComment(id: number) {
  try {
    const response = await axios.delete(URL_COMMENTS + id, {
      headers: HEADERS,
    });
    if (response.status === 204) {
      commentStore.removeComment(id);
    }
  } catch (error) {
    console.log("Ошибка при удалении комментария:", error);
  }
}
