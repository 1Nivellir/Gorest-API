<template>
  <v-list lines="one">
    <TodoListItem />
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TodoListItem from "./TodoListItem.vue";

export default defineComponent({
  components: { TodoListItem },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
