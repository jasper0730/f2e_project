/*
 *  WDD FESD DB
 *  version: 2.0
 *  Update: 2022.08.18
 *  Last Coding: Kevin, 2022.08.18
 *
 */
var _playerVars;
var fesdDB = {
  ver: {
    fesd: {},
    fesdDB: { ver: '1.0', update: '2020.09.28' },
    library: {},
    component: {},
    plugin: {},
  },

  //anchor4
  anchor4: {
    setting: {
      scrollType: 'vertical', //horizon
      marginTop: 0,
      speed: 900,
      easing: 'easeInOutCirc',
    },
  },

  //video4
  video4: {
    setting: {
      // selector: '.',
      // videoId: '',
      videoType: 'youtube',
      playerType: 'onBox', //off只做封面，回傳值到 callback
      playerPlayType: 'click',
      playerLayoutNo: 0,
      playerLayout: '.video4-player',
      playerPlayButton: '.playButton',
      playerCloseButton: '.closeButton',
      coverLayoutSelector: 'img',
      coverLayoutNo: 0,
      // callback: '',
    },
    youtube: {
      setting: {
        width: 560,
        height: 315,
      },
    },
    youtubeAPI: {
      setting: {
        width: 560,
        height: 315,
        playerVars: {
          autoplay: 1, // 在讀取時自動播放影片
          controls: 1, // 在播放器顯示暫停／播放按鈕
          modestbranding: 1, // 隱藏 YouTube Logo
          fs: 1, // 隱藏全螢幕按鈕
          iv_load_policy: 3, // 隱藏影片註解
          autohide: 0, // 當播放影片時隱藏影片控制列
          rel: 0, // 0 = 相關影片為同頻道
          loop: 1, // 讓影片循環播放
          cc_load_policty: 0, // 隱藏字幕
          showinfo: 0, // 隱藏影片標題
          playsinline: 1, // 在iOS的播放器中全屏播放，0:全屏(默認)，1:內嵌
        },
        events: {
          onReady: 'video4_onPlayerReady',
          onStateChange: 'video4_onPlayerStateChange',
        },
      },
    },
    youku: {
      setting: {
        width: 560,
        height: 315,
        autoplay: 1, // 在讀取時自動播放影片
      },
    },
    youkuAPI: {
      setting: {
        styleid: '0',
        client_id: '9dd9df1ce45e9944',
        newPlayer: true,
        autoplay: true,
        events: {
          onPlayerReady: function (e) {},
          onPlayStart: function (e) {},
          onPlayEnd: function (e) {},
        },
      },
    },
    vimeo: {
      setting: {
        width: 560,
        height: 315,
      },
    },
    videojs: {
      setting: {
        width: 560,
        height: 315,
        autoplay: 1, // 在讀取時自動播放影片
      },
    },
    layout: {
      cover: [
        //組別請用逗號 ","，播放器標籤請使用 <video id=""></video>
        //0
        '<div class="overlay" data-cotton><div class="playButton"></div></div>',
      ],
      onPage: ['<div class="overlay"></div><div class="playButton"></div>'],
      onBox: [
        //組別請用逗號 ","，播放器標籤請使用 <video id=""></video>
        //0
        '<div class="video4-player">' +
          '   <div class="coverWrap">' +
          '       <div class="playerCover">' +
          '           <div class="closeButton"></div>' +
          '           <div class="player">' +
          '               <video id=""></video>' +
          '           </div>' +
          '       </div>' +
          '   </div>' +
          '</div>',
      ],
      onBanner: [
        {
          firstName: 'Derek',
          lastName: 'Jeter',
        },
        {
          firstName: 'Jeremy',
          lastName: 'Lin',
        },
      ],
    },
  },

  //swiper4
  swiper4: {
    setting: {
      newName: 'newSwiper',
      slidesPerView: 1, // 從標籤屬性擷取
      spaceBetween: 0,
      slidesPergroup: 1, // 從標籤屬性擷取
      effect: 'slide', // 從標籤屬性擷取
      loop: true, // 從標籤屬性擷取
      autoplay: true, // 從標籤屬性擷取
      direction: 'horizontal',
      observer: true,
      observeParents: true,
      mousewheel: false,
      forceToAxis: true,
      releaseOnEdges: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        // el: '.swiper-scrollbar',
        draggable: true,
      },
      breakpoints: {
        375: { slidesPerView: 1, spaceBetween: 0 },
        768: { slidesPerView: 5, spaceBetween: 0 },
      },
      lazy: {
        loadPrevNext: true,
      },
    },
  },

  //article4
  article4: {
    setting: {},
    video4: {
      setting: {
        // selector: '.',
        // videoId: '',
        videoType: 'youtube',
        playerType: 'onBox', //off只做封面，回傳值到 callback
        playerPlayType: 'click',
        playerLayout: 0,
        playerLayoutName: '.video4-player',
        playerPlayButton: '.playButton',
        playerCloseButton: '.closeButton',
        coverLayoutSelector: 'img',
        coverLayoutObjs: 0,
        // callback: '',
      },
      youtube: {
        setting: {
          width: 560,
          height: 315,
        },
      },
      youtubeAPI: {
        setting: {
          width: 560,
          height: 315,
          playerVars: {
            autoplay: 1, // 在讀取時自動播放影片
            controls: 1, // 在播放器顯示暫停／播放按鈕
            modestbranding: 1, // 隱藏 YouTube Logo
            fs: 1, // 隱藏全螢幕按鈕
            iv_load_policy: 3, // 隱藏影片註解
            autohide: 0, // 當播放影片時隱藏影片控制列
            rel: 0, // 0 = 相關影片為同頻道
            loop: 1, // 讓影片循環播放
            cc_load_policty: 0, // 隱藏字幕
            showinfo: 0, // 隱藏影片標題
            playsinline: 1, // 在iOS的播放器中全屏播放，0:全屏(默認)，1:內嵌
          },
          events: {
            onReady: 'video4_onPlayerReady',
            onStateChange: 'video4_onPlayerStateChange',
          },
        },
      },
      youku: {
        setting: {
          width: 560,
          height: 315,
          autoplay: 1, // 在讀取時自動播放影片
        },
      },
      youkuAPI: {
        setting: {
          styleid: '0',
          client_id: '9dd9df1ce45e9944',
          newPlayer: true,
          autoplay: true,
          events: {
            onPlayerReady: function (e) {},
            onPlayStart: function (e) {},
            onPlayEnd: function (e) {},
          },
        },
      },
      videojs: {
        setting: {
          width: 560,
          height: 315,
          autoplay: 1, // 在讀取時自動播放影片
        },
      },
    },
    swiper4: {
      setting: {
        newName: 'newArticleSwiper', // 從標籤屬性擷取
        slidesPerView: 1, // article4 標準設定，不可更改
        slidesPergroup: 1, // article4 標準設定，不可更改
        breakpoints: {
          // 標準設定，不可重複設定
          // 375: {
          //     slidesPerView: 1,
          //     spaceBetween: 0
          // },
          //  標準設定，不可重複
          // 768: {
          //     slidesPerView: 擷取 HTML data-swiper-num,
          //     spaceBetween: 0
          // }
        },
      },
    },
  },

  //delay4
  delay4: {
    setting: {
      add: '',
      remove: {},
      time: '500',
    },
  },

  //aost4
  aost4: {
    scroller: window,
    class: 'aost-show',
    offset: 20,
    repeat: false,
    hasScrolled: true,
    breakpoints: {
      1160: 'data-aost-offset-1160',
      1024: 'data-aost-offset-1024',
      600: 'data-aost-offset-600',
    },
  },

  //頁面啟動套件的物件數量
  active: {},

  //紀錄使用的瀏覽器及裝置資訊
  is: {},
};
