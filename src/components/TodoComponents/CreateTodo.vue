<template>
  <v-form validate-on="submit lazy" @submit.prevent="addEvent">
    <v-text-field
      :loading="loading"
      v-model="inputEvent"
      label="Добавьте дело"
    ></v-text-field>

    <v-btn
      :loading="loading"
      type="submit"
      block
      color="primary"
      class="mt-2"
      text="Добавить"
    ></v-btn>
  </v-form>
</template>

<script lang="ts">
import { useTodoStore } from "@/store/todos";
import { useUserStore } from "@/store/user";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const inputEvent = ref("");
    const userStore = useUserStore();
    const todoStore = useTodoStore();
    const loading = ref(false);
    const statusFilter = computed(() => todoStore.getFilter);
    const addEvent = async () => {
      loading.value = true;
      const id = userStore.userData.id;
      try {
        await todoStore.setItem(inputEvent.value, id);
        todoStore.setTotalTodos(todoStore.total + 1);
        inputEvent.value = "";
        if (todoStore.total > 0) {
          const postsPerPage = 5;
          const totalPages = todoStore.total / postsPerPage;
          if (todoStore.pages < totalPages) {
            if (statusFilter.value === "pending" || statusFilter.value === "") {
              todoStore.setCurrentPage(todoStore.getCurrentPage + 1);
              await todoStore.setTodoList(
                id,
                todoStore.getCurrentPage,
                statusFilter.value
              );
            }
          }
        }
      } catch (error: any) {
        console.error("Error:", error);
      } finally {
        loading.value = false;
      }
    };
    return { inputEvent, loading, addEvent };
  },
});
</script>

<style scoped></style>
