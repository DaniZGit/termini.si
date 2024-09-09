export default (id: string | undefined | null) => {
  const backendUrl = useRuntimeConfig().public.directus.url;
  if (!id || id.length <= 0) {
    return "/images/placeholder.png";
  }

  // seems like directus has some nuxtimg integration where it automatically uses backend url
  return id;
};
