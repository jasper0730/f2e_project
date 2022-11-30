/**
 * 將預設參數放置 options / SETTINGS
 */

import videoPlayer from './videoPlayer';
import OPTIONS from './options';
import SHARED from './../shared/shared';
import {
  isString,
  isElement,
  isNodeList,
  isElementExist,
  isFunction,
  getElement,
  getAllElements,
  createUid,
  toHTMLElement,
  jsonParse,
  warn,
  error,
} from './../shared/utils';

('use strict');

// define custom element
if (!customElements.get('video-player')) {
  customElements.define('video-player', videoPlayer);
}

/**
 * setCss
 * 判斷影片物件是否沒有 video-id
 * @function
 * @param {Object} data
 */

const isVideoID = (data) =>
  data.videoId === '' || typeof data.videoId === 'undefined' ? false : true;

/**
 * setCss
 * 判斷影片物件是否沒有 data-video4-active = on
 * @function
 * @param {Object} data
 */

const isActive = (data) => (data.$selector.getAttribute('video4-active') === 'on' ? true : false);

const createPlayer = (params) => {
  const { videoId, videoType, videoAutoplay } = params;
  return `<video-player video-id="${videoId}" video-type="${videoType}" video-autoplay="${videoAutoplay}"></video-player>`;
};

class video4 {
  /**
   * @param {(HTMLElement|string)} element
   */

  constructor(el, options = {}) {
    // 可傳 string 或 element 或 nodeList
    if (!isString(el) && !isElement(el) && !isNodeList(el)) return;

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

    elements.forEach((el) => {
      el.video = {};
      el.video.instance = this;
      el.video.defaultOptions = options;
      el.video.params = this.#getVideoData(el);

      if (isElementExist(el) && isVideoID(el.video.params) && !isActive(el.video.params)) {
        el.setAttribute('video4-active', 'on');
        // el.classList.add(el.video.params.playerType);
        // el.classList.add('video4-cover');

        this.#createCover(el);
      }
    });

    this.emit('init');
  }

  #createCover(el) {
    const { LAYOUT } = OPTIONS;
    const params = el.video.params;
    const { $selector, videoLayoutNo, videoId, videoType, videoAutoplay, videoMode, videoButton, videoCover } = params;

    if (videoMode === 'onBox') {
      let $target = null;
      if (videoCover === 'on') {
        el.classList.add('video4-cover');
        // 無圖片結構放置圖片結構
        if (!$selector.querySelector('img')) {
          $selector.insertAdjacentHTML('afterbegin', '<img src="" alt>');
          warn(`若啟用 [videoCover] 且選擇 onBox 模式必須於 video-target 內放置 img 結構`);
        }

        const $cover = $selector.querySelector('img');
        $cover.insertAdjacentHTML('afterend', LAYOUT[videoLayoutNo]);

        const src = $cover?.getAttribute('src') || $cover?.getAttribute('data-src');

        // 無圖片時放置預設封面畫面，僅 youtube 提供
        if (!src && videoType == 'youtube') {
          $cover.setAttribute('src', `https://img.youtube.com/vi/${videoId}/sddefault.jpg`);
        }
        if (!src && videoType == 'vimeo') {
          $cover.setAttribute('src', `https://vumbnail.com/${videoId}_large.jpg`);
        }

        if (videoButton === 'off') {
          $target = $selector;
        }
        else {
          $target = $selector.querySelector(videoButton) ?? $selector;
          if (!$selector.querySelector(videoButton)) {
            warn(`找不到 videoButton 設定的 element -> '${videoButton}' , 點擊物件轉移至 '${this.__storage__.el}'`);
          }
        }
      }
      else {
        // 無 videoCover 設定則判定為 video-target 為 trigger
        $target = $selector;
      }

      if (!$target.video) {
        $target.video = {};
        $target.video.params = params;
      }

      $target.video.eventHandler = this.#trigger;
      $target.addEventListener('click', $target.video.eventHandler);
    }
    else if (videoMode === 'onPage') {
      $selector.innerHTML = createPlayer(params);
    }
  }

  #trigger(e) {
    const { video } = this;

    console.log('debug', video.params.videoTarget, video.params.videoTargetRoute);

    const options = {
      target: video.params.videoTarget,
      route: video.params.videoTargetRoute,
      on: {
        success(modal) {},
        error(e) {},
        complete(modal) {
          modal
            .querySelector('.modal-content')
            .insertAdjacentHTML('beforeend', createPlayer(video.params));
        },
        open(modal) {
          const scrollers = modal.querySelectorAll('.os-viewport');
          _g.lazy.update();
          _g.scrollLock([...scrollers]);
        },
        close() {
          if (!$('modern-modal:visible').length) _g.scrollUnlock();
        },
        destroy() {
          if (!$('modern-modal:visible').length) _g.scrollUnlock();
        }
      },
    };

    Modal4.open(options);
  }

  #getVideoData(el) {
    const { SETTINGS } = OPTIONS;
    const data = {};

    data.$selector = el;

    data.videoId = data.$selector.getAttribute('video-id');
    data.videoType = data.$selector.getAttribute('video-type');
    data.videoAutoplay = data.$selector.getAttribute('video-autoplay') || SETTINGS.videoAutoplay;
    data.videoMode = data.$selector.getAttribute('video-mode') || SETTINGS.videoMode;
    data.videoButton = data.$selector.getAttribute('video-button') || SETTINGS.videoButton;
    data.videoCover = data.$selector.getAttribute('video-cover') || SETTINGS.videoCover;
    data.videoLayoutNo = data.$selector.getAttribute('video-layout-no') || SETTINGS.videoLayoutNo;
    data.videoTarget = data.$selector.getAttribute('video-target') || SETTINGS.videoTarget;
    data.videoTargetRoute =
      data.$selector.getAttribute('video-target-route') || SETTINGS.videoTargetRoute;

    return data;
  }

  update() {
    this.#create();
  }
}

Object.assign(video4.prototype, SHARED);

export default video4;
