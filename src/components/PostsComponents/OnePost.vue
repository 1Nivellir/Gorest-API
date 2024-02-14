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
        <v-list-item-title class="custom__item-title"
          >Заголовок: {{ item.title }}</v-list-item-title
        >
        <v-list-item-subtitle class="custom__item-body"
          >Содержание: {{ item.body }}</v-list-item-subtitle
        >
      </div>
      <actions-btn :item="item" />
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
import { usePostsStore } from "@/store/posts";

import { Ref, onMounted, reactive, ref, watch } from "vue";
import ActionsBtn from "../ui/ActionsBtn.vue";
export default {
  components: { ActionsBtn },
  setup() {
    const postsStore = usePostsStore();
    const posts: Ref<OnePost[]> = ref([]);
    const loading = ref(false);
    const updateDialog = ref(false);
    const textBody = ref("");
    const textTitle = ref("");
    const open = reactive(["Users"]);
    const showDeleteText = ref(false);
    const overlay = ref(false);

    onMounted(() => {
      overlay.value = true;
      try {
        posts.value = postsStore.getListPost();
      } catch (error) {
        console.log("Error:", error);
      } finally {
        overlay.value = false;
      }
    });
    watch(
      () => postsStore.getListPost(),
      (newPosts, oldPosts) => {
        posts.value = newPosts;
      }
    );

    return {
      open,
      loading,
      updateDialog,
      textBody,
      textTitle,
      showDeleteText,
      posts,
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

.custom__modal-update {
  padding: 20px;
}
.custom__item-body {
  padding: 15px;
  padding-top: 0;
  color: white;
  font-size: 16px;
  font-weight: 500;
  max-width: 80%;
}

.custom__item-title {
  padding: 15px;
  color: white;
  font-size: 24px;
  font-weight: 500;
}
</style>
