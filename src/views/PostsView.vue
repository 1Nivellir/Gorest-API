<template>
  <ListPosts />
</template>

<script lang="ts">
import ListPosts from "@/components/ListPosts.vue";
import { provide } from "vue";
import { useRoute } from "vue-router";
export default {
  components: { ListPosts },
  setup() {
    const route = useRoute();
    const postIdParam = route.params.userId;
    const postIdAsNumber = Array.isArray(postIdParam)
      ? postIdParam[0]
      : postIdParam;
    const userId = parseInt(postIdAsNumber, 10);
    provide("userId", userId);

    return {};
  },
};
</script>

<style lang="scss" scoped></style>
