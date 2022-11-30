// FESD
import {
  Anchor4,
  Aost4,
  Modal4,
  Article4,
  Video4,
  Share4,
  ImageValidate,
  CategorySlider,
  ImagePreview,
} from './fesd2022/fesd';
// LazyLoad
import LazyLoad from 'vanilla-lazyload';
// scrollbar Lock
import { lock, unlock } from 'tua-body-scroll-lock';

const _g = {
  scrollLock(elements) {
    const elementArr = [];
    if (elements) {
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          elementArr.push(element);
        } else if (typeof element === 'string') {
          elementArr.push(...document.querySelectorAll(`${element}`));
        }
      });
    }
    if (fesdDB.is.isMobile4) {
      lock(elementArr);
    } else {
      $('body').css('overflow', 'hidden');
    }
  },
  scrollUnlock(elements) {
    const elementArr = [];
    if (elements) {
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          elementArr.push(element);
        } else if (typeof element === 'string') {
          elementArr.push(...document.querySelectorAll(`${element}`));
        }
      });
    }
    if (fesdDB.is.isMobile4) {
      unlock(elementArr);
    } else {
      $('body').attr('style', '');
    }
  },
  loading() {
    const LoadingDOM = `<div class="loading-wrapper"><div class="icon-box"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#ffffff" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform></path></svg></div></div>`;
    $('body').append(LoadingDOM);
    $('.loading-wrapper')
      .fadeIn(300)
      .promise()
      .done(function () {
        _g.scrollLock();
      });
  },
  loaded() {
    $('.loading-wrapper')
      .fadeOut(300)
      .promise()
      .done(function () {
        $('.loading-wrapper').remove();
        _g.scrollUnlock();
      });
  },
  getFormValue(target = '.wdd-form') {
    // 參數 -
    // 在對應的地方 加上 [form-field] --> 欄位名稱 [field-type] --> 欄位格式
    // isFile(取檔案數值物件)
    // isRadio(要放在對應父層)
    // isCheckBox(要放在對應父層)
    // isSelect(要放在對應父層)
    let data = {};
    const formAll = document.querySelectorAll(`${target} [form-field]`);
    formAll.forEach((el) => {
      const field = el.getAttribute('form-field');
      const type = el.getAttribute('field-type');
      switch (type) {
        case 'isRadio':
          const radioChecked = el.querySelector('input:checked');
          data[field] = {
            id: parseInt(
              radioChecked.closest('.option-item').querySelector('.text').getAttribute('data-id')
            ),
            value: radioChecked.closest('.option-item').querySelector('.text').textContent,
          };
          break;

        case 'isCheckBox':
          const checkBoxChecked = el.querySelectorAll('input:checked');
          data[field] = [];
          checkBoxChecked.forEach((v) => {
            data[field].push({
              id: parseInt(
                v.closest('.option-item').querySelector('.text').getAttribute('data-id')
              ),
              value: v.closest('.option-item').querySelector('.text').textContent,
            });
          });
          break;

        case 'isSelect':
          const selectType = el.hasAttribute('multiple') ? 'multiple' : 'single';
          switch (selectType) {
            case 'single':
              data[field] = {
                value: el.s.value.id ? el.s.value.id : '',
                display: el.s.value.el ? el.s.value.el.textContent : '',
              };
              break;
            case 'multiple':
              data[field] = {
                value: el.s.value.map((option) => option.id),
                display: el.s.value.map((option) => option.el.textContent),
              };
              break;
          }
          break;
        case 'isFile':
          const fileTemp = el.parentNode.querySelector('.fake-file-upload input');
          data[field] = fileTemp ? fileTemp.files : undefined;
          break;

        default:
          data[field] = el.value;
          break;
      }
    });

    console.log('資料===>', data);
    return data;
  },
  lazy: new LazyLoad({}),
  aost4: new Aost4('[data-aost]'),
  anchor4: new Anchor4('[data-anchor-target]'),
  modal4: new Modal4('[data-modal-target]', {
    on: {
      open(modal) {
        const scrollers = modal.querySelectorAll('.os-viewport');
        _g.lazy.update();
        _g.scrollLock([...scrollers]);
      },
      close() {
        if ($('modern-modal:visible').length <= 0) _g.scrollUnlock();
      },
    },
  }),
  article4: new Article4('._articleBlock'),
  video4: new Video4('[video-target]'),
  share4: new Share4('[web-share]'),
  imageValidate: new ImageValidate(),
  imagePreview(selector, options) {
    new ImagePreview(selector, options);
  },
  categorySlider(selector, options) {
    new CategorySlider(selector, options);
  },
  ajaxUpdate() {
    _g.aost4.update();
    _g.lazy.update();
    _g.imageValidate.reValidate();
    _g.anchor4.update();
  },
};

window._g = _g;
window.Anchor4 = Anchor4;
window.Aost4 = Aost4;
window.Modal4 = Modal4;
window.Video4 = Video4;
window.Article4 = Article4;

$(() => {
  // 自動移動至 ? 後面參數
  Anchor4.url({
    spacer: 'nav.navbar',
  });
});
