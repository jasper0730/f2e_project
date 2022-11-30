import OPTIONS from './options';
import SHARED from '../shared/shared';
import { isElementExist, getElement, getAllElements } from '../shared/utils.js';
// 卷軸套件
import 'overlayscrollbars/css/OverlayScrollbars.min.css';
import OverlayScrollbars from 'overlayscrollbars';
// 縣市資料
import { cityData } from './cityData.js';

// create template method
const createTemplate = (d4) => {
  const { TEMPLATE } = OPTIONS;
  const { childDom } = d4.s;
  const container = document.createElement('div');
  const filter = d4.classList.contains('filter');
  container.innerHTML = TEMPLATE(filter);
  const content = container.querySelector('.dropdown-list');
  [...childDom].forEach((child) => {
    if (child.tagName === 'LI') {
      if (!child.hasAttribute('data-option') || child.getAttribute('data-option').trim() === '') {
        child.setAttribute('data-option', child.textContent);
      }
    }
    content.append(child);
  });

  return container.children[0];
};

// 判斷是否有設定連動
const detectSync = (d4) => {
  const controlElements = d4.getAttribute('control-elements')?.split(',');
  if (controlElements) {
    controlElements.forEach((el) => {
      const disabledEl = document.querySelector(el);
      if (disabledEl.classList.contains('disabled')) {
        disabledEl.classList.remove('disabled');
        if (disabledEl.tagName === 'DROPDOWN-EL' && disabledEl.s.activeLi !== undefined) {
          setSelectDisplay(disabledEl, [...disabledEl.s.allLi].indexOf(disabledEl.s.activeLi));
        }
      }
    });
  }
};

const setSelectDisplay = (d4, valueIndex) => {
  const placeholder = d4.getAttribute('d4-placeholder');
  const allLi = d4.s.allLi;
  if (valueIndex < 0 || valueIndex === []) {
    // 恢復空值狀態
    d4.s.allLi.forEach((el) => {
      el.classList.remove('active');
    });
    d4.s.activeLi = undefined;
    d4.s.value = {
      index: d4.s.selectType === 'single' ? -1 : [],
      id: undefined,
      el: undefined,
    };
    d4.s.selectDisplayEl.textContent = placeholder;
    d4.setAttribute('d4-value', '');
  } else {
    if (d4.classList.contains('disabled')) {
      d4.s.selectDisplayEl.textContent = placeholder;
      return;
    }
    // 判斷單選或複選
    switch (d4.s.selectType) {
      case 'single':
        const option = allLi[valueIndex].textContent;
        d4.s.allLi.forEach((el) => {
          el.classList.remove('active');
        });
        allLi[valueIndex].classList.add('active');
        d4.s.selectDisplayEl.textContent = option;
        d4.s.activeLi = allLi[valueIndex];
        d4.s.value = {
          index: valueIndex,
          id: allLi[valueIndex].getAttribute('data-option'),
          el: allLi[valueIndex],
        };
        break;
      case 'multiple':
        if (typeof valueIndex === 'object') {
          d4.s.allLi.forEach((li) => {
            if (valueIndex.indexOf([...d4.s.allLi].indexOf(li)) >= 0) {
              li.classList.add('active');
            } else {
              li.classList.remove('active');
            }
          });
        }
        const activeLi = d4.querySelectorAll('.dropdown-list > li.active');
        if (activeLi.length <= 0) {
          d4.s.selectDisplayEl.textContent = placeholder;
        } else {
          d4.s.selectDisplayEl.textContent = '';
          activeLi.forEach((li) => {
            const id = li.getAttribute('data-option');
            const option = li.textContent;
            const tagEl = `<div class="option-btn" data-option="${id}"><div class="text">${option}</div><div class="remove-icon"></div></div>`;
            d4.s.selectDisplayEl.insertAdjacentHTML('beforeend', tagEl);
          });
        }
        d4.s.activeLi = activeLi;
        d4.s.value = [...activeLi].map((option) => {
          const obj = {
            index: [...allLi].indexOf(option),
            id: option.getAttribute('data-option'),
            el: option,
          };
          return obj;
        });
        const valueArray = [...activeLi].map((option) => option.getAttribute('data-option'));
        d4.setAttribute('d4-value', valueArray.join());
        break;
    }
  }
};

