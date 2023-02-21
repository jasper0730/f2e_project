// 卷軸
// import OverlayScrollbars from 'overlayscrollbars';
// import 'overlayscrollbars/css/OverlayScrollbars.min.css';

const plugins = {}

plugins.modal4 = function () {
  Modal4.defineMethods({
    useOpen(modal) {
      const targetModal = $(modal)
      const target = targetModal.find('.block')[1]
      const scroller = targetModal.find('.os-viewport')[0];
      const plugin = {
        modalAost: new Aost4('modern-modal[data-modal-id="project-modal"] [data-aost]', {
          scroller: scroller,
        }),
      }
      plugins.anchor4(target, scroller)
      plugins.imagePreview('.upload-btn')
    }
  })
}

plugins.imagePreview = function (target) {
  const option = {
    on: {
      changeAfter() {
        alert('success')
      },
      overLimit() {
        alert('error')
      }
    },
    sizeLimit: 1
  }
  _g.imagePreview(target, option);
}

plugins.anchor4 = function (target, scroller) {
  Anchor4.run({
    target: target,
    container: scroller,
    gap: 150,
    on: {
      afterScroll() {
        alert('我只是say個hi')
      }
    }
  })
}

plugins.dropdown4 = function () {
  const sayHi = document.querySelector('.say-hi')
  sayHi.on('change',function(){
    const self = $(this)
    self.siblings('.why').attr('d4-placeholder','下拉選單B')
  });
}

plugins.categorySlider = function () {
  const option = {
    breakpoint: 1200
  }
  _g.categorySlider('.category-slider', option);
}

plugins.all = function () {
  this.modal4();
  this.categorySlider();
  this.imagePreview();
  this.dropdown4();
}





$(() => {
  plugins.all()
})

