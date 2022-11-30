// 判斷操作事件使用 mouse 或是 touch
let operateStart = 'ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown';
let operateEnd = 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup';
let operateMove = 'ontouchmove' in document.documentElement ? 'touchmove' : 'mousemove';

/* ---------------------------- Function 宣告 --------------------------------- */

// 獲取 translate 數值
function getTranslateValues(element) {
  const style = window.getComputedStyle(element);
  const matrix = style['transform'] || style.mozTransform;

  // No transform property. Simply return 0 values.
  if (matrix === 'none') {
    return {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  // Can either be 2d or 3d transform
  const matrixType = matrix.includes('3d') ? '3d' : '2d';
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');

  // 2d matrices have 6 values
  // Last 2 values are X and Y.
  // 2d matrices does not have Z value.
  if (matrixType === '2d') {
    return {
      x: Number(matrixValues[4]),
      y: Number(matrixValues[5]),
      z: 0,
    };
  }

  // 3d matrices have 16 values
  // The 13th, 14th, and 15th values are X, Y, and Z
  if (matrixType === '3d') {
    return {
      x: Number(matrixValues[12]),
      y: Number(matrixValues[13]),
      z: Number(matrixValues[14]),
    };
  }
}

// 計算輪播內容總寬度
function getSlideTotalW(element) {
  const slideWrap = element.querySelector('.wrapper');
  const items = slideWrap.querySelectorAll('.item');
  let slideTotalWidth = 0; //輪播內容總寬度
  items.forEach((item) => {
    const style = getComputedStyle(item);
    const marginL = parseInt(style.marginLeft);
    const marginR = parseInt(style.marginRight);
    slideTotalWidth += item.getBoundingClientRect().width + marginL + marginR;
  });
  return slideTotalWidth;
}

// 偵測目前輪播位置
function detectPos(self) {
  // 拖拉在最左邊時
  if (getTranslateValues(self.slideWrapEl).x >= self.translateMin) {
    return 'is-start';
  }
  // 拖拉在最右邊時
  else if (getTranslateValues(self.slideWrapEl).x <= self.translateMax) {
    return 'is-end';
  }
  // 拖拉在中間時
  else if (
    getTranslateValues(self.slideWrapEl).x < self.translateMin &&
    getTranslateValues(self.slideWrapEl).x > self.translateMax
  ) {
    return 'is-middle';
  }
}

// 綁定事件
function eventHandler(self) {
  const element = self.el;
  const slideWrap = element.querySelector('.wrapper');
  //滑鼠按住或是行動裝置手指按住
  slideWrap.addEventListener(operateStart, function (e) {
    self.isDown = true;
    if (self.slidable) slideWrap.classList.add('dragging');
    switch (operateStart) {
      case 'mousedown':
        self.startX = e.pageX;
        break;
      case 'touchstart':
        self.startX = e.changedTouches[0].pageX;
        break;
    }
    self.nowTranslateX = getTranslateValues(slideWrap).x;
  });

  //滑鼠放開或是行動裝置手指放開
  slideWrap.addEventListener(operateEnd, function (e) {
    self.isDown = false;
    slideWrap.classList.remove('dragging');
    slideWrap.classList.remove('moving');
    //移動距離
    let moveDistance;
    switch (operateMove) {
      case 'mousemove':
        moveDistance = e.pageX - self.startX;
        break;
      case 'touchmove':
        moveDistance = e.changedTouches[0].pageX - self.startX;
        break;
    }
    if (moveDistance === 0 && e.target.closest('.item')) {
      if (operateEnd === 'mouseup' && e.button !== 0) return;
      const items = slideWrap.querySelectorAll('.item');
      items.forEach((item) => {
        item.classList.remove('active');
      });
      e.target.closest('.item').classList.add('active');
      self.moveActive(self.params.speed);
    } else {
      if (self.slidable) self.resetPos(element);
    }
  });

  //滑鼠離開
  slideWrap.addEventListener('mouseleave', function () {
    if (!self.isDown) return;
    if (self.slidable) {
      self.isDown = false;
      slideWrap.classList.remove('dragging');
      slideWrap.classList.remove('moving');
      self.resetPos(element);
    }
  });

  //滑鼠移動或是行動裝置手指移動
  slideWrap.addEventListener(operateMove, function (e) {
    if (!self.draggable) return;
    if (self.slidable) {
      if (!self.isDown) return;
      e.preventDefault();
      //移動距離
      let moveDistance;
      switch (operateMove) {
        case 'mousemove':
          moveDistance = e.pageX - self.startX;
          break;
        case 'touchmove':
          moveDistance = e.changedTouches[0].pageX - self.startX;
          break;
      }
      if (moveDistance !== 0) {
        slideWrap.classList.add('moving');
        const styles = {
          transition: 'all 0ms ease 0s',
          transform: `translate3d(${self.nowTranslateX + moveDistance}px,0,0)`,
        };
        Object.assign(slideWrap.style, styles);
      }
    }
  });
}

// 取消 a 的拖拉
function disableLinkDrag(element) {
  const aTag = element.querySelectorAll('a');
  for (var i = 0, len = aTag.length; i < len; i++) {
    aTag[i].draggable = false;
  }
}

export default class CategorySlider {
  constructor(element, params) {
    this.el = typeof element === 'string' ? document.querySelector(element) : element;
    this.slideWrapEl = this.el.querySelector('.wrapper');
    // default params
    this.params = {
      speed: 300,
      clickSwitch: true,
      breakpoint: false,
    };
    Object.assign(this.params, params);

    this.draggable = true;
    this.isDown = false; //按下
    this.startX = 0; //按下初始位置
    this.nowTranslateX = getTranslateValues(this.slideWrapEl).x; //目前X軸偏移輛
    this.slideTotalWidth = getSlideTotalW(this.el);
    this.translateMin = 0;
    this.translateMax = -Math.floor(
      Math.abs(
        getSlideTotalW(this.el) - this.el.querySelector('.wrapper').getBoundingClientRect().width
      )
    );
    this.slidable =
      this.slideTotalWidth > Math.round(this.el.getBoundingClientRect().width) &&
      (!this.params.breakpoint || window.innerWidth <= this.params.breakpoint);
    this.init();
  }
  init() {
    const self = this;
    if (self.slidable) {
      self.slideWrapEl.style.width = `${self.slideTotalWidth}px`;
      self.el.classList.add('slidable');
      if (self.slideWrapEl.querySelector('.item.active')) self.moveActive();
    }
    window.addEventListener('resize', function () {
      self.update();
    });
    eventHandler(self);
    disableLinkDrag(self.el);
  }
  moveActive(speed) {
    const self = this;
    const activeItem = self.slideWrapEl.querySelector('.item.active');
    const prevItem = activeItem.previousElementSibling;
    const prevOffsetLeft = prevItem
      ? activeItem.offsetLeft - self.el.clientWidth / 2 + activeItem.clientWidth / 2
      : 0;
    if (self.slidable) {
      if (-prevOffsetLeft < 0 && -prevOffsetLeft > self.translateMax) {
        const styles = {
          transition: `all ${speed ? speed : 0}ms ease 0s`,
          transform: `translate3d(-${prevOffsetLeft}px,0,0)`,
        };
        Object.assign(self.slideWrapEl.style, styles);
      } else if (-prevOffsetLeft >= 0) {
        const styles = {
          transition: `all ${speed ? speed : 0}ms ease 0s`,
          transform: `translate3d(0,0,0)`,
        };
        Object.assign(self.slideWrapEl.style, styles);
      } else {
        const styles = {
          transition: `all ${speed ? speed : 0}ms ease 0s`,
          transform: `translate3d(${self.translateMax}px,0,0)`,
        };
        Object.assign(self.slideWrapEl.style, styles);
      }
      if (speed) {
        self.slideWrapEl.addEventListener(
          'transitionend',
          function () {
            self.nowTranslateX = getTranslateValues(self.slideWrapEl).x;
            switch (detectPos(self)) {
              case 'is-start':
                self.el.classList.add('is-start');
                self.el.classList.remove('is-end');
                break;
              case 'is-middle':
                self.el.classList.remove('is-start');
                self.el.classList.remove('is-end');
                break;
              case 'is-end':
                self.el.classList.remove('is-start');
                self.el.classList.add('is-end');
                break;
            }
          },
          false
        );
      } else {
        self.nowTranslateX = getTranslateValues(self.slideWrapEl).x;
        switch (detectPos(self)) {
          case 'is-start':
            self.el.classList.add('is-start');
            self.el.classList.remove('is-end');
            break;
          case 'is-middle':
            self.el.classList.remove('is-start');
            self.el.classList.remove('is-end');
            break;
          case 'is-end':
            self.el.classList.remove('is-start');
            self.el.classList.add('is-end');
            break;
        }
      }
    }
  }
  resetPos() {
    const self = this;
    switch (detectPos(self)) {
      case 'is-start':
        self.el.classList.add('is-start');
        self.el.classList.remove('is-end');
        Object.assign(self.slideWrapEl.style, {
          transition: `all ${self.params.speed}ms ease 0s`,
          transform: 'translate3d(0,0,0)',
        });
        break;
      case 'is-middle':
        self.el.classList.remove('is-start');
        self.el.classList.remove('is-end');
        break;
      case 'is-end':
        self.el.classList.remove('is-start');
        self.el.classList.add('is-end');
        Object.assign(self.slideWrapEl.style, {
          transition: `all ${self.params.speed}ms ease 0s`,
          transform: `translate3d(${self.translateMax}px,0,0)`,
        });
        break;
    }
  }
  update() {
    const self = this;
    self.el.querySelector('.wrapper').removeAttribute('style');
    self.slideTotalWidth = getSlideTotalW(self.el);
    self.translateMax = -Math.floor(
      Math.abs(
        getSlideTotalW(self.el) - self.el.querySelector('.wrapper').getBoundingClientRect().width
      )
    );
    self.slidable =
      self.slideTotalWidth > Math.round(self.el.getBoundingClientRect().width) &&
      (!self.params.breakpoint || window.innerWidth <= self.params.breakpoint);
    if (self.slidable) {
      self.slideWrapEl.style.width = `${self.slideTotalWidth}px`;
      self.el.classList.add('slidable');
      if (self.slideWrapEl.querySelector('.item.active')) self.moveActive();
    } else {
      self.el.classList.remove('slidable');
      self.el.classList.remove('is-start');
      self.el.classList.remove('is-end');
      self.slideWrapEl.removeAttribute('style');
    }
  }
}
