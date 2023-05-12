//@ts-check
export { getActualPositions };

const getActualPositions = (x, y) => {
  let canvas = document.getElementById("note");
  let bounding = canvas.getBoundingClientRect();
  return [x - bounding.left, y - bounding.top];
};
