export { ScratchModel };

const ScratchModel = () => {
  let date = new Date(Date.now());
  let name = "sketch;" + date;

  const getName = () => name.substring(0, name.lastIndexOf(";"));

  let paths = [];
  let redoPaths = [];
  let currentPath = [];
  let xOffT = 0;
  let yOffT = 0;
  let currentColor = "black";

  const updateColor = (color) => (currentColor = color);

  const initPath = (x, y) => {
    currentPath = [];
    currentPath.push([x, y]);
  };

  const extendPath = (x, y) => {
    currentPath.push([x, y]);
  };

  const endPath = (x, y) => {
    currentPath.push([x, y]);
    paths.push([currentPath, currentColor]);
    currentPath = [];
  };

  const undo = () => {
    if (paths.length === 0) return;
    let rP = paths.pop();
    redoPaths.push(rP);
  };

  const redo = () => {
    if (redoPaths.length === 0) return;
    let rP = redoPaths.pop();
    paths.push(rP);
  };

  const clearAll = () => {
    while (paths.length > 0) {
      undo();
    }
  };

  const handlePan = (x, y) => {
    xOffT += x;
    yOffT += y;
    pan(x, y);
  };

  const pan = (x, y) => {
    paths.map((path) => {
      path[0].map((c) => {
        c[0] += x;
        c[1] += y;
      });
    });
  };

  const zoom = (factor, center) => {
    let xC, yC;
    [xC, yC] = center;
    paths.map((path) => {
      path[0].map((c) => {
        let xV = (c[0] - xC) * factor;
        let yV = (c[1] - yC) * factor;
        c[0] = xC + xV;
        c[1] = yC + yV;
      });
    });
  };

  return {
    getFullName: () => name,
    getName,
    setName: (newName) => (name = newName + ";" + date),
    getCreateDate: () => date,
    getHName: () => getName() + " - " + date.toUTCString(),
    getPaths: () => paths,
    updateColor,
    initPath,
    extendPath,
    endPath,
    handlePan,
    zoom,
    undo,
    redo,
    clearAll,
  };
};
