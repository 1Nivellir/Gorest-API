import { HEADERS, URL_COMMENTS, URL_POSTS } from "@/config";
import { Comments } from "@/helpers/Types";
import { getUser } from "@/helpers/UserService";
import { useCommentsStore } from "@/store/comments";
import { useUserStore } from "@/store/user";
import axios from "axios";

const userStore = useUserStore();
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
    const [commentsResponse, postResponse] = await Promise.all([
      axios.get(URL_POSTS + id + "/comments", {
        headers: HEADERS,
      }),
      axios.get(URL_POSTS + id, {
        headers: HEADERS,
      }),
    ]);
    commentStore.setComments(commentsResponse.data);
    commentsDetails.commentsList = commentsResponse.data;

    const userId = postResponse.data.user_id;
    commentsDetails.postTitle = postResponse.data.title;
    commentsDetails.postBody = postResponse.data.body;

    const userResponse = await getUser(userId);
    commentsDetails.userName = userResponse.name;
    commentsDetails.userEmail = userResponse.email;
  } catch (error) {
    console.error("Error", error);
  } finally {
    commentsDetails.showData = true;
  }

  return commentsDetails;
}

export const addComment = async (id: number, textComment: string) => {
  const data = {
    post_id: id,
    name: userStore.userData.name,
    email: userStore.userData.email,
    body: textComment,
  };
  try {
    const response = await axios.post(URL_POSTS + id + "/comments", data, {
      headers: HEADERS,
    });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
  }
};
export const updateComment = async (id: number, text: string) => {
  const data = {
    body: text,
  };
  try {
    const response = await axios.put(URL_COMMENTS + id, data, {
      headers: HEADERS,
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

export async function deleteComment(id: number) {
  try {
    const response = await axios.delete(URL_COMMENTS + id, {
      headers: HEADERS,
    });
    return response.status;
  } catch (error) {
    console.log("Ошибка при удалении комментария:", error);
  }
}
