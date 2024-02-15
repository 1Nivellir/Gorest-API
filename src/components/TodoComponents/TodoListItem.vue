<template>
  <v-list-item
    class="custom__item"
    :class="{
      'custom__list-item': item.status === 'completed',
      'another-class': item.status === 'pending',
    }"
  >
    <v-switch
      v-if="notShow"
      class="custom__switch"
      v-model="localStatus"
      :label="localStatus ? 'Выполнено' : 'Еще не готово...'"
      :color="localStatus ? 'success' : 'error'"
      hide-details
      @change="readyEvent(item.id)"
    ></v-switch>
    <v-list-item-title class="custom__item-title">{{
      item.title
    }}</v-list-item-title>
    <v-list-item-subtitle class="custom__item-date"
      >Добавлено: {{ getDate(item.due_on) }}</v-list-item-subtitle
    >
    <actions-btn :item="item" v-if="notShow" />
  </v-list-item>
</template>

<script lang="ts">
import { useTodoStore } from "@/store/todos";
import { useUserStore } from "@/store/user";
import { PropType, defineComponent, onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import ActionsBtn from "../ui/ActionsBtn.vue";
import { getDate } from "./helpers";
import { Todo } from "./models";

export default defineComponent({
  components: { ActionsBtn },
  props: {
    item: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  setup(props) {
    const userStore = useUserStore();
    const route = useRoute();
    const todoStore = useTodoStore();
    const localStatus = ref(props.item.status === "completed");
    const notShow = ref(false);

    onMounted(() => {
      const params = Array.isArray(route.params.userId)
        ? route.params.userId[0]
        : route.params.userId;
      const userId = parseInt(params, 10);
      if (userId !== userStore.userData.id) {
        notShow.value = false;
      } else {
        notShow.value = true;
      }
    });
    watchEffect(() => {
      localStatus.value = props.item.status === "completed";
    });
    const readyEvent = async (id: any) => {
      const status = localStatus.value ? "completed" : "pending";
      const data = {
        title: props.item.title,
        status: status,
      };
      await todoStore.updateTodo(id, data);
    };
    return { readyEvent, localStatus, notShow, getDate };
  },
});
</script>

<style scoped>
.custom__list-item {
  background-color: rgb(17, 71, 47);
}
.custom__item-title {
  padding: 15px;
  color: rgb(255, 255, 255);
  font-size: 24px;
  font-weight: 500;
}
.custom__item {
  border-bottom: 1px solid grey;
  margin-top: 10px;
}
.custom__switch {
  color: rgb(255, 255, 255);
}
.custom__item-date {
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 500;
}
</style>
