<template>
  <v-row justify="center">
    <v-dialog v-model="updateDialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
          @click="openModal"
          variant="tonal"
        >
          Редактировать
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Ваш профиль</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-form @submit.prevent="updateUser">
                  <v-col cols="12">
                    <v-text-field
                      label="Ваше имя*"
                      required
                      color="primary"
                      v-model="currentName"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Email*"
                      required
                      color="primary"
                      v-model="currentEmail"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="currentStatus"
                      chips
                      color="primary"
                      label="Status"
                      :items="['Active', 'inActive']"
                      variant="solo-filled"
                    ></v-select>
                  </v-col>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="tonal"
            @click="updateDialog = false"
          >
            Закрыть
          </v-btn>

          <v-btn
            color="blue-darken-1"
            variant="tonal"
            @click.prevent="updateUser"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { HEADERS, URL_USERS } from "@/config";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { ref } from "vue";

export default {
  setup() {
    const userStore = useUserStore();
    const updateDialog = ref(false);
    const currentName = ref("");
    const currentEmail = ref("");
    const currentStatus = ref("");

    const openModal = () => {
      currentName.value = userStore.userData.name;
      currentEmail.value = userStore.userData.email;
      currentStatus.value = userStore.userData.status;
      updateDialog.value = true;
    };

    const updateUser = async () => {
      const url = URL_USERS + userStore.userData.id;

      const data = {
        name: currentName.value,
        email: currentEmail.value,
        status: currentStatus.value,
        gender: userStore.userData.gender,
        id: userStore.userData.id,
      };

      try {
        const response = await axios.put(url, data, {
          headers: HEADERS,
        });
        console.log("User updated:", response.data);
        userStore.setUserData(data);
        updateDialog.value = false;

        userStore.setUserData(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    return {
      updateDialog,
      currentName,
      currentEmail,
      currentStatus,
      openModal,
      updateUser,
    };
  },
};
</script>

<style lang="scss" scoped></style>
