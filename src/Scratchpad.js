//@ts-check
import { DrawUtil } from "./modules/Draw.js";
import { Handlers } from "./modules/Handlers.js";
import { Initialize } from "./modules/InitHandler.js";
import { ScratchHandler } from "./modules/ScratchHandler.js";
import { SketchModel } from "./modules/SketchModel.js";
import { setCookie } from "./modules/Util.js";

let canvas;
let context;

let model;
let drawAgent;

let strokeWidth = 2;
let strokeColor;

let init;

const setup = () => {
  canvas = document.getElementById("note");
  // @ts-ignore
  canvas.width = window.innerWidth;
  // @ts-ignore
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d");
  context.lineWidth = strokeWidth;

  let picker = document.getElementById("strokeColorPicker");
  // @ts-ignore
  strokeColor = picker.value;
  // @ts-ignore

  drawAgent = DrawUtil(strokeColor);
  model = SketchModel(drawAgent);
  let handlers = Handlers(model);

  // ------------- REWORK -------------
  init = Initialize();
};

setup();
