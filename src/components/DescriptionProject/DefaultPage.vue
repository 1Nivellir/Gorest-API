<template>
  <v-container>
    <v-list lines="one" class="custom__list-posts">
      <v-list-item
        v-for="(item, index) in listUsers"
        :key="index"
        link
        theme="light"
        @click.prevent="goToUserPosts(item.id)"
        class="custom__list-item"
      >
        <v-card-title class="custom__title-default">{{
          item.name
        }}</v-card-title>
        <v-card-subtitle class="custom__title-default">{{
          item.email
        }}</v-card-subtitle>
      </v-list-item>
    </v-list>
    <v-pagination
      :model-value="page"
      color="white"
      class="my-4 custom__pagination"
      :length="totalPage"
      rounded="circle"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      @update:modelValue="changePage"
    ></v-pagination>
  </v-container>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { useAppStore } from "@/store/app";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const appStore = useAppStore();
    const totalPage = computed(() => appStore.getPagesUsers());
    const page = computed(() => appStore.getPageUsers);
    const $router = useRouter();
    const listUsers = computed(() => appStore.getListUsers);
    const overlay = ref(false);

    const changePage = async (count: number) => {
      appStore.setCurrentPageUsers(count);
      await appStore.getAllUsers(count);
    };
    const goToUserPosts = (id: number) => {
      const userId = id;
      $router.push({ name: "user", params: { userId } });
    };
    onMounted(async () => {
      try {
        overlay.value = true;
        await appStore.getAllUsers(1);
      } catch (error) {
        console.log(error);
      } finally {
        overlay.value = false;
      }
    });
    return { listUsers, goToUserPosts, totalPage, page, changePage, overlay };
  },
});
</script>

<style scoped>
.custom__list-posts {
  background-color: #011627;
}
.custom__title-default {
  color: #fff;
}
.custom__list-item {
  transition: background-color 0.4s ease-in-out;
}
.custom__list-item:hover {
  background-color: #06589c;
}
</style>
