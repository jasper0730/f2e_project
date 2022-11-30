
import OPTIONS from './options'
import SHARED from './../shared/shared'
import {
  warn,
} from './../shared/utils'

'use strict';

if (!window.MODALS) window.MODALS = {}

const { MODALS } = window

// create template method
const createTemplate = (el) => {
  const { TEMPLATE } = OPTIONS
  const { childDom } = el
  const container = document.createElement('div')
  container.innerHTML = TEMPLATE()

  const content = container.querySelector('.modal-content');
  [...childDom].forEach(child => {
    content.append(child)
  })

  return container.children[0]
}

// class
class videoPlayer extends HTMLElement {
  constructor() {
    super()

    this.#create()
  }

  static get observedAttributes() {
    return [':state']
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    switch (attr) {
      case ':state':
        this.#stateControl(newVal)
        break;
    }
  }

  #create() {
    const { ATTRS } = OPTIONS

    this.__events__ = {}

    // if (!this.getAttribute(':state')) {
    //   this.setAttribute(':state', 'close')
    // }

    if (!this.getAttribute(ATTRS.id)) {
      warn(`video-render needs a ${ATTRS.id} attribute to creat player.`)
      return
    }

    this.videoId = this.getAttribute(ATTRS.id);
    this.videoType = this.getAttribute(ATTRS.type);
    this.autoplay = this.getAttribute(ATTRS.autoplay);

    this.#mount()
  }

  #mount() {
    this.childDom = this.childNodes
    this.template = createTemplate(this)

    this.innerHTML = ''
    this.append(this.template)

    this.#init()
  }

  #init() {
    const { videoType } = this
    let layout = ''

    switch (videoType) {
      case 'youtubeAPI':
        // this.#youtubeAPI();
        break;
      case 'youtube':
        layout = this.#youtube();
        break;
      case 'youkuAPI':
        // this.#youkuAPI();
        break;
      case 'youku':
        layout = this.#youku();
        break;
      case 'vimeo':
        layout = this.#vimeo();
        break;
      case 'videojs':
        // this.#videoJs();
        break;
      default:
        break;
    }

    this.querySelector('.player-wrapper').insertAdjacentHTML('afterbegin', layout)

    // this.#event()
  }

  // youtube iframe
  #youtube() {
    const { videoId, autoplay } = this;
    console.log('debug', this, autoplay)

    return `<iframe src="https://www.youtube.com/embed/${videoId}?rel=0&${autoplay === 'on' ? 'autoplay=1' : ''}&mute=1&loop=1&enablejsapi=1" frameborder="0" allow="${autoplay === 'on' ? 'autoplay;' : ''} encrypted-media; gyroscope; picture-in-picture;"></iframe>`;
  }

  // youku iframe
  #youku() {
    const { videoId, autoplay } = this;

    return `<iframe src="https://player.youku.com/embed/${videoId}?rel=0&${autoplay === 'on' ? 'autoplay=1' : ''}" frameborder=0 "allowfullscreen"></iframe>`;
  }

  // vimeo iframe
  #vimeo() {
    const { videoId, autoplay, hash } = this;

    return `<iframe src="https://player.vimeo.com/video/${videoId}?h=${hash}&${autoplay === 'on' ? 'autoplay=1' : ''}&loop=1&color=ffffff&title=0&byline=0&portrait=0" frameborder="0" allow="${autoplay === 'on' ? 'autoplay;' : ''} fullscreen; picture-in-picture" allowfullscreen></iframe><script src="https://player.vimeo.com/api/player.js"></script>`;
  }

  #event() {
    const { close, destroy } = OPTIONS.ATTRS

    this.addEventListener('click', function(e) {
      const target = e.target

      if (target.matches(`[${destroy}]`)) {
        const destroyAttr = target.getAttribute(destroy)
        const destroyTarget = destroyAttr && MODALS[destroyAttr] ? MODALS[destroyAttr] : this
        destroyTarget.destroy()
      }
      else if (target.matches(`[${close}]`)) {
        const closeAttr = target.getAttribute(close)
        const closeTarget = closeAttr && MODALS[closeAttr] ? MODALS[closeAttr] : this
        closeTarget.close()
      }
    })
  }

  #stateControl(state) {
    const { __scroller__ } = this

    if (state === 'open') {
      this.style.display = 'block'
      __scroller__.scroll(0)
      setTimeout(() => {
        this.classList.add('show')
        this.emit('open')
      }, 100)
    }
    if (state === 'close') {
      this.classList.remove('show')
      const transitionEndHandler = () => {
        this.style.removeProperty('display')
        this.emit('close')
        this.removeEventListener('transitionend', transitionEndHandler)
      }
      this.addEventListener('transitionend', transitionEndHandler)
    }
    if (state === 'destroy') {
      this.classList.remove('show')
      const transitionEndHandler = () => {
        const { ATTRS } = OPTIONS
        const id = this.getAttribute(ATTRS.id)
        this.emit('close')
        this.remove()
        this.emit('destroy')
        if (MODALS[id]) delete MODALS[id]
      }
      this.addEventListener('transitionend', transitionEndHandler)
    }
  }

  play() {
    const { videoType } = this

    switch (videoType) {
      case 'youtubeAPI':
        // this.#youtubeAPI();
        break;
      case 'youtube':
        this.querySelector('iframe').contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
        break;
      case 'youkuAPI':
        // this.#youkuAPI();
        break;
      case 'youku':
        layout = this.#youku();
        break;
      case 'vimeo':
        this.querySelector('iframe').contentWindow.postMessage(JSON.stringify({ value: 'true', method: 'play' }), '*');
        break;
      case 'videojs':
        // this.#videoJs();
        break;
      default:
        break;
    }
  }

  pause() {
    const { videoType } = this

    // this.querySelector('video').pause();
    switch (videoType) {
      case 'youtubeAPI':
        // this.#youtubeAPI();
        break;
      case 'youtube':
        this.querySelector('iframe').contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
        break;
      case 'youkuAPI':
        // this.#youkuAPI();
        break;
      case 'youku':
        layout = this.#youku();
        break;
      case 'vimeo':
        this.querySelector('iframe').contentWindow.postMessage(JSON.stringify({ value: 'true', method: 'pause' }), '*');
        break;
      case 'videojs':
        // this.#videoJs();
        break;
      default:
        break;
    }
  }

  open() {
    this.setAttribute(':state', 'open')

    return this
  }

  close() {
    this.setAttribute(':state', 'close')

    return this
  }

  destroy() {
    this.setAttribute(':state', 'destroy')

    return this
  }
}

// install on and emit
Object.assign(videoPlayer.prototype, SHARED)

export default videoPlayer
