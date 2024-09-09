export default (price: string | undefined | null) => {
  if (!price) return "";

  const num = parseFloat(price);
  return `${num.toFixed(2)} €`;
};
