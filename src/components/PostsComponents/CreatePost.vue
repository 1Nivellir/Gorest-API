<template>
  <v-form @submit.prevent="addPost" class="custom__form-create">
    <v-text-field
      clearable
      label="Заголовок поста"
      v-model="inputTitle"
      class="custom__input-form-post"
    ></v-text-field>
    <v-text-field
      clearable
      :loading="loading"
      label="Введите текст"
      v-model="inputBody"
      class="custom__input-form-post"
    ></v-text-field>
    <v-card-actions>
      <v-btn type="submit" color="white" block variant="tonal"
        >Отправить пост</v-btn
      >
    </v-card-actions>
  </v-form>
</template>

<script lang="ts">
import { fetchPost } from "@/helpers/PostService";
import { useAppStore } from "@/store/app";
import { usePostsStore } from "@/store/posts";
import { useUserStore } from "@/store/user";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const postsStore = usePostsStore();

    const inputBody = ref("");
    const inputTitle = ref("");
    const loading = ref(false);

    const addPost = async () => {
      loading.value = true;
      const id = userStore.userData.id;
      const data = {
        title: inputTitle.value,
        body: inputBody.value,
      };
      try {
        await postsStore.addPost(id, data);
        appStore.setTotalPosts(appStore.postTotal + 1);
        if (appStore.postTotal > 0) {
          const postsPerPage = 5;
          const totalPages = appStore.postTotal / postsPerPage;
          if (appStore.postPages < totalPages) {
            appStore.setCurrentPage(appStore.getPagePosts + 1);
            await fetchPost(appStore.getPagePosts, id);
          }
        }
        inputTitle.value = "";
        inputBody.value = "";
        postsStore.showMessage();
      } catch (error: any) {
        console.error("Error:", error);
      } finally {
        loading.value = false;
      }
    };
    return {
      addPost,
      inputTitle,
      inputBody,
      loading,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom__form-create {
  border-radius: 3px;
  background: rgb(25 25 74);
}
.custom__input-form-post {
  color: white;
}
.custom__card-add-post {
  background: greenyellow;
}
</style>
@/helpers/PostService
