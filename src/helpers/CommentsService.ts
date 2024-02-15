import { PostDetails, Comments } from "@/components/PostsComponents/models";
import { HEADERS, URL_COMMENTS, URL_POSTS } from "@/config";
import { getUser } from "@/helpers/UserService";
import { useCommentsStore } from "@/store/comments";
import { useUserStore } from "@/store/user";
import axios from "axios";

const userStore = useUserStore();
const commentStore = useCommentsStore();

export async function getPostDetails(id: number): Promise<PostDetails> {
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

export async function addCommentToServer(
  id: number,
  textComment: string
): Promise<Comments> {
  const data = {
    post_id: id,
    name: userStore.userData.name,
    email: userStore.userData.email,
    body: textComment,
  };
  let newData = {} as Comments;
  try {
    const response = await axios.post(URL_POSTS + id + "/comments", data, {
      headers: HEADERS,
    });
    if (response.status === 201 || response.status === 200) {
      newData = await response.data;
    }
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
  }
  return newData;
}
export const updateComment = async (
  id: number,
  text: string
): Promise<Comments> => {
  const data = {
    body: text,
  };
  let newData = {} as Comments;
  try {
    const response = await axios.put(URL_COMMENTS + id, data, {
      headers: HEADERS,
    });
    if (response.status === 200 || response.status === 201) {
      newData = await response.data;
    }
  } catch (error) {
    console.log("Error:", error);
  }
  return newData;
};

export async function deleteComment(id: number): Promise<number> {
  let status = 0;
  try {
    const response = await axios.delete(URL_COMMENTS + id, {
      headers: HEADERS,
    });
    status = response.status;
  } catch (error) {
    console.log("Ошибка при удалении комментария:", error);
  }
  return status;
}
