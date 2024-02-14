<template>
  <TodoDetails />
</template>

<script lang="ts">
import TodoDetails from "@/components/TodoComponents/TodoDetails.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { TodoDetails },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
