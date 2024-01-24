<template>
  <TodoHome />
</template>

<script lang="ts">
import TodoHome from "@/components/TodoComponents/TodoHome.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { TodoHome },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
