<template>
  <v-container>
    <v-list lines="one" class="custom__list-posts">
      <CreatePost v-if="userStore.isAuth" />

      <OnePost />
      <v-pagination
        :model-value="page"
        color="white"
        class="my-4 custom__pagination"
        :length="totalPage"
        rounded="circle"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @update:modelValue="changePost"
      ></v-pagination>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { useAppStore } from "@/store/app";
import { usePostsStore } from "@/store/posts";
import { useUserStore } from "@/store/user";
import { computed, inject, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import CreatePost from "./CreatePost.vue";
import OnePost from "./OnePost.vue";

export default {
  components: { OnePost, CreatePost },

  setup() {
    const postStore = usePostsStore();
    const route = useRoute();
    const appStore = useAppStore();
    const limit = 5;
    const userStore = useUserStore();
    const totalPage = computed(() => postStore.getPages);
    const page = computed(() => postStore.getPagePosts);
    const injectedUserId = inject("userId");
    let userId = Number(injectedUserId);
    const isAuth = userStore.getAuth;
    watch(
      () => route.params.userId,
      async (newVal) => {
        const postIdAsNumber = Array.isArray(newVal) ? newVal[0] : newVal;
        const userIdNew = parseInt(postIdAsNumber, 10);
        postStore.setCurrentPage(1);
        postStore.clearPosts();
        userId = userIdNew;
        await postStore.setPosts(1, userIdNew);
      }
    );

    watch(
      () => userStore.getAuth,
      async (newVal) => {
        if (newVal) {
          await postStore.setPosts(1, userId);
        }
      }
    );
    const changePost = async (count: number) => {
      postStore.setCurrentPage(count);
      await postStore.setPosts(count, userId);
    };
    onMounted(async () => {
      if (isAuth) {
        await postStore.setPosts(1, userId);
      }
    });
    return {
      totalPage,
      page,
      limit,
      appStore,
      changePost,
      userStore,
    };
  },
};
</script>

<style lang="scss" scoped>
.v-list {
  padding: 0;
  overflow: visible;
}
.custom__list-posts {
  background-color: #011627;
}
</style>
@/helpers/PostService
