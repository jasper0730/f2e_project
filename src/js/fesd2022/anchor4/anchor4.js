import OPTIONS from './options'
import SHARED from './../shared/shared'
import {
  isString,
  isElementExist,
  isFunction,
  getElement,
  getAllElements
} from './../shared/utils'


const ease = {
  easeInOutCirc(t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
  },
  easeInQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b
  },
  easeOutQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b
  },
}

// scroll handler
const scrollTo = (options, instance) => {
  const { target, container, spacer, speed, gap, easing, direction } = options

  const isHorizontal = direction === 'horizontal'
  const scrollDirection = isHorizontal ? 'scrollLeft' : 'scrollTop'
  const rectPosition = isHorizontal ? 'left' : 'top'
  const rectSpace = isHorizontal ? 'width' : 'height'

  const containerEle = isElementExist(container) ? getElement(container) : document.scrollingElement
  const start = containerEle[scrollDirection]
  const targetPoint = isElementExist(target) ? getElement(target).getBoundingClientRect()[rectPosition] : 0 - start
  const spacerGap = isElementExist(spacer) ? getElement(spacer).getBoundingClientRect()[rectSpace] : 0
  const change = targetPoint - gap - spacerGap
  const increment = 15
  let currentTime = 0

  if (change === 0) return;

  const emitEvent = (eventName) => {
    const targetEle = getElement(target)
    if (instance) instance.emit(eventName, targetEle)
    if (!instance && options.on) {
      if (isFunction(options.on[eventName])) options.on[eventName](targetEle)
    }
  }

  emitEvent('beforeScroll')

  const animateScroll = () => {
    currentTime += increment
    const val = ease[easing](currentTime, start, change, speed)
    containerEle[scrollDirection] = val
    if(currentTime < speed) requestAnimationFrame(animateScroll)
    if(currentTime >= speed) emitEvent('afterScroll')
  }

  requestAnimationFrame(animateScroll)
}


// class Anchor4
class Anchor4 {
  constructor(el, options = {}) {
    this.__storage__ = {
      el,
      options
    }

    this.#create()
  }

  #create() {
    const { el, options } = this.__storage__
    if (!isString(el) || !isElementExist(el)) return;

    const { SETTINGS, EVENTS } = OPTIONS

    this.elements = getAllElements(el)
    this.options = Object.assign({}, SETTINGS, options)
    this.__events__ = Object.assign({}, EVENTS)

    if (this.options.on) {
      for (const [k, v] of Object.entries(this.options.on)) {
        this.__events__[k] = [v]
      }
    }

    this.#init()
  }

  #init() {
    const { elements, options } = this

    elements.forEach(el => {
      el.anchor = {}
      el.anchor.instance = this
      el.anchor.eventHandler = this.#trigger
      el.anchor.defaultOptions = options
      el.addEventListener('click', el.anchor.eventHandler)
    })

    this.emit('afterInit')
  }

  #trigger() {
    /** the keyword `this` in this method is pointed to the click target */
    const { defaultOptions, eventHandler, instance } = this.anchor

    const options = {
      target: this.getAttribute('data-anchor-target') || defaultOptions.target,
      container: this.getAttribute('data-anchor-container') || defaultOptions.container,
      spacer: this.getAttribute('data-anchor-spacer') || defaultOptions.spacer,
      gap: parseInt(this.getAttribute('data-anchor-gap') || defaultOptions.gap),
      speed: parseInt(this.getAttribute('data-anchor-speed')) || defaultOptions.speed,
      delay: parseInt(this.getAttribute('data-anchor-delay')) || defaultOptions.delay,
      easing: this.getAttribute('data-anchor-easing') || defaultOptions.easing,
      direction: this.getAttribute('data-anchor-direction') || defaultOptions.direction
    }

    // prevent multiple click
    this.removeEventListener('click', eventHandler)
    setTimeout(() => { this.addEventListener('click', eventHandler) }, options.speed)

    // do scroll
    setTimeout(() => { scrollTo(options, instance) }, options.delay)
  }

  destroy() {
    const { elements } = this

    this.emit('beforeDestroy')

    elements.forEach(el => {
      if (!el.anchor) return;

      el.removeEventListener('click', el.anchor.eventHandler)
      delete el.anchor
    })

    return this
  }

  update() {
    this.destroy().#create()

    this.emit('afterUpdate')

    return this
  }

  static run(options) {
    const { SETTINGS } = OPTIONS
    const newOptions = Object.assign({}, SETTINGS, options)

    setTimeout(() => { scrollTo(newOptions) }, newOptions.delay)
  }

  static url(options) {
    const { SETTINGS } = OPTIONS

    const targetStr = window.location.search || window.location.hash
    const targetName = targetStr.split('?').pop()
    const target = document.querySelector(`[data-anchor-id="${targetName}"]`)

    if (!target) return;

    const newOptions = Object.assign({}, SETTINGS, options, { target })

    setTimeout(() => { scrollTo(newOptions) }, newOptions.delay)
  }
}

Object.assign(Anchor4.prototype, SHARED)

export default Anchor4