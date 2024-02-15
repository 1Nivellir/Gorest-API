<template>
  <v-container>
    <CreateTodo v-if="userStore.isAuth" />
    <div class="custom__list-item">
      <TodoList />
    </div>
  </v-container>
</template>

<script lang="ts">
import { useTodoStore } from "@/store/todos";
import { useUserStore } from "@/store/user";
import { computed, defineComponent, inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CreateTodo from "./CreateTodo.vue";
import TodoList from "./TodoList.vue";
export default defineComponent({
  components: { TodoList, CreateTodo },
  setup() {
    const userStore = useUserStore();
    const route = useRoute();
    const dialog = ref(false);
    const loading = ref(false);
    const ready = ref(false);
    const todoList = computed(() => todoStore.getTodoList);
    const todoStore = useTodoStore();
    const isAuth = userStore.getAuth;
    let injectedUserId = inject("userId");
    const userId = Number(injectedUserId);

    watch(
      () => userStore.getAuth,
      async (newVal) => {
        if (newVal) {
          await todoStore.setTodoList(1, userId);
        }
      }
    );
    onMounted(async () => {
      if (isAuth) {
        if (typeof userId === "number") {
          await todoStore.setTodoList(1, userId);
        }
      }
    });
    watch(
      () => route.params.userId,
      async (newVal) => {
        const postIdAsNumber = Array.isArray(newVal) ? newVal[0] : newVal;
        const userIdNew = parseInt(postIdAsNumber, 10);
        todoStore.clearTodos();
        todoStore.setCurrentPage(1);
        await todoStore.setTodoList(1, userIdNew);
      }
    );

    return {
      dialog,
      loading,
      ready,
      todoList,
      userStore,
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
