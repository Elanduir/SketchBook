//@ts-check
export { getActualPos };

const getActualPos = (x, key) => {
  let canvas = document.getElementById("note");
  let bounding = canvas.getBoundingClientRect();
  if (key === "X") return x - bounding.left;
  if (key === "Y") return x - bounding.top;
};
