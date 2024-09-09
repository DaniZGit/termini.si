export default (date: string) => {
  return useDateFormat(date, "DD. MM. YYYY").value;
};
