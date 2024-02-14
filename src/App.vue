<template>
  <router-view />
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { usePostsStore } from "./store/posts";
import { useTodoStore } from "./store/todos";
const route = useRoute();
const postStore = usePostsStore();
const todoStore = useTodoStore();

watch(
  () => route.path,
  (newVal, oldVal) => {
    if (oldVal.includes("/posts/")) {
      postStore.clearPosts();
    }
  }
);
watch(
  () => route.path,
  (newVal, oldVal) => {
    if (oldVal.includes("/todos/")) {
      todoStore.clearTodos();
    }
  }
);
</script>
