export const getGender = (gender: string | undefined) => {
  let result = "";
  if (gender === "male") {
    result = "Мужской";
  } else {
    result = "Женский";
  }
  return result;
};
export const getStatus = (status: string | undefined) => {
  let result = "";
  if (status === "active") {
    result = "Активный";
  } else {
    result = "Неактивный";
  }
  return result;
};
