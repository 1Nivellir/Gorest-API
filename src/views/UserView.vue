<template>
  <UserDetails />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserDetails from "../components/UserDetails/UserDetails.vue";

export default defineComponent({
  components: { UserDetails },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
