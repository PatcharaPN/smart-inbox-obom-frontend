const date = new Date();
export const formattedDate = date.toLocaleString("th-TH", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
