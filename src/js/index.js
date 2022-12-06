// 卷軸
import OverlayScrollbars from 'overlayscrollbars';
import 'overlayscrollbars/css/OverlayScrollbars.min.css';

const index = {}

Modal4.defineMethods({
  useOpen(modal) {
    const targetModal = $(modal)
    const target = targetModal.find('.block')[1]
    const scroller = targetModal.find('.os-viewport')[0];
    const plugin = {
      modalAost: new Aost4('modern-modal[data-modal-id="project-modal"] [data-aost]', {
        scroller: scroller,
      }),
      modalVideo: new Video4('[video-target]'),
      categorySlider(selector, options) {
        new CategorySlider(selector, options);
      },
    }

    // Anchor4.run({
    //   target: target,
    //   container: scroller,
    //   gap: 150,
    //   on: {
    //     afterScroll() {
    //       alert('我只是say個hi')
    //     }
    //   }
    // })
  }
})





$(() => { })

