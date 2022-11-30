import OPTIONS from './options';
import SHARED from './../shared/shared';
import {
  isString,
  isNodeList,
  isElementExist,
  isFunction,
  getElement,
  getAllElements,
  createUid,
  toHTMLElement,
  jsonParse,
  warn,
} from './../shared/utils';

// import video4 from './../video4/video4';
// import $ from '../utils/dom.js';

('use strict');

/**
 * setCss
 *
 * @function
 * @param {HTMLElement} target
 * @param {string} style
 * @param {string} css
 */

const setCss = (target, style, css) => {
  if (!target) return;

  // 若是 NodeList 則需使用 foreach set css
  if (isNodeList(target)) target.forEach((el) => (el.style[style] = css));
  else target.style[style] = css;
};

class Article4 {
  /**
   * @param {(HTMLElement|string)} element
   */

  constructor(el, options = {}) {
    if (!isString(el) || !isElementExist(el)) return;

    this.__storage__ = {
      el,
      options,
    };

    this.#create();
  }

  #create() {
    const { el, options } = this.__storage__;
    const { SETTINGS, EVENTS } = OPTIONS;

    this.elements = getAllElements(el);
    this.options = Object.assign({}, SETTINGS, options);
    this.__events__ = Object.assign({}, EVENTS);

    if (this.options.on) {
      for (const [k, v] of Object.entries(this.options.on)) {
        this.__events__[k] = [v];
      }
    }

