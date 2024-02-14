<template>
  <v-list lines="one" class="custom__list-todo">
    <TransitionGroup tag="ul" name="list">
      <TodoListItem :item="item" v-for="item in todoList" :key="item.id" />
    </TransitionGroup>
    <v-pagination
      :model-value="page"
      color="white"
      class="my-4 custom__pagination"
      :length="totalPage"
      rounded="circle"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      @update:modelValue="changeEvents"
    ></v-pagination>
  </v-list>
</template>

<script lang="ts">
import { fetchTodos } from "@/helpers/TodoService";
import { useTodoStore } from "@/store/todos";
import { computed, defineComponent, inject, watch } from "vue";
import { useRoute } from "vue-router";
import TodoListItem from "./TodoListItem.vue";

export default defineComponent({
  components: { TodoListItem },

  setup(props) {
    const route = useRoute();
    const injectedUserId = inject("userId");
    let userId = Number(injectedUserId);
    const todoStore = useTodoStore();
    const totalPage = computed(() => todoStore.getPages);
    const page = computed(() => todoStore.getCurrentPage);
    const todoList = computed(() => todoStore.getTodoList);
    watch(
      () => route.params.userId,
      (newVal, olVal) => {
        const postIdAsNumber = Array.isArray(newVal) ? newVal[0] : newVal;
        const userIdNew = parseInt(postIdAsNumber, 10);
        userId = userIdNew;
      }
    );
    const changeEvents = async (count: number) => {
      todoStore.setCurrentPage(count);
      await fetchTodos(count, userId);
    };
    return { totalPage, page, changeEvents, todoList };
  },
});
</script>

<style scoped>
.v-list {
  padding: 0;
  overflow: visible;
}
.custom__list-todo {
  background-color: #011627;
}
</style>
