<template>
  <v-dialog v-model="openModal" activator="parent" width="1000">
    <v-card class="custom__modal-update">
      <v-form @submit.prevent="updateItem(item.id)">
        <v-row>
          <v-col cols="12">
            <v-text-field
              clearable
              color="primary"
              label="Введите текст"
              v-model="textTitle"
            ></v-text-field>
            <v-text-field
              v-if="showInput"
              clearable
              color="primary"
              label="Введите текст"
              v-model="textBody"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn variant="tonal" color="primary" block type="submit"
            >Отправить</v-btn
          >
        </v-card-actions>
      </v-form>
      <v-card-actions>
        <v-btn color="primary" variant="tonal" block @click="openModal = false"
          >Закрыть окно</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { OnePost } from "@/helpers/Types";
import { usePostsStore } from "@/store/posts";
import { useTodoStore } from "@/store/todos";
import { mdiPencil } from "@mdi/js";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Todo } from "../TodoComponents/models";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const route = useRoute();
    const item = props.item;

    const textBody = ref("");
    const textTitle = ref("");
    const postsStore = usePostsStore();
    const showInput = ref(true);
    const openModal = ref(false);
    const todoStore = useTodoStore();
    onMounted(() => {
      textBody.value = item.body;
      textTitle.value = item.title;
      if (route.path.includes("todos")) {
        showInput.value = false;
      } else {
        showInput.value = true;
      }
    });
    const updateItem = async (id: number) => {
      if ("status" in props.item) {
        const itemTodo = props.item as Todo;
        if (route.path.includes("todos")) {
          confirm(`Изменить?`);
          const data = {
            title: textTitle.value,
            status: itemTodo.status,
          };
          if (itemTodo.id) await todoStore.updateTodo(itemTodo.id, data);
          openModal.value = false;
        }
      } else if ("title" in props.item) {
        const itemOnePost = props.item as OnePost;
        if (route.path.includes("posts")) {
          const data = {
            id: itemOnePost.id,
            user_id: itemOnePost.user_id,
            title: textTitle.value,
            body: textBody.value,
          };
          confirm(`Изменить?`);
          await postsStore.updatePost(data, id);
          openModal.value = false;
        }
      } else {
        console.error("Invalid item type");
      }
    };

    return {
      updateItem,
      textBody,
      textTitle,
      mdiPencil,
      showInput,
      openModal,
    };
  },
});
</script>

<style scoped></style>
