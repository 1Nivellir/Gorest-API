<template>
  <v-list-item-action>
    <div class="text-center custom__action-wrapper-btn">
      <transition
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
        :css="false"
      >
        <div class="custom__wrapper-btn-post" v-if="showActions">
          <v-btn @click.prevent="showActions = !showActions">
            <v-icon size="x-large">mdi-transfer-right</v-icon>
            <v-tooltip activator="parent" location="top"
              >Свернуть меню</v-tooltip
            >
          </v-btn>

          <v-btn v-if="showDelete">
            <v-icon size="x-large" icon="mdiPencil">mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top"
              >Редактировать {{ textTooltip }}</v-tooltip
            >
            <ModalUpdate :item="item" />
          </v-btn>
          <v-btn
            @click.prevent="goToItemDetails(item.id)"
            v-if="showGoToDetails"
          >
            <v-icon size="x-large">mdi-arrow-right-bold</v-icon>
            <v-tooltip activator="parent" location="top"
              >Перейти к посту</v-tooltip
            >
          </v-btn>

          <v-btn @click.prevent="deleteItem" v-if="showDelete">
            <v-icon size="x-large" color="red-darken-2" icon="mdiDelete"
              >mdi-delete</v-icon
            >
            <v-tooltip activator="parent" location="top"
              >Удалить {{ textTooltip }}</v-tooltip
            >
          </v-btn>
        </div>
      </transition>
    </div>
    <transition
      @before-enter="onBeforeEnter2"
      @enter="onEnter2"
      @leave="onLeave2"
      :css="false"
    >
      <v-btn
        @click.prevent="showActions = !showActions"
        v-if="!showActions"
        class="custom__btn-open"
      >
        <v-icon size="x-large">mdi-transfer-left</v-icon>
        <v-tooltip activator="parent" location="top">Открыть меню</v-tooltip>
      </v-btn>
    </transition>
  </v-list-item-action>
</template>

<script lang="ts">
import {
  onBeforeEnter,
  onBeforeEnter2,
  onEnter,
  onEnter2,
  onLeave,
  onLeave2,
} from "@/helpers/animation";
import { usePostsStore } from "@/store/posts";
import { useTodoStore } from "@/store/todos";
import { useUserStore } from "@/store/user";
import { defineComponent, inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ModalUpdate from "./ModalUpdate.vue";

export default defineComponent({
  components: { ModalUpdate },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const userStore = useUserStore();
    const todoStore = useTodoStore();
    const postsStore = usePostsStore();
    const $router = useRouter();
    const showDelete = ref(false);
    const showActions = ref(false);
    const showBtn = ref(false);
    const showGoToDetails = ref(false);
    const textTooltip = ref("");
    const item = props.item;
    onMounted(() => {
      const userIdNumber = route.params.userId;
      if (typeof userIdNumber === "string") {
        const userIdNew = parseInt(userIdNumber, 10);
        examinationId(userIdNew);
      }
      if (route.path.includes("/posts")) {
        showGoToDetails.value = true;
        textTooltip.value = "пост";
      } else {
        showGoToDetails.value = false;
        textTooltip.value = "дело";
      }
    });
    const examinationId = (userId: number) => {
      const userIdStore = userStore.userData.id;
      if (userIdStore !== userId) {
        showBtn.value = false;
        showDelete.value = false;
      } else {
        showBtn.value = true;
        showDelete.value = true;
      }
    };

    const deleteItem = async () => {
      confirm("Delete?");
      const idParams = route.params.userId;
      const getId = Array.isArray(idParams) ? idParams[0] : idParams;
      const id = parseInt(getId, 10);
      if (route.path.includes("posts")) {
        try {
          await postsStore.removePost(item.id);
          postsStore.setTotalPosts(postsStore.postTotal - 1);
          const postsPerPage = 5;
          const totalPages = postsStore.postTotal / postsPerPage;
          if (postsStore.postPages - 1 === totalPages) {
            postsStore.setCurrentPage(postsStore.getPagePosts - 1);
            console.log(id);
            await postsStore.setPosts(postsStore.getPagePosts, id);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }
      if (route.path.includes("todos")) {
        try {
          await todoStore.removeItem(item.id);
          todoStore.setTotalTodos(todoStore.total - 1);
          const todoPerPage = 5;
          const totalPages = todoStore.total / todoPerPage;
          if (todoStore.pages - 1 === totalPages) {
            todoStore.setCurrentPage(todoStore.getCurrentPage - 1);
            await todoStore.setTodoList(todoStore.getCurrentPage, id);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }
    };

    const goToItemDetails = (id: number) => {
      const postId = id;
      $router.push({ name: "post-details", params: { postId } });
    };

    return {
      onBeforeEnter,
      onEnter,
      onLeave,
      onBeforeEnter2,
      onEnter2,
      onLeave2,
      deleteItem,
      goToItemDetails,
      showActions,
      showBtn,
      showGoToDetails,
      showDelete,
      textTooltip,
    };
  },
});
</script>

<style scoped>
.custom__wrapper-btn-post {
  display: flex;
  align-items: center;
  gap: 15px;
}

.custom__btn-open {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.custom__action-wrapper-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