    this.#init();
  }

  #init() {
    const { elements, options } = this;

    elements.forEach((parent) => {
      parent.article = {};
      parent.article.instance = this;
      parent.article.defaultOptions = options;
      parent.article.typeList = [];

      parent.querySelectorAll('._article').forEach((el) => {
        el.article = {};
        el.article.parent = parent;
        el.article.params = this.#getArticleData(el);

        this.#setStyle(el).#creatVideo4(el).#creatSwiper(el);
      });
    });

    this.emit('init');
  }

  #getArticleData(element) {
    const data = {};

    data.this = element;

    // 父層元件
    data.$backgroundWrap = element.querySelector('._backgroundWrap');
    data.$contentWrap = element.querySelector('._contentWrap');
    data.$wordCover = element.querySelector('._wordCover');
    data.$buttonCover = element.querySelector('._buttonCover');
    data.$imgCover = element.querySelector('._imgCover');
    data.$cover = element.querySelectorAll('._cover');
    data.$swiper = element.querySelector('.swiper');
    data.$swiperButtonCover = element.querySelector('.swiper-button-cover');

    // 子層元件
    data.$h = element.querySelector('._H');
    data.$subH = element.querySelector('._subH');
    data.$p = element.querySelector('._P');
    data.$button = element.querySelector('._button');
    data.$description = element.querySelectorAll('._description');
    data.$video = element.querySelectorAll('[data-video-target]');

    // 父層設定
    data.typeFullColor = element.getAttribute('typeFull-color');
    data.typeFullBoxColor = element.getAttribute('typeFull-boxcolor');

    // 子層設定
    data.hColor = element.getAttribute('h-color');
    data.subHColor = element.getAttribute('subh-color');
    data.pColor = element.getAttribute('p-color');
    data.buttonColor = element.getAttribute('button-color');
    data.buttonColorHover = element.getAttribute('button-color-hover');
    data.buttonTextColor = element.getAttribute('button-textcolor');
    data.descriptionColor = element.getAttribute('description-color');

    return data;
  }

  #setStyle(element) {
    const { params } = element.article;

    // article ._H
    setCss(params.$h, 'color', params.hColor);

    // article ._subH
    setCss(params.$subH, 'color', params.subHColor);

    // article ._P
    setCss(params.$p, 'color', params.pColor);

    // imgCover ._description
    setCss(params.$description, 'color', params.descriptionColor);

    // button background-color && text color
    setCss(params.$button, 'backgroundColor', params.buttonColor);
    setCss(params.$button, 'color', params.buttonTextColor);

    // button hover color
    if (params.buttonColorHover) {
      params.$button.appendChild(document.createElement('span'));
      setCss(params.$button.querySelector('span'), 'backgroundColor', params.buttonColorHover);
    }

    // typeFull background-color
    setCss(params.$backgroundWrap, 'backgroundColor', params.typeFullColor);

    // typeFull box background-color
    setCss(params.$contentWrap, 'backgroundColor', params.typeFullBoxColor);

    return this;
  }

  #creatVideo4(element) {
    const { params } = element.article;

    if (params.$video.length) {
      const video = new Video4(params.$video);
    }

    return this;
  }

  #creatSwiper(element) {
    const { options } = this;
    const { basic_rwd } = options;

    const { params } = element.article;

    // 判斷是否擁有 swiper4 結構
    if (!params.$swiper) return;

    // set id
    const $id = createUid();

    // set swiper
    let $swiperSet = {
      breakpoints: {},
    };

    params.this.setAttribute('img-swiper', 'on');
    params.this.classList.add(`swiper-${$id}`);

    // swiper navigation (預設為 off)
    if (
      params.this.getAttribute('swiper-arrow') !== 'off' &&
      params.this.getAttribute('swiper-arrow')
    ) {
      const next = document.createElement('div');
      next.className = `swiper-button-next swiper-${$id}`;
      params.$swiperButtonCover.appendChild(next);

      const prev = document.createElement('div');
      prev.className = `swiper-button-prev swiper-${$id}`;
      params.$swiperButtonCover.appendChild(prev);

      $swiperSet.navigation = {
        nextEl: `.swiper-button-next.swiper-${$id}`,
        prevEl: `.swiper-button-prev.swiper-${$id}`,
      };
    }

    // swiper pagination (預設為 on)
    if (
      params.this.getAttribute('swiper-nav') !== 'off' ||
      !params.this.getAttribute('swiper-nav')
    ) {
      const pagination = document.createElement('div');
      pagination.className = `swiper-pagination swiper-${$id}`;
      params.$swiper.appendChild(pagination);

      $swiperSet.pagination = {
        el: `.swiper-pagination.swiper-${$id}`,
        clickable: true,
      };
    }

    // slidesPerView
    if (Number.parseInt(params.this.getAttribute('swiper-num'))) {
      $swiperSet.breakpoints[basic_rwd] = {
        slidesPerView: params.this.getAttribute('swiper-num')
          ? Number.parseInt(params.this.getAttribute('swiper-num')) > 5
            ? 5
            : Number.parseInt(params.this.getAttribute('swiper-num'))
          : 1,
      };
    }

    // autoplay (預設為 on)
    if (
      params.this.getAttribute('swiper-autoplay') !== 'off' ||
      !params.this.getAttribute('swiper-autoplay')
    ) {
      $swiperSet.autoplay = {
        delay: 3000,
        disableOnInteraction: false,
      };
    }

    // loop (預設為 on)
    if (
      params.this.getAttribute('swiper-loop') !== 'off' ||
      !params.this.getAttribute('swiper-loop')
    ) {
      $swiperSet.loop = true;
    }

    // speed
    if (params.this.getAttribute('swiper-speed')) {
      $swiperSet.speed = parseInt(params.this.getAttribute('swiper-speed'));
    }

    // parallax (預設為 off)
    if (
      params.this.getAttribute('swiper-parallax') !== 'off' &&
      !params.this.getAttribute('swiper-loop')
    ) {
      $swiperSet.parallax = true;
    }

    // 若 swiper 只有一筆輪播則隱藏 navigation 及 pagination
    let gate = () =>
      window.innerWidth > this.basic_rwd ? Number(params.this.getAttribute('swiper-num')) || 1 : 1;

    if (params.$swiper.querySelectorAll('.swiper-slide').length <= gate()) {
      $swiperSet.navigation = false;
      $swiperSet.pagination = false;
      $swiperSet.autoplay = false;
      $swiperSet.loop = false;

      params.this.querySelector('.swiper-button-cover').style.display = 'none';
      params.this.querySelector('.swiper-pagination').style.display = 'none';

      params.$swiper.classList.add('swiper-no-swiping');
    }

    const $swiper = new Swiper(params.$swiper, $swiperSet);

    element.article.swiperList = [];
    element.article.swiperList.push($swiper);

    return this;
  }
}

Object.assign(Article4.prototype, SHARED);

export default Article4;
