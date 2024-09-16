export default (el: HTMLElement | null | undefined) => {
  if (!el || !el.parentElement) return false;

  return el.clientWidth >= el.parentElement.clientWidth;
};
