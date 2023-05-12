//@ts-check
export { getActualPositions, setCookie, getCookie };

const getActualPositions = (x, y) => {
  let canvas = document.getElementById("note");
  let bounding = canvas.getBoundingClientRect();
  return [x - bounding.left, y - bounding.top];
};

const setCookie = (key, value) => {
  document.cookie =
    key +
    "=" +
    value +
    "; " +
    "expires=Sat, 31 Dec 2050 23:59:59 UTC; path:=/; SameSite=Strict";
};

const getCookie = (key) => {
  return getAllCookies()[key];
};

const getAllCookies = () => {
  let cookieString = document.cookie;
  let cookieList = cookieString.split("; ");
  let cookies = {};
  cookieList.map((c) => {
    let key, value;
    [key, value] = c.split("=");
    cookies[key] = value;
  });
  return cookies;
};
