<template>
  <v-row justify="start">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="tonal"> Создать профиль </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Создать профиль</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Ваше имя*"
                  required
                  v-model="name"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Email*"
                  required
                  v-model="email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedGender"
                  :hint="
                    selectedGender
                      ? `${selectedGender.state}, ${selectedGender.abbr}`
                      : ''
                  "
                  :items="items"
                  item-title="state"
                  item-value="abbr"
                  label="Выберете пол"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*Необходимо создать пользователя</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="tonal" @click="dialog = false">
            Закрыть
          </v-btn>
          <v-btn color="blue-darken-1" variant="tonal" @click="createUser">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { useUserStore } from "@/store/user";
import { reactive, ref } from "vue";
export default {
  setup() {
    const dialog = ref(false);
    const name = ref("");
    const email = ref("");
    const selectedGender = ref<{ state: string; abbr: string } | null>(null);
    const select = reactive({
      state: "Мужской",
      abbr: "male",
    });
    const items = reactive([
      { state: "Мужской", abbr: "male" },
      { state: "Женский", abbr: "female" },
    ]);

    const userStore = useUserStore();
    const createUser = async () => {
      const data = {
        name: name.value,
        email: email.value,
        gender: selectedGender.value ? selectedGender.value.abbr : "",
        status: "active",
      };
      try {
        await userStore.createUser(data);
        dialog.value = false;
      } catch (error) {
        console.log("Error:", error);
      }
    };

    return {
      createUser,
      dialog,
      name,
      email,
      selectedGender,
      select,
      items,
    };
  },
};
</script>

<style lang="scss" scoped></style>
