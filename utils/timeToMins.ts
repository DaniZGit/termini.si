export default (time: string) => {
  const timeDate = new Date("1970-01-01 " + time);
  const timeInMins = timeDate.getHours() * 60 + timeDate.getMinutes();

  return timeInMins;
};
