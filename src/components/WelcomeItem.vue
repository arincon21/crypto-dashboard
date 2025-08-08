<template>
  <div class="flex relative mt-8 md:mt-0 md:pl-8 md:pb-4 md:pt-1">
    <i
      class="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 text-gray-700 md:absolute md:top-1/2 md:left-[-26px] md:-translate-y-1/2 border border-gray-300 bg-white rounded-lg">
      <slot name="icon"></slot>
    </i>
    <div class="flex-1 ml-4">
      <h3 class="text-lg font-medium mb-1 text-gray-800">
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
    <!-- Líneas verticales para desktop -->
    <div v-if="$slots.icon" class="hidden md:block absolute left-0 top-0 h-1/2 border-l border-gray-300"
      :class="{ '!hidden': $el?.parentElement?.firstElementChild === $el }"></div>
    <div v-if="$slots.icon" class="hidden md:block absolute left-0 bottom-0 h-1/2 border-l border-gray-300"
      :class="{ '!hidden': $el?.parentElement?.lastElementChild === $el }"></div>
  </div>
</template>


<!-- No se necesita style, todo es Tailwind -->
