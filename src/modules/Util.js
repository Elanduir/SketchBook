//@ts-check
export { getMousePos };

const getMousePos = (event, key) => {
  let canvas = document.getElementById("note");
  let bounding = canvas.getBoundingClientRect();
  if (key === "X") return event.clientX - bounding.left;
  if (key === "Y") return event.clientY - bounding.top;
};
