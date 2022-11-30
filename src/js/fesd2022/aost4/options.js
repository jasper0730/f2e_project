export default {
  SETTINGS: {
    scroller: window,
    class: 'aost-show',
    delay: 0,
    start: 80,
    end: 0,
    mirror: false,
    repeat: false, // false | true | 'up' | 'down'
    direction: 'vertical', // 'vertical' | 'horizontal'
    breakpoints: {
      1160: 'data-aost-offset-1160',
      1024: 'data-aost-offset-1024',
      600: 'data-aost-offset-600',
    },
  },
  EVENTS: {
    init: null,
    enter: null,
    leave: null
  }
}