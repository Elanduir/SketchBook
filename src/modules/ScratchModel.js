export { ScratchModel };

const ScratchModel = () => {
  let name = "sketch;" + Date.now();

  return {
    getName: () => name,
  };
};
