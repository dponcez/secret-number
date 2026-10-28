export const log = value => console.log(value);
export const selector = element => document.querySelector(element);
export const selectorAll = element => document.querySelectorAll(element);
export const createSVGElement = (url, element) => document.createElementNS(url, element);
// listener wrapper based on Dave Gray's YouTube Channel - 10 JavaScript Function Examples: https://www.youtube.com/watch?v=LDgPTw6tePk&t=2s"
export const handler = ($, event, callback) => {
  if($ && typeof $.addEventListener === 'function'){
    $.addEventListener(event, callback)
  }
}