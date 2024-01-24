<template>
  <div>
    <v-input :success-messages="['Success']" success> success </v-input>
    <v-switch
      v-model="ready"
      label="success"
      color="success"
      value="success"
      hide-details
    ></v-switch>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const ready = ref(false);
    return {
      ready,
    };
  },
});
</script>

<style scoped></style>