const loadCityData = (d4) => {
  // 塞入縣市資料
  if (d4.classList.contains('city')) {
    d4.s.dropdownEl.querySelector('.dropdown-list').innerHTML = '';
    Object.keys(cityData).forEach((city) => {
      const li = document.createElement('li');
      li.textContent = city;
      li.setAttribute('data-option', city);
      d4.s.dropdownEl.querySelector('.dropdown-list').append(li);
    });
  }
};

const closeAllDropdown = () => {
  const allDropdown = getAllElements('dropdown-el[d4-status="open"]');
  allDropdown.forEach((el) => {
    el.close();
  });
};

const settingScrollbarStyle = () => {
  const { SETTINGS } = OPTIONS;
  const setProperty = (element, obj) => {
    Object.keys(obj).forEach((key) => {
      element.style.setProperty(`--${key}`, obj[key]);
    });
  };
  setProperty(document.documentElement, SETTINGS.scrollbar);
};

// 設定卷軸樣式
settingScrollbarStyle();
// 點擊空白處關閉下拉選單
document.addEventListener('click', function () {
  closeAllDropdown();
});

// 創建 Custom Element
class Dropdown4 extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return ['d4-status', 'd4-placeholder', 'd4-value'];
  }
  attributeChangedCallback(attr, oldVal, newVal) {
    const d4 = this;
    switch (attr) {
      case 'd4-status':
        if (newVal === 'open' || newVal === 'close') {
          d4.emit(newVal);
        }
        break;
      case 'd4-value':
        if (oldVal === null || oldVal === newVal) return;
        if (newVal !== '') {
          switch (d4.s.selectType) {
            case 'single':
              const li = d4.querySelector(`.dropdown-list > li[data-option="${newVal}"]`);
              if (isElementExist(li)) {
                setSelectDisplay(d4, [...d4.s.allLi].indexOf(li));
              } else {
                setSelectDisplay(d4, -1);
              }
              break;
            case 'multiple':
              const valueLiArray = [];
              d4.querySelector(`.dropdown-list > li`).classList.remove('active');
              newVal.split(',').forEach((option) => {
                const li = d4.querySelector(`.dropdown-list > li[data-option="${option}"]`);
                if (isElementExist(li)) {
                  li.classList.add('active');
                  valueLiArray.push(li);
                }
              });
              const valueIndexArray = valueLiArray.map((li) => [...d4.s.allLi].indexOf(li));
              setSelectDisplay(d4, valueIndexArray);
              break;
          }
        } else {
          setSelectDisplay(d4, -1);
        }
        d4.emit('change');
        break;
      case 'd4-placeholder':
        if (oldVal === null) return;
        if (oldVal !== newVal && d4.s.value.index < 0) {
          setSelectDisplay(d4, d4.s.value.index);
        }
        break;
    }
  }
  connectedCallback() {
    const d4 = this;
    if (!d4.classList.contains('d4-initialize')) this.#create();
  }
  #create() {
    this.s = {};
    this.__events__ = {};
    if (!this.hasAttribute('d4-status')) {
      this.setAttribute('d4-status', 'close');
    }
    if (!this.hasAttribute('d4-value')) {
      this.setAttribute('d4-value', '');
    }
    this.#mount();
  }
  #mount() {
    this.s.childDom = this.childNodes;
    this.s.template = createTemplate(this);
    this.innerHTML = '';
    this.append(this.s.template);
    this.#init();
  }
  #init() {
    this.s.allLi = this.querySelectorAll('.dropdown-list > li');
    this.s.selectDisplayEl = this.querySelector('.select-display');
    this.s.dropdownEl = this.querySelector('.dropdown');
    this.s.selectType = this.hasAttribute('multiple') ? 'multiple' : 'single';
    const value = this.getAttribute('d4-value');
    switch (this.s.selectType) {
      case 'single':
        const valueLi = this.querySelector(`.dropdown-list > li[data-option="${value}"]`);
        if (isElementExist(valueLi)) {
          valueLi.classList.add('active');
          this.s.activeLi = valueLi;
          this.s.value = {
            index: [...this.s.allLi].indexOf(valueLi),
            id: value,
            el: valueLi,
          };
        } else {
          this.s.activeLi = undefined;
          this.s.value = {
            index: -1,
            id: undefined,
            el: undefined,
          };
        }
        break;
      case 'multiple':
        const d4 = this;
        const valueLiArray = [];
        value.split(',').forEach((option) => {
          const li = d4.querySelector(`.dropdown-list > li[data-option="${option}"]`);
          if (isElementExist(li)) {
            valueLiArray.push(li);
          }
        });
        if (valueLiArray.length > 0) {
          this.s.value = {
            index: valueLiArray.map((li) => [...this.s.allLi].indexOf(li)),
            id: valueLiArray.map((li) => li.getAttribute('data-option')),
            el: valueLiArray.map((li) => li),
          };
        } else {
          this.s.value = {
            index: [],
            id: undefined,
            el: undefined,
          };
        }
        break;
    }
    setSelectDisplay(this, this.s.value.index);
    loadCityData(this);
    this.#event();
    this.classList.add('d4-initialize');
  }
  #event() {
    const d4 = this;

    // 下拉選單開關
    const dropdownToggle = () => {
      d4.addEventListener('click', function (e) {
        e.stopPropagation();
        const status = d4.getAttribute('d4-status');
        switch (status) {
          case 'open':
            d4.close();
            break;
          case 'close':
            d4.open();
            break;
        }
      });
    };

    // 綁定卷軸
    const bindScrollbar = (d4 = this) => {
      const scroller = d4.querySelector('.dropdown-scroller');
      // 綁定卷軸套件
      d4.__scroller__ = OverlayScrollbars(scroller, {
        callbacks: {
          onInitialized() {
            scroller
              .querySelector('.os-viewport')
              .classList.remove('os-viewport-native-scrollbars-overlaid');
            scroller
              .querySelector('.os-viewport')
              .classList.add('os-viewport-native-scrollbars-invisible');
          },
        },
      });
    };

    // 顯示選的選項
    const selectOption = (d4 = this) => {
      const citySelect = d4.classList.contains('city');
      d4.s.allLi = d4.querySelectorAll('.dropdown-list > li');
      d4.s.allLi.forEach((option) => {
        option.addEventListener('click', function (e) {
          const clickOption = this;
          const clickIndex = [...d4.s.allLi].indexOf(clickOption);
          // 判斷單選或複選
          switch (d4.s.selectType) {
            // 單選
            case 'single':
              d4.setAttribute('d4-value', clickOption.getAttribute('data-option'));
              // 選擇縣市
              if (citySelect) {
                const city = option.textContent.trim();
                const distSelectEl = getElement(d4.getAttribute('dist-select'));
                if (distSelectEl) {
                  distSelectEl.querySelector('.dropdown-list').textContent = '';
                  setSelectDisplay(distSelectEl, -1);
                  cityData[city].forEach((dist, index) => {
                    const li = document.createElement('li');
                    li.textContent = dist[0];
                    li.setAttribute('data-option', dist[0]);
                    distSelectEl.querySelector('.dropdown-list').append(li);
                  });
                  selectOption(distSelectEl);
                }
              }
              setSelectDisplay(d4, clickIndex);
              break;
            // 複選
            case 'multiple':
              e.stopPropagation();
              clickOption.classList.toggle('active');
              setSelectDisplay(d4, clickIndex);
              break;
          }
          detectSync(d4);
        });
      });
    };

    // 篩選功能
    const filterHandler = () => {
      if (d4.classList.contains('filter')) {
        d4.querySelector('.filter-bar').addEventListener('click', function (e) {
          e.stopPropagation();
        });
        d4.querySelector('.filter-input').addEventListener('input', function () {
          const val = this.value.toUpperCase();
          d4.s.allLi.forEach((el) => {
            if (!el.textContent.toUpperCase().includes(val)) el.style.display = 'none';
            else el.style.display = 'block';
          });
        });
      }
    };

    // 複選標籤移除
    const removeTag = () => {
      if (d4.s.selectType === 'single') return;
      d4.s.selectDisplayEl.addEventListener('click', function (e) {
        if (e.target.classList.contains('select-display')) return;
        const optionBtn = e.target.classList.contains('option-btn')
          ? e.target
          : e.target.parentElement;
        if (optionBtn.contains(e.target)) {
          e.stopPropagation();
          if (e.target.classList.contains('remove-icon')) {
            const tag = e.target.parentElement;
            const id = tag.getAttribute('data-option');
            d4.s.dropdownEl
              .querySelector(`.dropdown-list > li[data-option="${id}"]`)
              .classList.remove('active');
            d4.s.activeLi = d4.querySelectorAll('.dropdown-list > li.active');
            e.target.parentElement.remove();
            const activeLiArray = [...d4.s.activeLi];
            d4.s.value = activeLiArray.map((option) => {
              const obj = {
                index: [...d4.s.allLi].indexOf(option),
                id: option.getAttribute('data-option'),
                el: option,
              };
              return obj;
            });
            d4.s.activeLi = activeLiArray;
            const valueArray = activeLiArray.map((option) => option.getAttribute('data-option'));
            d4.setAttribute('d4-value', valueArray.join());
            if (activeLiArray.length <= 0) {
              d4.s.selectDisplayEl.textContent = d4.getAttribute('d4-placeholder');
            }
          }
        }
      });
    };
    dropdownToggle();
    bindScrollbar();
    selectOption();
    filterHandler();
    removeTag();
  }
  open() {
    const d4 = this;
    const dropdownHeight = () => {
      let total = 0;
      d4.querySelectorAll('.dropdown > *').forEach((el) => (total += el.clientHeight));
      return total;
    };
    closeAllDropdown();
    d4.setAttribute('d4-status', 'open');
    d4.s.dropdownEl.style.cssText = `
      height: ${dropdownHeight()}px;
      z-index: 2;
    `;
    if (d4.s.selectType === 'single') {
      const transitionEndHandler = () => {
        const scroller = d4.querySelector('.dropdown-scroller');
        // 捲動到active的選項
        const scrollToActive = () => {
          if (d4.__scroller__ && isElementExist(d4.s.activeLi)) {
            const halfActiveLiHeight = d4.s.activeLi.clientHeight / 2;
            const offsetTop = d4.s.activeLi.offsetTop;
            const scroll =
              offsetTop - scroller.clientHeight / 2 + halfActiveLiHeight > 0
                ? offsetTop - scroller.clientHeight / 2 + halfActiveLiHeight
                : 0;
            d4.__scroller__.scroll(scroll, 300);
          }
        };
        scrollToActive();
        d4.s.dropdownEl.removeEventListener('transitionend', transitionEndHandler);
      };
      d4.s.dropdownEl.addEventListener('transitionend', transitionEndHandler);
    }
    return this;
  }
  close() {
    this.setAttribute('d4-status', 'close');
    this.s.dropdownEl.style.cssText = 'height: 0px;';
    return this;
  }
  scrollTo(scroll) {
    this.__scroller__.scroll(scroll, 300);
  }
}

Object.assign(Dropdown4.prototype, SHARED);

// define custom element
if (!customElements.get('dropdown-el')) {
  customElements.define('dropdown-el', Dropdown4);
}

export default Dropdown4;
