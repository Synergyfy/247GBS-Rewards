export const deleteCookie = (name: string): void => {
  document.cookie = `${encodeURIComponent(
    name
  )}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
};
