<template>
  <v-select
    v-model="select"
    :hint="`${select.state}, ${select.abbr}`"
    :items="items"
    item-title="state"
    item-value="abbr"
    label="Select"
    persistent-hint
    return-object
    single-line
  ></v-select>
  <v-list lines="one" class="custom__list-todo">
    <TransitionGroup tag="ul" name="list">
      <TodoListItem
        :item="item"
        v-for="item in filteredTodoList"
        :key="item.id"
      />
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
import { useTodoStore } from "@/store/todos";
import {
  computed,
  defineComponent,
  inject,
  provide,
  reactive,
  ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import TodoListItem from "./TodoListItem.vue";

export default defineComponent({
  components: { TodoListItem },

  setup() {
    const route = useRoute();
    const injectedUserId = inject("userId");
    let userId = Number(injectedUserId);
    const todoStore = useTodoStore();
    const totalPage = computed(() => todoStore.getPages);
    const page = computed(() => todoStore.getCurrentPage);
    const todoList = computed(() => todoStore.getTodoList);

    const select = ref({ state: "Все дела", abbr: "" });
    const items = reactive([
      { state: "Все дела", abbr: "" },
      { state: "Выполненных", abbr: "completed" },
      { state: "Невыполненных", abbr: "pending" },
    ]);
    const filteredTodoList = computed(() => {
      const selectedAbbr = select.value.abbr;

      if (selectedAbbr === "") {
        return todoList.value;
      } else {
        return todoList.value.filter((todo) =>
          selectedAbbr.includes(todo.status)
        );
      }
    });
    provide("status", select.value.abbr);
    watch(
      () => select.value,
      async () => {
        const newValue = select.value.abbr.toString();
        todoStore.setFilter(newValue);
        await todoStore.setTodoList(userId, 1, newValue);
      }
    );
    watch(
      () => route.params.userId,
      (newVal) => {
        const postIdAsNumber = Array.isArray(newVal) ? newVal[0] : newVal;
        const userIdNew = parseInt(postIdAsNumber, 10);
        userId = userIdNew;
      }
    );
    const changeEvents = async (count: number) => {
      todoStore.setCurrentPage(count);
      await todoStore.setTodoList(userId, count, select.value.abbr);
    };
    return { totalPage, page, changeEvents, filteredTodoList, select, items };
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
