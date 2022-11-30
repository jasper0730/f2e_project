import 'overlayscrollbars/css/OverlayScrollbars.min.css';
import OverlayScrollbars from 'overlayscrollbars';
// self
import OPTIONS from './options';
import SHARED from './../shared/shared';
import { createUid, warn } from './../shared/utils';

if (!window.MODALS) window.MODALS = {};

const { MODALS } = window;

// create template method
const createTemplate = (el) => {
  const { TEMPLATE } = OPTIONS;
  const { childDom } = el;
  const container = document.createElement('div');
  container.innerHTML = TEMPLATE(el.getAttribute('data-modal-template-setting'));

  const content = container.querySelector('.modal-content');
  [...childDom].forEach((child) => {
    content.append(child);
  });

  return container.children[0];
};

// class
class ModernModal extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [':state'];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    switch (attr) {
      case ':state':
        this.#stateControl(newVal);
        break;
    }
  }

  connectedCallback() {
    this.#create();
  }

  #create() {
    const { ATTRS } = OPTIONS;

    this.__events__ = {};

    if (!this.getAttribute(':state')) {
      this.setAttribute(':state', 'close');
    }

    const id = this.getAttribute(ATTRS.id) || createUid();
    if (!this.getAttribute(ATTRS.id)) {
      warn(`modern-modal needs a ${ATTRS.id} attribute with a unique id.`);
      this.setAttribute(ATTRS.id, id);
    }

    if (MODALS[id]) warn(`the ${ATTRS.id} "${id}" is already be used.`);
    MODALS[id] = this;

    this.#mount();
  }

  #mount() {
    this.childDom = this.childNodes;
    this.template = createTemplate(this);

    this.innerHTML = '';
    this.append(this.template);

    this.#init();
  }

  #init() {
    const scroller = this.querySelector('.modal-scroller');

    this.__scroller__ = OverlayScrollbars(scroller, {
      overflowBehavior:{
        x: 'hidden'
      }
    });

    this.#event();
  }

  #event() {
    const $self = this
    const { close, destroy } = OPTIONS.ATTRS;

    $self.querySelectorAll(`[${close}]`)?.forEach(el => {
      el.addEventListener('click', function() {
        const closeAttr = this.getAttribute(close);
        const closeTarget = closeAttr && MODALS[closeAttr] ? MODALS[closeAttr] : $self;
        closeTarget.close();
      });
    });

    $self.querySelectorAll(`[${destroy}]`)?.forEach(el => {
      el.addEventListener('click', function() {
        const destroyAttr = this.getAttribute(destroy);
        const destroyTarget = destroyAttr && MODALS[destroyAttr] ? MODALS[destroyAttr] : $self;
        destroyTarget.destroy();
      });
    });

    $self.querySelector('[stop-propagation]')?.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  #stateControl(state) {
    const { __scroller__ } = this;

    if (state === 'open') {
      this.style.display = 'block';
      if (__scroller__) __scroller__.scroll(0);
      setTimeout(() => {
        this.classList.add('show');
        this.emit('open');
      }, 100);
    }
    if (state === 'close') {
      if (!this.classList.contains('show')) return;
      this.classList.remove('show');
      const transitionEndHandler = () => {
        this.style.removeProperty('display');
        this.emit('close');
        this.removeEventListener('transitionend', transitionEndHandler);
      };
      this.addEventListener('transitionend', transitionEndHandler);
    }
    if (state === 'destroy') {
      this.classList.remove('show');
      const transitionEndHandler = () => {
        const { ATTRS } = OPTIONS;
        const id = this.getAttribute(ATTRS.id);
        this.emit('close');
        this.remove();
        this.emit('destroy');
        if (MODALS[id]) delete MODALS[id];
      };
      this.addEventListener('transitionend', transitionEndHandler);
    }
  }

  open() {
    this.setAttribute(':state', 'open');

    return this;
  }

  close() {
    this.setAttribute(':state', 'close');

    return this;
  }

  destroy() {
    this.setAttribute(':state', 'destroy');

    return this;
  }
}

// install on and emit
Object.assign(ModernModal.prototype, SHARED);

export default ModernModal;
