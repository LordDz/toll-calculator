export const getMinutes = (nrOfMinutes: number) => {
  return nrOfMinutes * 60 * 1000;
};

export const getHours = (hours: number) => {
  return hours * 60 * 1000 * 60;
};

export const timeout = (delay: number) => {
  return new Promise((res) => setTimeout(res, delay));
};
