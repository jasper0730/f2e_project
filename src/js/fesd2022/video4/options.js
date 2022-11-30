export default {
  SETTINGS: {
    videoId: null,
    videoType: null,
    videoAutoplay: 'off',
    videoMode: 'onBox',
    videoButton: '.playButton',
    videoCover: 'on',
    videoLayoutNo: 0,
    videoTarget: 'video-template',
    videoTargetRoute: './video4_lightbox.html',
  },
  ATTRS: {
    id: 'video-id',
    type: 'video-type',
    autoplay: 'video-autoplay',
    hash: 'vimeo-hash',
  },
  EVENTS: {
    init: null,
    afterInit: null,
    beforeDestroy: null,
    afterUpdate: null,
  },
  // video4 target 內放置結構 index 對應 videoLayoutNo
  LAYOUT: ['<div class="playButton"></div><div class="overlay"></div>'],
  // videoPlayer customElements 內結構
  TEMPLATE() {
    return `
      <div class="player-container">
          <div class="player-wrapper"></div>
      </div>
      `;
  },
};
