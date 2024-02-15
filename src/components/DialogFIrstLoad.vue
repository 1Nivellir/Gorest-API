<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="1024">
      <v-card>
        <v-card-text> Обнаружен аккаунт </v-card-text>
        <v-card-text> Имя пользователя: {{ userData.name }} </v-card-text>
        <v-card-text> Почта: {{ userData.email }} </v-card-text>

        <v-card-text> ID аккаунта: {{ userData.id }} </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="tonal" block @click.prevent="goIsUser"
            >Выбрать этот аккаунт?</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false" variant="tonal"
            >Отмена</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/store/user";
import { defineComponent, onMounted, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const dialog = ref(false);
    const userStore = useUserStore();
    const userData = reactive({
      name: "",
      email: "",
      id: null,
    });

    const goIsUser = async () => {
      dialog.value = false;
      userStore.isAuth = true;
      if (userData.id) {
        await userStore.setUserData(userData.id);
      }
    };

    const user = localStorage.getItem("UserData");
    onMounted(async () => {
      if (user !== null && user !== "") {
        dialog.value = true;
        await getUserInLocalStorage();
      } else {
        dialog.value = false;
      }
    });

    const getUserInLocalStorage = async () => {
      const storedEncodedUserData = localStorage.getItem("UserData");
      if (storedEncodedUserData) {
        try {
          const decodedUserData = await JSON.parse(atob(storedEncodedUserData));
          userData.name = decodedUserData.name;
          userData.email = decodedUserData.email;
          userData.id = decodedUserData.id;
        } catch (error) {
          console.error("Error decoding user data:", error);
        }
      } else {
        console.error("No encoded user data found in localStorage");
      }
    };

    return { dialog, userStore, userData, goIsUser };
  },
});
</script>

<style scoped></style>
@/helpers/UserService
