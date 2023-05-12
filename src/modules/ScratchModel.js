export { ScratchModel };

const ScratchModel = () => {
  let date = new Date(Date.now());
  let name = "sketch;" + date;

  const getName = () => name.substring(0, name.lastIndexOf(";"));

  return {
    getFullName: () => name,
    getName,
    getCreateDate: () => date,
    getHName: () => getName() + " - " + date.toUTCString(),
  };
};
