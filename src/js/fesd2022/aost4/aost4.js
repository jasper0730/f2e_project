import OPTIONS from './options';
import SHARED from './../shared/shared';
import {
  isString,
  isElementExist,
  getElement,
  getAllElements,
  createUid,
  getTransformY,
} from './../shared/utils';

// when multiple element enter view
const enterView = (elements, scroller) => {
  // const interElements = Object.values(elements)
  if (!elements.length) return;

  const viewHeight =
    scroller === window ? scroller.innerHeight : scroller.getBoundingClientRect().height;
  const viewTop = scroller === window ? 0 : scroller.getBoundingClientRect().top;

  interElements.forEach((el) => {
    const { class: className, start } = el.aost;
    const transY = getTransformY(el);
    if (!el.classList.contains(className)) {
      const rect = el.getBoundingClientRect();
      const { top, bottom } = rect;
      const isEnterView =
        top - transY - viewTop < viewHeight * (1 - start / 100) && bottom - transY - viewTop > 0;
      if (isEnterView) {
        el.classList.add(className);
      }
    }
  });
};

// when a element leave view
const leaveView = (el, entry) => {
  if (!el) return;

  const { class: className, repeat } = el.aost;
  const { height: viewHeight, top: viewTop } = entry.rootBounds;
  const { top, bottom } = entry.boundingClientRect;
  const transY = getTransformY(el);
  const shouldRemove =
    (repeat === 'down' && top - transY - viewTop >= viewHeight) ||
    (repeat === 'up' && bottom - transY - viewTop <= 0) ||
    repeat === true;

  if (shouldRemove) {
    el.classList.remove(className);
  }
};

// use mirror when first init
const useMirror = (entry) => {
  const { target: el } = entry;
  const { top: viewTop } = entry.rootBounds;
  const { bottom } = entry.boundingClientRect;
  const { class: className, repeat } = el.aost;
  const transY = getTransformY(el);
  const shouldAdd = bottom - transY - viewTop <= 0 && (repeat === false || repeat === 'down');

  if (shouldAdd) {
    el.classList.add(className);
  }
};

//
const interaction = (scrollElement, elements) => {
  const viewHeight =
    scrollElement === window
      ? scrollElement.innerHeight
      : scrollElement.getBoundingClientRect().height;
  const viewTop = scrollElement === window ? 0 : scrollElement.getBoundingClientRect().top;

  elements.forEach((el) => {
    const { class: className, delay, start, end, repeat, instance } = el.aost;
    // if (!repeat && el.classList.contains(className)) return;

    const { top, bottom } = el.getBoundingClientRect();
    const startTrigger = viewHeight * (start / 100);
    const endTrigger = viewHeight * (end / 100);
    const isEntered = top - viewTop <= startTrigger && bottom - viewTop >= endTrigger;

    // in view
    if (isEntered) {
      setTimeout(() => {
        instance.emit('enter', el);
        el.classList.add(className);
      }, delay);
    }
    // out of view
    else {
      const shouldRemove =
        (el.classList.contains(className) && repeat === 'down' && top - viewTop >= startTrigger) ||
        (repeat === 'up' && bottom - viewTop <= endTrigger) ||
        repeat === true;
      setTimeout(() => {
        instance.emit('leave', el);
        if (shouldRemove) el.classList.remove(className);
      }, delay);
    }
  });
};

class Aost4 {
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
    const { scroller } = options;
    const scrollElement =
      scroller === window || !isElementExist(scroller) ? window : getElement(scroller);
    // let mirrored = mirror

    this.eventHandler = () => {
      interaction(scrollElement, elements);
    };

    elements.forEach((el) => {
      const repeatType = el.getAttribute('data-aost-repeat');
      el.aost = {};
      // el.aost.id = createUid()
      el.aost.class = el.getAttribute('data-aost-class') || options.class;
      el.aost.delay = parseInt(el.getAttribute('data-aost-delay')) || options.delay;
      el.aost.start = parseInt(el.getAttribute('data-aost-start')) || options.start;
      el.aost.end = parseInt(el.getAttribute('data-aost-end')) || options.end;
      const detectRepeat = function () {
        if (repeatType === 'up' || repeatType === 'down') return repeatType;
        else {
          if (repeatType !== null) {
            if (repeatType === 'true') return true;
            else if (repeatType === 'false') return false;
            else return options.repeat;
          } else {
            return options.repeat;
          }
        }
      };
      el.aost.repeat = detectRepeat();
      el.aost.instance = this;
    });

    const { eventHandler } = this;
    eventHandler();
    scrollElement.aost = {};
    scrollElement.aost.eventHandler = eventHandler;
    scrollElement.addEventListener('scroll', scrollElement.aost.eventHandler);
    // this.emit('afterInit')
  }

  destroy(removeShow) {
    const { elements, options, observer, __inters__ } = this;
    if (!elements) return this;

    const { scroller } = options;
    const scrollElement =
      scroller === window || !isElementExist(scroller) ? window : getElement(scroller);

    if (scrollElement.aost) {
      scrollElement.removeEventListener('scroll', scrollElement.aost.eventHandler);
      delete scrollElement.aost;
    }

    elements.forEach((el) => {
      if (!el.aost) return;

      const { class: className } = el.aost;
      if (removeShow) el.classList.remove(className);
      // observer.unobserve(el)

      delete el.aost;
    });

    // const interKeys = Object.keys(__inters__);
    // if (interKeys.length) {
    //   interKeys.forEach((id) => {
    //     delete __inters__[id];
    //   });
    // }

    return this;
  }

  update(removeShow) {
    this.destroy(removeShow).#create();

    return this;
  }
}

Object.assign(Aost4.prototype, SHARED);

export default Aost4;
