<template>
  <v-card class="mx-auto" max-width="344">
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      height="200px"
      cover
    ></v-img>

    <v-card-title> {{ userStore.userData.name }} </v-card-title>

    <v-card-subtitle> {{ userStore.userData.email }} </v-card-subtitle>

    <v-card-actions>
      <ModalUpdateUser v-if="userStore.isAuth" />

      <v-spacer></v-spacer>

      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text
          >Статус аккаунта: {{ userStore.userData.status }}
        </v-card-text>
        <v-card-text>Пол: {{ gender }} </v-card-text>

        <v-card-text>ID аккаунта: {{ userStore.userData.id }} </v-card-text>
        <div class="custom__wrapper-btn-card">
          <v-btn variant="tonal" color="deleteBtn" @click.prevent="deleteUser"
            >Удалить аккаунт</v-btn
          >
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import { deleteUser as deleteUserService } from "@/helpers/UserServise";
import { useUserStore } from "@/store/user";
import { computed, ref } from "vue";
import ModalUpdateUser from "./ModalUpdateUser.vue";
export default {
  components: { ModalUpdateUser },
  setup() {
    const userStore = useUserStore();
    const show = ref(false);
    const deleteUser = () => {
      deleteUserService();
    };
    const gender = computed(() => {
      return userStore.userData.gender === "male" ? "Мужской" : "Женский";
    });
    return {
      userStore,
      deleteUser,
      show,
      gender,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom__wrapper-btn-card {
  padding: 15px;
}
</style>
