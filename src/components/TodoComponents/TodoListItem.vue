<template>
  <v-list-item
    v-for="n in 3"
    :key="n"
    :title="'Item ' + n"
    subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
  ></v-list-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
