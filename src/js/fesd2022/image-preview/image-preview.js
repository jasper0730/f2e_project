//產生結構
function createDOM(input, element, file, res) {
  const params = element.params
  const preview = input.closest('[data-upload-item]').querySelector('[data-preview]');
  if (preview.querySelector('img')) preview.querySelector('img').remove();
  preview.appendChild(res.imgElement);
  const group = input.dataset.group;
  const inputIndex = document.querySelector(element.el).dataset.index
  if (params.compress) {
    //副檔名
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).replace('.');
    //檔名
    const fileName = file.name.replace(`.${fileExt}`, '');
    //檔案壓縮
    res.originalCanvas.toBlob(
      function (blob) {
        const imgFile = new File([blob], `${fileName}`, { type: file.type });
        uploadImage[`${group}`][inputIndex] = {
          file: imgFile,
          info: res,
        };
        if (params.on.changeAfter && typeof params.on.changeAfter === 'function')
          params.on.changeAfter(input, res);
      },
      file.type,
      params.compress
    );
  } else {
    uploadImage[`${group}`][inputIndex] = {
      file: file,
      info: res,
    };
    if (params.on.changeAfter && typeof params.on.changeAfter === 'function')
      params.on.changeAfter(input, res);
  }
}

//產生Canvas
function createCanvas(options, img, outputW, outputH) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const originalWidth = img.width;
  const originalHeight = img.height;
  const originalRatio = (originalHeight / originalWidth) * 100;
  const outputRatio = (outputH / outputW) * 100;
  let newWidth = 0;
  let newHeight = 0;
  canvas.width = outputW;
  canvas.height = outputH;
  //縮圖填滿
  switch (options.previewSize) {
    case 'contain':
      if (originalRatio < outputRatio) {
        newWidth = canvas.width;
        newHeight = (outputW * originalRatio) / 100;
      } else if (originalRatio > outputRatio) {
        newWidth = (outputH / originalRatio) * 100;
        newHeight = canvas.height;
      } else {
        newWidth = canvas.width;
        newHeight = canvas.height;
      }
      break;
    case 'cover':
      if (originalRatio < outputRatio) {
        newWidth = (outputH / originalRatio) * 100;
        newHeight = canvas.height;
      } else if (originalRatio > outputRatio) {
        newWidth = canvas.width;
        newHeight = (outputW * originalRatio) / 100;
      } else if (originalRatio === outputRatio) {
        newWidth = canvas.width;
        newHeight = canvas.height;
      }
      break;
  }
  const x = (canvas.width - newWidth) * 0.5;
  const y = (canvas.height - newHeight) * 0.5;
  ctx.drawImage(img, x, y, newWidth, newHeight);

  return canvas;
}

//將檔案轉成圖片
function convertImg(options, dataUrl) {
  return new Promise((resolve, reject) => {
    if (dataUrl) {
      const img = new Image();
      img.src = dataUrl;
      img.classList.add(options.previewSize);
      img.onload = () => {
        let result = {
          imgElement: img,
          originalCanvas: createCanvas(options, img, img.width, img.height),
          info: {
            originalWidth: img.width,
            originalHeight: img.height,
            ratio: (img.height / img.width) * 100 + '%',
          },
        };
        resolve(result);
      };
    } else {
      resolve();
    }
  });
}

//小數點後第N位四捨五入
function formatFloat(num, pos) {
  const size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}

//檢查檔案大小
function checkSize(file, sizeLimit) {
  let fileSize = file.size / 1024 / 1024;
  return `${formatFloat(fileSize, 2)}` <= sizeLimit;
}

//讀取檔案
function readFileHandler(e, input, element) {
  if (e.target.files.length <= 0) return;
  const file = e.target.files[0];
  const parentsEl = input.closest('[data-upload-item]');
  let reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = file.type.split('/')[0] === 'image' ? event.target.result : null;
    if (element.params.sizeLimit && !checkSize(file, element.params.sizeLimit)) {
      input.value = '';
      parentsEl.classList.add('over-limit');
      if (element.params.on.overLimit && typeof element.params.on.overLimit === 'function')
        element.params.on.overLimit(input,element.params.sizeLimit);
      return;
    } else {
      parentsEl.classList.remove('over-limit');
      parentsEl.classList.add('uploaded');
      convertImg(element.params, dataUrl).then((res) => {
        createDOM(input, element, file, res);
      });
    }
  };
  reader.readAsDataURL(file);
}

export default class ImagePreview {
  constructor(element, params) {
    const self = this;
    self.el = element;
    // default params
    self.params = {
      on: {
        changeAfter: null,
        overLimit: null,
      },
      group: 'group', //群組名稱 (type: String)
      sizeLimit: 2, //大小限制 (type: Number 單位: MB)
      previewSize: 'cover', //縮圖形式 (type: String 'contain' || 'cover')
      compress: 0.8, //壓縮品質 (type: Number 0~1 || false)
    };
    Object.assign(self.params, params);
    self.init();
  }
  init() {
    const self = this;
    const inputs = document.querySelectorAll(`${self.el}:not(.preview-active)`);
    if (inputs.length <= 0) return;
    window.uploadImage = {};
    inputs.forEach((input, index) => {
      input.classList.add('preview-active');
      // final set params
      const params = {
        group: input.dataset.group || self.params.group,
        sizeLimit: parseInt(input.dataset.limit) || self.params.sizeLimit,
        previewSize: input.dataset.previewSize || self.params.previewSize,
        compress: input.dataset.compress || self.params.compress,
        on: {
          changeAfter: input.dataset.changeAfter
            ? function (el, res) {
                eval(input.dataset.changeAfter + '(el,res);');
              }
            : self.params.on.changeAfter,
          overLimit: input.dataset.overLimit
            ? function (el,sizeLimit) {
                eval(input.dataset.overLimit + '(el,sizeLimit);');
              }
            : self.params.on.overLimit,
        },
      };
      if (typeof uploadImage[`${params.group}`] === 'undefined')
        uploadImage[`${params.group}`] = [];
      if (!input.dataset.group) input.dataset.group = params.group;
      input.dataset.index = document.querySelectorAll(`[data-group="${params.group}"]`).length - 1;
      input.addEventListener('change', function (e) {
        readFileHandler(e, input, self);
      });
    });
  }
}
