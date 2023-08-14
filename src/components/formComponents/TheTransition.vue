<template>
  <Transition name="my-transition">
    <slot></slot>
  </Transition>
</template>

<script>

</script>

<style>
  .my-transition-enter-active,
  .my-transition-leave-active {
    transition: all 0.25s ease-out;
  }

  .my-transition-enter-from {
    transform: translateY(30px);
    opacity: 0;
  }

  .my-transition-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
</style>