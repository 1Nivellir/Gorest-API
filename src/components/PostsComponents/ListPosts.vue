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
import { fetchPost } from "@/helpers/PostService";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { computed, inject, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import CreatePost from "./CreatePost.vue";
import OnePost from "./OnePost.vue";

export default {
  components: { OnePost, CreatePost },

  setup() {
    const route = useRoute();
    const appStore = useAppStore();
    const limit = 5;
    const userStore = useUserStore();
    const totalPage = computed(() => appStore.getPages());
    const page = computed(() => appStore.getPagePosts);
    const injectedUserId = inject("userId");
    let userId = Number(injectedUserId);

    watch(
      () => route.params.userId,
      async (newVal, oldVal) => {
        const postIdAsNumber = Array.isArray(newVal) ? newVal[0] : newVal;
        const userIdNew = parseInt(postIdAsNumber, 10);
        appStore.setCurrentPage(1);
        userId = userIdNew;
        await fetchPost(1, userIdNew);
      }
    );

    const changePost = async (count: number) => {
      appStore.setCurrentPage(count);
      await fetchPost(count, userId);
    };
    onMounted(async () => {
      await fetchPost(1, userId);
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
