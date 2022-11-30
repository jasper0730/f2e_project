import ModernModal from './modernModal';
import OPTIONS from './options';
import SHARED from './../shared/shared';
import {
  isString,
  isElementExist,
  isFunction,
  getElement,
  getAllElements,
  toHTMLElement,
  jsonParse,
  warn,
} from './../shared/utils';

// define custom element
if (!customElements.get('modern-modal')) {
  customElements.define('modern-modal', ModernModal);
}

const { MODALS } = window;

// use methods (for instance)
const useMethod = (instance, name, ...args) => {
  if (!name) return;
  const handler = instance[name];

  if (handler && isFunction(handler)) {
    handler.apply(instance, args);
  }
};

// use function (for static)
const useFunction = (handler, ...args) => {
  if (handler && isFunction(handler)) {
    handler.apply(Modal4, args);
  }
};

// dispatch modal
const dispatchModal = (options, instance) => {
  const { target } = options;

  const modal = MODALS[target] || getElement(options.target);

  if (modal) useModal(options, instance);
  if (!modal) useFetch(options, instance);
};

//
const useModal = (options, instance) => {
  const { target, action, on, e } = options;

  const modal = MODALS[target] || getElement(options.target);
  const events = ['open', 'close', 'destroy'];

  // trigger events
  events.forEach((name) => {
    modal.once(name, () => {
      if (instance) {
        instance.emit(name, modal, e);
        useMethod(instance, on[name], modal, e);
      }
      if (!instance) {
        useFunction(on[name], modal);
      }
    });
  });

  // action
  switch (action) {
    case 'open':
      modal.open();
      break;
    case 'close':
      modal.close();
      break;
    case 'destroy':
      modal.destroy();
      break;
    default:
      const state = modal.getAttribute(':state');
      if (state === 'close') modal.open();
      if (state === 'open') modal.close();
      break;
  }
};

// fetch modal from files
const useFetch = async (options, instance) => {
  const { target, route, container, on, e } = options;

  if (!route) return warn('cannot find target or data-modal-route is not defined');

  let modal;

  // trigger event handler
  const useEvent = (name, ...args) => {
    if (instance) {
      instance.emit(name, ...args);
      useMethod(instance, on[name], ...args);
    }
    if (!instance) {
      useFunction(on[name], ...args);
    }
  };

  // get response
  fetch(route)
    .then((res) => {
      // trigger success event
      useEvent('success', e);

      return res.text();
    })
    .then((data) => {
      const doms = toHTMLElement(data); /** modern-modal is initialized in this state */
      const containerElement = getElement(container) || getElement(OPTIONS.SETTINGS.container);

      // append dom
      [...doms].forEach((dom) => {
        containerElement.append(dom);
      });

      const modal = MODALS[target] || getElement(options.target);

      // trigger complete event
      useEvent('complete', modal);
      useModal(options, instance);
    })
    .catch((error) => {
      // trigger error event
      useEvent('error', error);
    });
};

class Modal4 {
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
    const { elements, options } = this;

    elements.forEach((el) => {
      el.modal = {};
      el.modal.instance = this;
      el.modal.eventHandler = this.#trigger;
      el.modal.defaultOptions = options;
      el.addEventListener('click', el.modal.eventHandler);
    });

    this.emit('init');
  }

  #trigger(e) {
    /** the keyword `this` in this method is pointed to the click target */
    const { defaultOptions, eventHandler, instance } = this.modal;

    const ons = jsonParse(this.getAttribute('data-modal-on'));
    if (ons && typeof ons !== 'object') warn('data-modal-on must be a json string.');

    const options = {
      target: this.getAttribute('data-modal-target') || defaultOptions.target,
      action: this.getAttribute('data-modal-action') || defaultOptions.action,
      route: this.getAttribute('data-modal-route') || defaultOptions.route,
      container: this.getAttribute('data-modal-container') || defaultOptions.container,
      on: ons && typeof ons === 'object' ? ons : {},
      e,
    };

    // prevent multiple click
    this.removeEventListener('click', eventHandler);
    setTimeout(() => {
      this.addEventListener('click', eventHandler);
    }, 200);

    // get modal
    dispatchModal(options, instance);
  }

  destroy() {
    const { elements } = this;

    elements.forEach((el) => {
      if (!el.modal) return;

      el.removeEventListener('click', el.modal.eventHandler);
      delete el.modal;
    });

    return this;
  }

  update() {
    this.destroy().#create();

    this.emit('update');

    return this;
  }

  /** static method 'open' */
  static open(options) {
    const { SETTINGS } = OPTIONS;
    const openOptions = Object.assign({}, SETTINGS, { on: {} }, options);
    dispatchModal(openOptions);
  }

  /** static method 'defineMethods' */
  static defineMethods(obj) {
    if (!Modal4.prototype.__methods__) Modal4.prototype.__methods__ = {};
    const methods = Modal4.prototype.__methods__;

    for (const [k, v] of Object.entries(obj)) {
      if (isFunction(v)) methods[k] = v;
    }

    Object.assign(Modal4.prototype, Modal4.prototype.__methods__);
  }
}

Object.assign(Modal4.prototype, SHARED);

export default Modal4;
