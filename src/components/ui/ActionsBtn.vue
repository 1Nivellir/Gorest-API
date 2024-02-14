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
import { fetchPost } from "@/helpers/PostService";
import { fetchTodos } from "@/helpers/TodoService";
import {
  onBeforeEnter,
  onBeforeEnter2,
  onEnter,
  onEnter2,
  onLeave,
  onLeave2,
} from "@/helpers/animation";
import { useAppStore } from "@/store/app";
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
    const appStore = useAppStore();
    const postsStore = usePostsStore();
    const injectedUserId = inject("userId");
    const userId = Number(injectedUserId);
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
    const examinationId = (userId: any) => {
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
      if (route.path.includes("posts")) {
        try {
          await postsStore.removePost(item.id);
          appStore.setTotalPosts(appStore.postTotal - 1);
          const postsPerPage = 5;
          const totalPages = appStore.postTotal / postsPerPage;
          if (appStore.postPages - 1 === totalPages) {
            appStore.setCurrentPage(appStore.getPagePosts - 1);
            await fetchPost(appStore.getPagePosts, userId);
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
            await fetchTodos(todoStore.getCurrentPage, userId);
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
