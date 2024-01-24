<template>
  <DialogFIrstLoad />
  <HomeComponent />
</template>

<script lang="ts">
import HomeComponent from "@/components/HomeComponent.vue";
import DialogFIrstLoad from "@/components/DialogFIrstLoad.vue";
export default {
  components: { HomeComponent, DialogFIrstLoad },
};
</script>
