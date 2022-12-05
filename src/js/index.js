// 卷軸
import OverlayScrollbars from 'overlayscrollbars';
import 'overlayscrollbars/css/OverlayScrollbars.min.css';

const index = {}

index.categorySlide = function () {
  
}

Modal4.defineMethods({
  useOpen(modal) {
    const targetModal = $(modal)
    const target = targetModal.find('.item')[1]
    const scroller = targetModal.find('.os-viewport')[0];
    const modalAost = new Aost4('modern-modal[data-modal-id="project-modal"] [data-aost]', {
      scroller: scroller,
    });

    Anchor4.run({
      target: target,
      container: scroller,
      gap: 100,
      on: {
        afterScroll() {
          alert('我只是say個hi')
        }
      }
    })
  }
})



$(() => {
})

