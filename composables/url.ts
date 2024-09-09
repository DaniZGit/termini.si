export const useUrl = (url: string | undefined) => {
  if (!url || url.length <= 0) {
    return "/images/placeholder.png";
  }

  return url;
};
