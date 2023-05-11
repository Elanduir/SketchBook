//@ts-check
import { DrawUtil } from "./modules/Draw.js";
import { Handlers } from "./modules/Handlers.js";
import { SketchModel } from "./modules/SketchModel.js";

let canvas;
let context;

let model;
let drawAgent;

let strokeWidth = 2;
let strokeColor;

const setup = () => {
  canvas = document.getElementById("note");
  let picker = document.getElementById("strokeColorPicker");
  // @ts-ignore
  strokeColor = picker.value;
  // @ts-ignore
  context = canvas.getContext("2d");
  console.log(strokeColor);

  drawAgent = DrawUtil(strokeColor);
  model = SketchModel(drawAgent);
  let handlers = Handlers(model);

  // @ts-ignore
  canvas.width = window.innerWidth - 50;
  // @ts-ignore
  canvas.height = window.innerHeight - 50;

  context.lineWidth = strokeWidth;
};

setup();
