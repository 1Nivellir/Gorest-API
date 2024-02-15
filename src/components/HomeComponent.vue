<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      color="background"
      class="custom__drawer"
      theme="dark"
    >
      <v-sheet rounded="lg">
        <UserDataCard v-if="userStore.isAuth" />
      </v-sheet>
      <!--  -->
      <v-list
        density="compact"
        nav
        class="custom__list-navigation"
        v-if="userStore.isAuth"
      >
        <v-list-item prepend-icon="mdi-view-dashboard" value="home">
          <RouterLink :to="{ name: 'default' }" class="custom__link-header"
            >Главная</RouterLink
          >
        </v-list-item>
        <v-list-item
          link
          prepend-icon="mdi-forum"
          value="posts"
          @click.prevent="goToMyPost"
          >Мои посты
        </v-list-item>
        <v-list-item
          link
          prepend-icon="mdi-view-dashboard"
          value="todos"
          @click.prevent="goToMyTodo"
        >
          Мои дела
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      theme="dark"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>GOREST API</v-app-bar-title>
      <div class="custom__wrapper-modals" v-if="!userStore.isAuth">
        <div>
          <ModalCreateUser />
        </div>
        <div>
          <ModalAuthUser />
        </div>
      </div>
      <v-btn icon @click="isOutUser" v-if="userStore.isAuth">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="custom__main">
      <v-container class="custom__container">
        <!--  -->
        <router-view v-slot="{ Component }" name="aboutContent">
          <component :is="Component" />
        </router-view>
      </v-container>
    </v-main>
    <Transition name="card__success" :duration="550" mode="out-in">
      <v-card v-if="showMessage" class="custom__card">
        <v-card-text class="text-h4">Пост добавлен</v-card-text>
      </v-card>
    </Transition>
  </v-app>
</template>

<script lang="ts">
import listPosts from "@/components/PostsComponents/ListPosts.vue";
import UserDataCard from "@/components/UserDetails/UserDataCard.vue";
import { usePostsStore } from "@/store/posts";
import { useTodoStore } from "@/store/todos";
import { useUserStore } from "@/store/user";
import { computed, defineComponent, ref } from "vue";
import ModalAuthUser from "./ui/ModalAuthUser.vue";
import ModalCreateUser from "./ui/ModalCreateUser.vue";

import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    listPosts,
    ModalCreateUser,
    ModalAuthUser,
    UserDataCard,
  },
  setup() {
    const todoStore = useTodoStore();
    const userStore = useUserStore();
    const postsStore = usePostsStore();
    const drawer = ref(false);

    const showMessage = computed(() => postsStore.getShowModal);
    const userId = computed(() => userStore.getId);
    const $router = useRouter();

    const isOutUser = () => {
      userStore.outUser();
      postsStore.clearPosts();
      todoStore.clearTodos();
    };
    const goToMyPost = () => {
      postsStore.clearPosts();
      $router.push({ name: "posts", params: { userId: userId.value } });
    };
    const goToMyTodo = () => {
      $router.push({ name: "todos", params: { userId: userId.value } });
    };

    return {
      isOutUser,
      userStore,
      drawer,
      showMessage,
      userId,
      goToMyPost,
      goToMyTodo,
    };
  },
  data: () => ({
    links: ["Dashboard", "Messages", "Profile", "Updates"],
  }),
  methods: {},
});
</script>

<style lang="scss">
.custom__sheet {
  background-color: #011627;
}
.custom__container {
  background-color: #011627;
}
.custom__wrapper-modals {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  gap: 50px;
}
.custom__link-header {
  text-decoration: none;
  color: inherit;
}
.custom__main {
  background-image: url(https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg);
  background-size: cover;
}
.custom__wrapper-header-btn {
  display: flex;
  align-items: center;
  gap: 15px;
}
.custom__card {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 30px 40px;
  background-color: greenyellow;
}
.card__success-enter-active {
  transition: all 0.3s ease-out;
}

.card__success-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.card__success-enter-from,
.card__success-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.custom__list-navigation {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
