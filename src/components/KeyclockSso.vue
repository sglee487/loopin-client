<!-- src/components/PostMessage.vue -->
<template>
  <div>secrettt</div>
</template>

<script>
export default {
  name: "PostMessage",
  mounted() {
    console.log(window.location.href);
    console.log(window.location.origin);
    parent.postMessage(window.location.href, window.location.origin);
  },
};
</script>

<style scoped>
/* 스타일이 필요하면 여기에 추가 */
</style>
