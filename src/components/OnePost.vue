<template>
  <transition-group tag="ul" name="list">
    <v-list-item
      class="custom__list-item"
      min-height="120"
      v-for="item in posts"
      :key="item.id"
      :loading="loading"
    >
      <div>
        <div class="custom__item-title">Заголовок: {{ item.title }}</div>
        <div class="custom__item-body">Содержание: {{ item.body }}</div>
      </div>
      <v-list-item-action>
        <div class="text-center custom__action-wrapper-btn">
          <transition
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
            :css="false"
          >
            <div class="custom__wrapper-btn-post" v-if="showBtns === item.id">
              <v-btn @click.prevent="showActions(item.id)">
                <v-icon size="x-large">mdi-transfer-right</v-icon>
                <v-tooltip activator="parent" location="top"
                  >Свернуть меню</v-tooltip
                >
              </v-btn>
              <v-btn @click.prevent="openModalUpdate(item.id)" v-if="showBtn">
                <v-icon size="x-large" icon="mdiPencil">mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top"
                  >Редактировать пост</v-tooltip
                >
                <v-dialog
                  v-model="updateDialog"
                  activator="parent"
                  width="1000"
                >
                  <v-card class="custom__modal-update">
                    <v-form @submit.prevent="updatePost(item.id)">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            clearable
                            color="primary"
                            label="Введите текст"
                            v-model="textTitle"
                          ></v-text-field>
                          <v-text-field
                            clearable
                            color="primary"
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
                          >Отправить</v-btn
                        >
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

              <v-btn @click.prevent="goToPostDetails(item.id)">
                <v-icon size="x-large" :icon="`mdiSvg:${mdiDelete}`"
                  >mdi-arrow-right-bold</v-icon
                >
                <v-tooltip activator="parent" location="top"
                  >Перейти к посту</v-tooltip
                >
              </v-btn>
              <v-btn @click.prevent="deletePost(item.id)" v-if="showBtn">
                <v-icon size="x-large" color="red-darken-2" icon="mdiDelete"
                  >mdi-delete</v-icon
                >
                <v-tooltip activator="parent" location="top"
                  >Удалить пост</v-tooltip
                >
              </v-btn>
            </div>
          </transition>
        </div>
        <transition
          @before-enter="onBeforeEnter2"
          @enter="onEnter2"
          @leave="onLeave2"
          :css="false"
        >
          <v-btn
            @click.prevent="showActions(item.id)"
            v-if="showBtns !== item.id"
            class="custom__btn-open"
          >
            <v-icon size="x-large">mdi-transfer-left</v-icon>
            <v-tooltip activator="parent" location="top"
              >Открыть меню</v-tooltip
            >
          </v-btn>
        </transition>
      </v-list-item-action>
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
import { HEADERS, URL_POSTS } from "@/config";
import { fetchPost } from "@/helpers/PostService";
import { OnePost } from "@/helpers/Types";
import {
  onBeforeEnter,
  onBeforeEnter1,
  onBeforeEnter2,
  onEnter,
  onEnter1,
  onEnter2,
  onLeave,
  onLeave1,
  onLeave2,
} from "@/helpers/animation";
import { useAppStore } from "@/store/app";
import { usePostsStore } from "@/store/posts";
import { useUserStore } from "@/store/user";
import {
  mdiArrowRightBold,
  mdiDelete,
  mdiPencil,
  mdiTransferLeft,
} from "@mdi/js";
import axios from "axios";
import { Ref, inject, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  data: () => ({
    mdiPencil,
    mdiArrowRightBold,
    mdiDelete,
    mdiTransferLeft,
  }),
  setup() {
    const route = useRoute();
    const appStore = useAppStore();
    const postsStore = usePostsStore();
    const userStore = useUserStore();
    const posts: Ref<OnePost[]> = ref([]);
    const $router = useRouter();
    const loading = ref(false);
    const updateDialog = ref(false);
    const textBody = ref("");
    const textTitle = ref("");
    const open = reactive(["Users"]);
    const showDeleteText = ref(false);
    const showBtns = ref(null);
    const overlay = ref(false);
    const showBtn = ref(false);

    const injectedUserId = inject("userId");
    const userId = Number(injectedUserId);

    const examinationId = (userId: number) => {
      const userIdStore = userStore.userData.id;
      if (userIdStore !== userId) {
        showBtn.value = false;
      } else {
        showBtn.value = true;
      }
    };

    onMounted(() => {
      overlay.value = true;
      try {
        posts.value = postsStore.getListPost();
      } catch (error) {
        console.log("Error:", error);
      } finally {
        overlay.value = false;
      }
      examinationId(userId);
    });
    watch(
      () => postsStore.getListPost(),
      (newPosts, oldPosts) => {
        posts.value = newPosts;
      }
    );
    watch(
      () => route.params.userId,
      (newVal, oldVal) => {
        const userIdNumber = Array.isArray(newVal) ? newVal[0] : newVal;
        const userId = parseInt(userIdNumber, 10);
        examinationId(userId);
      }
    );

    const openModalUpdate = (id: number) => {
      if (posts.value) {
        const post = posts.value.find((item) => item.id === id);
        if (post) {
          textBody.value = post.body;
          textTitle.value = post.title;
        }
      }
    };

    const showActions = (postId: any) => {
      showBtns.value = showBtns.value === postId ? null : postId;
    };
    const deletePost = async (id: number) => {
      const url = URL_POSTS + id;
      alert("Delete post?");
      try {
        postsStore.removePost(id);
        const response = await axios.delete(url, { headers: HEADERS });
        appStore.setTotalPosts(appStore.postTotal - 1);
        // if (appStore.paginationTotal > 0) {
        const postsPerPage = 5;
        const totalPages = appStore.postTotal / postsPerPage;
        if (appStore.postPages - 1 === totalPages) {
          appStore.setCurrentPage(appStore.getPagePosts - 1);
          await fetchPost(appStore.getPagePosts, userId);
        } else {
          postsStore.removePost(id);
        }

        if (response.status === 204) {
          showDeleteText.value = true;
          setTimeout(() => {
            showDeleteText.value = false;
          }, 2000);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    const updatePost = async (id: number) => {
      const url = URL_POSTS + id;
      const data = {
        title: textTitle.value,
        body: textBody.value,
      };
      alert("Update Post?");
      try {
        const response = await axios.put(url, data, { headers: HEADERS });
        postsStore.updatePost(response.data);
        updateDialog.value = false;
      } catch (error) {
        console.log("Error:", error);
      }
    };
    const goToPostDetails = (id: number) => {
      const postId = id;
      $router.push({ name: "post-details", params: { postId } });
    };
    return {
      open,
      loading,
      updateDialog,
      textBody,
      textTitle,
      openModalUpdate,
      deletePost,
      updatePost,
      goToPostDetails,
      showDeleteText,
      posts,
      showBtns,
      showActions,
      onBeforeEnter1,
      onEnter1,
      onLeave1,
      onBeforeEnter,
      onEnter,
      onLeave,
      onBeforeEnter2,
      onEnter2,
      onLeave2,
      overlay,
      showBtn,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom__wrapper-posts {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
}

.custom__list-item {
  padding: 20px 0;
  border-bottom: 1px solid grey;
  word-wrap: break-word;
}

.custom__wrapper-btn-post {
  display: flex;
  align-items: center;
  gap: 15px;
}

.custom__item-title {
  padding: 15px;
  color: white;
  font-size: 24px;
  font-weight: 500;
}

.custom__item-body {
  padding: 15px;
  padding-top: 0;
  color: white;
  font-size: 16px;
  font-weight: 500;
  max-width: 80%;
}

.custom__btn-open {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.custom__action-wrapper-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.custom__modal-update {
  padding: 20px;
}
</style>
@/helpers/Types @/helpers/PostService
