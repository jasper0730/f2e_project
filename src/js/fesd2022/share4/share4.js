import OPTIONS from './options';
import SHARED from './../shared/shared';
import { isString, isElementExist, getAllElements } from './../shared/utils';

class Share4 {
  constructor(el, options = {}) {
    this.__storage__ = {
      el,
      options,
    };

    this.#create();
  }

  #create() {
    const { el, options } = this.__storage__;
    if (!isString(el) || !isElementExist(el)) return;

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
    const { elements } = this;

    elements.forEach((targets) => {
      targets.querySelectorAll('[share-target]').forEach((el) => {
        el.share = {};
        el.share.element = el;
        el.share.eventHandler = this.#trigger;
        el.addEventListener('click', el.share.eventHandler);
      });
    });

    this.emit('afterInit');
  }

  #trigger() {
    /** the keyword `this` in this method is pointed to the click target */
    const { eventHandler, element } = this.share;

    const $target = element;
    const type = $target.getAttribute('share-target');

    const utm = {
      source: $target.getAttribute('utm-source'),
      medium: $target.getAttribute('utm-medium'),
      campaign: $target.getAttribute('utm-campaign'),
    };

    const copy = {
      success: $target.getAttribute('copy-success'),
      text: $target.getAttribute('copy-text'),
      class: $target.getAttribute('copy-class'),
      duration: $target.getAttribute('copy-duration') || 1500,
    };

    const share = {
      baseUrl: encodeURIComponent(document.URL),
      targetUrl: '',
    };

    switch (type) {
      case 'facebook':
        share.targetUrl = 'https://www.facebook.com/sharer/sharer.php?u=';
        break;
      case 'line':
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        )
          share.targetUrl = 'http://line.naver.jp/R/msg/text/?';
        else share.targetUrl = 'https://lineit.line.me/share/ui?url=';
        break;
      case 'twitter':
        share.targetUrl = 'https://twitter.com/intent/tweet?url=';
        break;
      case 'linkedin':
        share.targetUrl = `http://www.linkedin.com/shareArticle?mini=true&title=${document.title}&source=${document.title}&url=`;
        break;
      case 'telegram':
        share.targetUrl = 'https://telegram.me/share/url?url=';
        break;
      case 'wechat':
        // 若為 wechat 則另開視窗掃描 QRcode
        // https://api.qrserver.com/v1/create-qr-code/?data=${url}&size=300x300
        window.open(`https://api.qrserver.com/v1/create-qr-code/?data=${share.baseUrl}&size=250x250`, 'share to wechat', 'width=300,height=300');
        return;
      case 'url':
        // 若為 url 則複製連結
        if ($('.copied-wrapper').length) return;

        $('body').append(
          `<div class='copied-wrapper'><div class='text'>${
            copy.success ? copy.success : ''
          }</div><input id='clipboard' type='text' readonly></div>`
        );

        const $clipboard = $('#clipboard');
        const url = copy.text || window.location.href;
        const className = copy.class;
        const offset = $(this).offset();
        const elWidth = $(this).innerWidth() / 2;

        $('.copied-wrapper')
          .addClass(className)
          .css({ top: offset.top, left: offset.left + elWidth })
          .show();

        $clipboard.val(url);
        $clipboard[0].setSelectionRange(0, 9999);
        $clipboard.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
          $('.copied-wrapper .text')
            .fadeIn(300)
            .promise()
            .done(function () {
              setTimeout(function () {
                $('.copied-wrapper .text')
                  .fadeOut(300)
                  .promise()
                  .done(function () {
                    $('.copied-wrapper').remove();
                  });
              }, copy.duration);
            });
        }

        return;
      default:
        // 無以上 tyep 則直接 return
        return;
    }

    // url + '?utm_source=Facebook' + '&utm_medium=social' + '&utm_campaign=' + campaign
    share.baseUrl = `${share.baseUrl}${utm.source ? '?utm_source=' + utm.source : ''}${
      utm.medium ? '&utm_medium' + utm.medium : ''
    }${utm.campaign ? '&utm_campaign' + utm.campaign : ''}`;
    share.baseUrl = share.baseUrl.replace('?', '%3F').replace(new RegExp('&', 'g'), '%26');

    window.open(`${share.targetUrl}${share.baseUrl}&quote=${share.baseUrl}`);

    this.removeEventListener('click', eventHandler);
    setTimeout(() => {
      this.addEventListener('click', eventHandler);
    }, 100);
  }
}

Object.assign(Share4.prototype, SHARED);

export default Share4;
