import { defineStore } from "pinia";

export const useStateStore = defineStore("state", () => {
  const headerIsVisible = ref(false);

  return { headerIsVisible };
});
