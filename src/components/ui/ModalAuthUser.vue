<template>
  <v-row justify="start">
    <v-dialog v-model="modalAuth" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="tonal"> Авторизоваться </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Введите ID вашего аккаунта*"
                  required
                  v-model="getUserId"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*Нужен только ваш ID</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="outlined"
            @click="modalAuth = false"
          >
            Закрыть
          </v-btn>
          <v-btn color="blue-darken-1" variant="outlined" @click="getIsAuth">
            Войти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { useUserStore } from "@/store/user";
import { ref } from "vue";
export default {
  setup() {
    const modalAuth = ref(false);
    const getUserId = ref<number | null>(null);
    const userStore = useUserStore();
    const getIsAuth = async () => {
      const id = getUserId.value;
      if (id) {
        try {
          await userStore.setUserData(id);
          modalAuth.value = false;
        } catch (error) {
          console.log("Error:", error);
        }
      }
    };

    return {
      modalAuth,
      getUserId,
      getIsAuth,
    };
  },
};
</script>

<style lang="scss" scoped></style>
