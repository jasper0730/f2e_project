// check value is string and not empty
export const isString = (value) => {
  return typeof value === 'string' && value !== '';
};

// check value is number and not NaN
export const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

// check is HTML element
export const isElement = (value) => {
  return value instanceof HTMLElement;
};

// check is Node List
export const isNodeList = (value) => {
  return value instanceof NodeList;
};

// check element is exist
export const isElementExist = (value) => {
  return getElement(value) !== null;
};

// check value is a function
export const isFunction = (value) => {
  return typeof value === 'function';
};

// if value is an element then return value, if not then query value
export const getElement = (value) => {
  return isElement(value) ? value : document.querySelector(value);
};

// if value is an element then return value, if not then query value
export const getAllElements = (value) => {
  return isNodeList(value) ? value : document.querySelectorAll(value);
};

// create a unique id
export const createUid = () => {
  return Math.random().toString(36).substr(2, 9);
};

// parse string to HTML element
export const toHTMLElement = (str) => {
  const dom = document.createElement('div');
  dom.innerHTML = str;
  return dom.childNodes;
};

// parse json to object
export const jsonParse = (json) => {
  try {
    JSON.parse(json);
  } catch (e) {
    return json;
  }
  return JSON.parse(json);
};

// get element transform X
export const getTransformX = (target) => {
  const transform = getComputedStyle(target).transform;
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) return parseFloat(mat[1].split(', ')[12]);
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(', ')[4]) : 0;
};

// get element transform Y
export const getTransformY = (target) => {
  const transform = getComputedStyle(target).transform;
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) return parseFloat(mat[1].split(', ')[13]);
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
};

// warn
export const warn = (msg) => {
  console.warn(`[Video4 warn]: ${msg}`);
};

// error
export const error = (msg) => {
  console.error(`[Video4 error]: ${msg}`);
};
