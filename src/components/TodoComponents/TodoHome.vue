<template>
  <v-form validate-on="submit lazy" @submit.prevent="addEventOnServer">
    <v-text-field v-model="inputEvent" label="User name"></v-text-field>

    <v-btn
      :loading="loading"
      type="submit"
      block
      color="primary"
      class="mt-2"
      text="Submit"
    ></v-btn>
  </v-form>
  <div>
    <v-switch
      v-model="ready"
      label="success"
      color="success"
      value="success"
      hide-details
    ></v-switch>
  </div>
  <TodoList />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TodoList from "./TodoList.vue";

export default defineComponent({
  components: { TodoList },
  setup() {
    const dialog = ref(false);
    const inputEvent = ref("");
    const loading = ref(false);
    const ready = ref(false);

    const addEventOnServer = async () => {
      loading.value = true;
    };
    return {
      dialog,
      inputEvent,
      loading,
      addEventOnServer,
      ready,
    };
  },
});
</script>

<style scoped></style>
