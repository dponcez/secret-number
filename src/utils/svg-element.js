import { createSVGElement } from "_fns/custom_functions.js";

const SVG_PATH = "http://www.w3.org/2000/svg";
const XLINK_PATH = "http://www.w3.org/1999/xlink";

export const loadSVGElement = (size = { url, width, height }) => {
  const svg = createSVGElement(SVG_PATH, "svg");
  svg.setAttribute("width", size.width);
  svg.setAttribute("height", size.height);

  const image = createSVGElement(SVG_PATH, "image");
  image.setAttributeNS(XLINK_PATH, "xlink:href", size.url);
  image.setAttribute("width", size.width);
  image.setAttribute("height", size.height);
  image.setAttribute("perserveAspectRatio", "xMidYMid meet");

  svg.appendChild(image);
  return svg.outerHTML;
};
