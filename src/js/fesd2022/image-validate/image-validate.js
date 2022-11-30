export default class ImageValidate {
  constructor() {
    this.init();
  }
  init() {
    const images = document.querySelectorAll('*:not([video-id]) > img');
    const noImageDom = (width, height) => {
      const div = document.createElement('div');
      const slash1 = document.createElement('span');
      const slash2 = document.createElement('span');
      const slashWidth = Math.sqrt(width ** 2 + height ** 2);
      const theta = (Math.asin(height / slashWidth) * 180) / Math.PI;
      div.className = 'no-image';
      slash1.className = 'slash1';
      slash1.style.cssText = `
          width: ${slashWidth}px;
          transform: rotate(${theta}deg);
        `;
      slash2.className = 'slash2';
      slash2.style.cssText = `
          width: ${slashWidth}px;
          transform: rotate(${-theta}deg);
        `;
      div.appendChild(slash1);
      div.appendChild(slash2);
      return div;
    };
    const errorImage = document.querySelectorAll('.error-image');
    for (let i = 0; i < errorImage.length; i++) {
      errorImage[i].remove();
    }
    images.forEach((img) => {
      let src;
      const wrapWidth = img.parentElement.clientWidth;
      const wrapHeight = img.parentElement.clientHeight;
      if (img.classList.contains('lazy') || img.classList.contains('swiper-lazy')) {
        src = img.getAttribute('data-src');
      } else {
        src = img.getAttribute('src');
      }
      if (src === '') {
        const wrapDIV = document.createElement('div');
        const parentsPosition = getComputedStyle(img.parentElement).position;
        wrapDIV.className = 'error-image';
        if (parentsPosition === 'static') {
          img.parentElement.style.position = 'relative';
        }
        img.parentElement.appendChild(wrapDIV);
        wrapDIV.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%,-50%);
          z-index: 1;
        `;
        wrapDIV.appendChild(noImageDom(wrapWidth, wrapHeight));
      }
    });
    function imageResize() {
      const noImage = document.querySelectorAll('.no-image');
      if (noImage.length <= 0) return;
      noImage.forEach((item) => {
        const wrapWidth = item.parentElement.clientWidth;
        const wrapHeight = item.parentElement.clientHeight;
        const slashWidth = Math.sqrt(wrapWidth ** 2 + wrapHeight ** 2);
        const theta = (Math.asin(wrapHeight / slashWidth) * 180) / Math.PI;
        item.querySelector('.slash1').style.cssText = `
          width: ${slashWidth}px;
          transform: rotate(${theta}deg);
        `;
        item.querySelector('.slash2').style.cssText = `
          width: ${slashWidth}px;
          transform: rotate(${-theta}deg);
        `;
      });
    }
    window.addEventListener('resize', imageResize);
  }
  reValidate() {
    this.init();
  }
}
