<template>
  <v-card v-if="!overlay" class="custom__card-detail-post">
    <v-card-title class="custom__card-title"
      >Пост пользователя: {{ userName }}</v-card-title
    >
    <v-card-subtitle class="custom__card-subtitle"
      >Электронный адрес: {{ userEmail }}</v-card-subtitle
    >
    <v-card-title class="custom__card-title"
      >Заголовок: {{ postTitle }}</v-card-title
    >
    <v-card-text class="custom__card-title"
      >Содержание: {{ postBody }}</v-card-text
    >
  </v-card>
  <v-form @submit.prevent="addComment(postId)" v-if="!overlay">
    <v-text-field
      clearable
      label="Введите комментарий"
      v-model="textComment"
      class="custom__input-comments"
      :loading="loading"
    >
      <!-- <v-btn class="custom__input-btn-add">
            <v-icon size="x-large">mdi-share-circle</v-icon>
          </v-btn> -->
    </v-text-field>
    <v-card-actions>
      <v-btn variant="tonal" class="align-center" type="submit" block
        >Оставить комментарий</v-btn
      >
    </v-card-actions>
  </v-form>
  <transition-group tag="ul" name="list">
    <v-list-item
      v-for="(item, index) in commentsList"
      :key="index"
      class="custom__item-comments"
    >
      <v-row>
        <v-col cols="10">
          <v-card-title class="custom__card-title"
            >Комментарий пользователя: {{ item.name }}</v-card-title
          >
          <v-card-subtitle class="custom__card-email"
            >Электронный адрес пользователя: {{ item.email }}</v-card-subtitle
          >
          <v-card-title class="custom__card-title"
            >Комментарий: {{ item.body }}</v-card-title
          >
        </v-col>
        <v-col cols="2" class="custom__cols-btns">
          <div class="custom__wrapper-btn-comments">
            <div class="text-center">
              <v-btn @click.prevent="openModalUpdate(item.id)">
                <v-icon size="x-large" icon="mdiPencil">mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top"
                  >Редактировать комментарий</v-tooltip
                >

                <v-dialog
                  v-model="updateDialog"
                  activator="parent"
                  width="1000"
                >
                  <v-card class="custom__card-update">
                    <v-form @submit.prevent="updateComment(item.id)">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            clearable
                            label="Введите текст"
                            v-model="textBody"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-card-actions>
                        <v-btn
                          variant="tonal"
                          color="primary"
                          block
                          type="submit"
                          text="Отправить"
                        >
                          <template v-if="!goToserver"> Отправить </template>

                          <template v-else>
                            <v-progress-circular
                              :width="2"
                              color="primary"
                              indeterminate
                            ></v-progress-circular>
                          </template>
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                    <v-card-actions>
                      <v-btn
                        color="primary"
                        variant="tonal"
                        block
                        @click="updateDialog = false"
                        >Закрыть окно</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </div>
            <v-btn @click.prevent="deleteComment(item.id)">
              <v-icon size="x-large" color="red-darken-2" icon="mdiDelete"
                >mdi-delete</v-icon
              >
              <v-tooltip activator="parent" location="top"
                >Удалить комментарий</v-tooltip
              >
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-list-item>
  </transition-group>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { getPostDetails } from "@/helpers/CommentsService";
import { useAppStore } from "@/store/app";
import { useCommentsStore } from "@/store/comments";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const appStore = useAppStore();
    const commentStore = useCommentsStore();
    const route = useRoute();
    const postIdParam = route.params.postId;
    const postIdAsNumber = Array.isArray(postIdParam)
      ? postIdParam[0]
      : postIdParam;
    const postId = parseInt(postIdAsNumber, 10);

    const textComment = ref("");
    const textBody = ref("");
    const updateDialog = ref(false);
    const overlay = ref(false);
    const userName = ref("");
    const userEmail = ref("");
    const showData = ref(false);
    const postTitle = ref("");
    const postBody = ref("");
    const commentsList = computed(() => commentStore.getListComments);
    const loading = ref(false);
    const goToserver = ref(false);

    const fetchData = async () => {
      overlay.value = true;
      try {
        const commentsDetails = await getPostDetails(postId);
        userName.value = commentsDetails.userName;
        userEmail.value = commentsDetails.userEmail;
        showData.value = commentsDetails.showData;
        postTitle.value = commentsDetails.postTitle;
        postBody.value = commentsDetails.postBody;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        overlay.value = false;
      }
    };
    onMounted(() => {
      fetchData();
    });

    const addComment = async (id: number) => {
      try {
        loading.value = true;
        await commentStore.addComment(id, textComment.value);
        textComment.value = "";
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
      } finally {
        loading.value = false;
      }
    };

    const openModalUpdate = async (id: number) => {
      const comment = commentsList.value.find((item) => item.id === id);
      if (comment) {
        textBody.value = comment.body;
      }
    };
    const deleteComment = (id: number) => {
      commentStore.removeComment(id);
    };
    const updateComment = async (id: number) => {
      try {
        goToserver.value = true;
        commentStore.updateComment(id, textBody.value);
        updateDialog.value = false;
      } catch (error) {
        console.log("Error:", error);
      } finally {
        goToserver.value = false;
      }
    };

    return {
      postId,
      commentsList,
      userName,
      userEmail,
      showData,
      postTitle,
      postBody,
      appStore,
      textComment,
      addComment,
      deleteComment,
      textBody,
      openModalUpdate,
      updateDialog,
      updateComment,
      overlay,
      loading,
      goToserver,
    };
  },
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      idPost: 0,
    };
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.custom__wrapper-btn-comments {
  display: flex;
  gap: 15px;
  align-items: center;
}
.custom__item-comments {
  padding: 20px 0;
  border-bottom: 1px solid grey;
}
.custom__cols-btns {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.custom__input-comments {
  position: relative;
}
.custom__card-update {
  padding: 20px;
}
.custom__card-detail-post {
  background-color: rgb(25 25 74);
  margin-bottom: 25px;
}
.custom__card-title {
  color: white;
}
.custom__card-subtitle {
  padding: 10px 15px;
  color: white;
  border-bottom: 1px solid grey;
}
</style>
