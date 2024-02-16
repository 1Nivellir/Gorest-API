<template>
  <div class="details__user-card" v-if="!overlay">
    <div class="custom-card__left">
      <div class="wrapper__photo"></div>
      <div class="wrapper__descr descr">
        <p class="descr__name">Name: {{ user && user.name }}</p>

        <p class="descr__gender">
          Gender: {{ getGender(user && user.gender) }}
        </p>
        <p class="descr__status">
          Статус аккаунта: {{ getStatus(user && user.status) }}
        </p>
        <a class="descr__email" :href="user && 'mailto:' + user.email">{{
          user && user.email
        }}</a>
      </div>
    </div>
    <div class="custom-card__right">
      <!-- <router-link></router-link> -->
      <v-list>
        <v-list-item class="descr__link" link @click="goToUserPosts"
          >Постов пользователя: {{ posts?.length }}
        </v-list-item>
        <v-list-item class="descr__link" link @click="goToUserTodos"
          >Дел пользователя: {{ todos?.length }}
        </v-list-item>
        <v-list-item class="descr__link" link @click="goToUserTodos"
          >Готовых дел: {{ ready }}
        </v-list-item>
        <v-list-item class="descr__link" link @click="goToUserTodos"
          >Не готовых дел: {{ notReady }}
        </v-list-item>
      </v-list>
    </div>
  </div>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { getPosts } from "@/helpers/PostService";
import { getTodoList } from "@/helpers/TodoService";
import { getUser } from "@/helpers/UserService";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { OnePost } from "../PostsComponents/models";
import { Todo } from "../TodoComponents/models";
import { getGender, getStatus } from "./helpers";
import { User } from "./models";

export default defineComponent({
  setup() {
    const $router = useRouter();
    const route = useRoute();
    const postIdParam = route.params.userId;
    const postIdAsNumber = Array.isArray(postIdParam)
      ? postIdParam[0]
      : postIdParam;
    const userId = parseInt(postIdAsNumber, 10);
    const overlay = ref(false);
    const user = ref<User>();
    const todos = ref<Todo[]>();
    const posts = ref<OnePost[]>();
    const notReady = ref(0);
    const ready = ref(0);
    onMounted(async () => {
      try {
        overlay.value = true;
        await Promise.all([
          getUser(userId).then((res) => {
            user.value = res;
          }),
          getPosts(userId).then((res) => {
            posts.value = res;
          }),
          getTodoList(userId).then((res) => {
            todos.value = res;
            for (let i = 0; i < res.length; ++i) {
              const item = res[i];
              if (item.status === "completed") {
                ready.value += 1;
              }
              if (item.status === "pending") {
                notReady.value += 1;
              }
            }
          }),
        ]);

        console.log(todos.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        overlay.value = false;
      }
    });

    const goToUserPosts = () => {
      $router.push({ name: "posts", params: { userId } });
    };
    const goToUserTodos = () => {
      $router.push({ name: "todos", params: { userId } });
    };
    return {
      user,
      todos,
      posts,
      overlay,
      getGender,
      getStatus,
      goToUserPosts,
      goToUserTodos,
      notReady,
      ready,
    };
  },
});
</script>

<style scoped></style>
./helpers
