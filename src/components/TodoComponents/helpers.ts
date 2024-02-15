export function getDate(due: string | undefined) {
  if (!due) return "";
  const date = new Date(due);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `в ${hours}:${minutes}, ${year}.${month}.${day}`;
}
