export default (mins: number) => {
  return (
    `${Math.floor(mins / 60)}`.padStart(2, "0") +
    ":" +
    `${mins % 60}`.padStart(2, "0")
  );
};
