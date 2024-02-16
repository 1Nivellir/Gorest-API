<template>
  <v-container>
    <CreateTodo v-if="userStore.isAuth && showInputAddEvent" />

    <div class="custom__list-item">
      <TodoList />
    </div>
  </v-container>
</template>

<script lang="ts">
import { useTodoStore } from "@/store/todos";
import { useUserStore } from "@/store/user";
import { defineComponent, inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CreateTodo from "./CreateTodo.vue";
import TodoList from "./TodoList.vue";
import { getNumberInRouter } from "./helpers";
export default defineComponent({
  components: { TodoList, CreateTodo },
  setup() {
    const userStore = useUserStore();
    const route = useRoute();
    const dialog = ref(false);
    const loading = ref(false);
    const ready = ref(false);
    const todoStore = useTodoStore();
    const isAuth = userStore.getAuth;
    let injectedUserId = inject("userId");
    const userId = Number(injectedUserId);
    const showInputAddEvent = ref(false);

    watch(
      () => userStore.getAuth,
      async (newVal) => {
        if (newVal) {
          await todoStore.setTodoList(userId, 1, "");
        }
      }
    );
    onMounted(async () => {
      if (isAuth) {
        if (typeof userId === "number") {
          await todoStore.setTodoList(userId, 1, "");
        }
      }
      if (getNumberInRouter(route.params.userId) === userStore.userData.id) {
        showInputAddEvent.value = true;
      } else {
        showInputAddEvent.value = false;
      }
    });
    watch(
      () => route.params.userId,
      async (newVal) => {
        const userIdNew = getNumberInRouter(newVal);
        todoStore.clearTodos();
        todoStore.setCurrentPage(1);
        await todoStore.setTodoList(userIdNew, 1, "");
        showInputAddEvent.value =
          userIdNew === userStore.userData.id ? true : false;
      }
    );

    return {
      dialog,
      loading,
      ready,
      userStore,
      showInputAddEvent,
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
