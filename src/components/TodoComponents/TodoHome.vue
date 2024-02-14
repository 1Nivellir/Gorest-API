<template>
  <v-container>
    <CreateTodo />
    <div class="custom__list-item">
      <TodoList />
    </div>
  </v-container>
</template>

<script lang="ts">
import { fetchTodos, getTodoList } from "@/helpers/TodoService";
import { useTodoStore } from "@/store/todos";
import { computed, defineComponent, inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CreateTodo from "./CreateTodo.vue";
import TodoList from "./TodoList.vue";

export default defineComponent({
  components: { TodoList, CreateTodo },
  setup() {
    const route = useRoute();
    const dialog = ref(false);
    const loading = ref(false);
    const ready = ref(false);
    const todoList = computed(() => todoStore.getTodoList);
    const todoStore = useTodoStore();

    let userId = inject("userId");
    onMounted(async () => {
      if (typeof userId === "number") {
        await fetchTodos(1, userId);
      }
    });
    watch(
      () => route.params.userId,
      async (newVal, oldVal) => {
        const postIdAsNumber = Array.isArray(newVal) ? newVal[0] : newVal;
        const userIdNew = parseInt(postIdAsNumber, 10);
        todoStore.clearTodos();
        todoStore.setCurrentPage(1);
        await fetchTodos(1, userIdNew);
      }
    );

    return {
      dialog,
      loading,
      ready,
      getTodoList,
      todoList,
    };
  },
});
</script>

<style scoped>
.custom__list-item {
  padding: 20px 0;
  border-bottom: 1px solid grey;
  word-wrap: break-word;
}
</style>
