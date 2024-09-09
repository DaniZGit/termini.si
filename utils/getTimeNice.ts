export default (date: string) => {
  return useDateFormat(date, "HH:mm").value;
};
