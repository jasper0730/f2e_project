import {
  isFunction
} from './utils'

export default {
  on(events, handler) {
    if (!isFunction(handler)) return this;

    const { __events__ } = this

    events.split(' ').forEach(evt => {
      if (!__events__[evt]) __events__[evt] = []
      __events__[evt].push(handler)
    })

    return this
  },

  off(events, handler) {
    const { __events__ } = this

    events.split(' ').forEach(evt => {
      if (typeof handler === 'undefined') __events__[evt] = []
      else if (__events__[evt]) {
        __events__[evt].forEach((evtHandler, index) => {
          if (evtHandler === handler) __events__[evt].splice(index, 1)
        })
      }
    })

    return this
  },

  once(events, handler) {
    if (!isFunction(handler)) return this;

    const onceHandler = (...args) => {
      this.off(events, onceHandler)
      handler.apply(this, args)
    }

    return this.on(events, onceHandler)
  },

  emit(...args) {
    const { __events__ } = this

    const event = args[0]
    const data = args.slice(1, args.length)

    if (!__events__[event]) return this

    __events__[event].forEach(handler => {
      if (isFunction(handler)) handler.apply(this, data)
    })

    return this
  }
}