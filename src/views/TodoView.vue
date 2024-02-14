<template>
  <TodoHome />
</template>

<script lang="ts">
import TodoHome from "@/components/TodoComponents/TodoHome.vue";
import { defineComponent, provide } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  components: { TodoHome },
  setup() {
    const route = useRoute();
    const userIdParam = route.params.userId;
    const userIdAsNumber = Array.isArray(userIdParam)
      ? userIdParam[0]
      : userIdParam;
    const userId = parseInt(userIdAsNumber);
    provide("userId", userId);
    return {};
  },
});
</script>

<style scoped></style>
