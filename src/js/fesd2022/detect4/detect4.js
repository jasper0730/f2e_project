(function ($) {
  /**
   *  WDD FESD detect device
   *  @version 2.1
   *
   *  Update: 2021.01.25
   *  Last Coding: Eric, 2021.01.25
   */

  'use strict';
  const userAgent = navigator.userAgent;

  /**
   * isBrowser4
   */

  fesdDB.ver.library.isBrowser4 = {};
  fesdDB.ver.library.isBrowser4.ver = '2.0';
  fesdDB.ver.library.isBrowser4.update = '2021.01.20';

  let browser = {};
  // Firefox 1.0+
  browser['isFirefox'] = typeof InstallTrigger !== 'undefined';
  // Opera 8.0+
  browser['isOpera'] =
    (!!window.opr && !!opr.addons) || !!window.opera || userAgent.indexOf(' OPR/') >= 0;
  // Internet Explorer 6-11
  browser['isIE'] = /*@cc_on!@*/ false || !!document.documentMode;
  // Edge 20+
  browser['isEdge'] = !browser['isIE'] && !!window.StyleMedia;
  // Edge (based on chromium) detection
  browser['isEdgeChromium'] = /\sedg\//i.test(userAgent) || /edg([ea]|ios)/i.test(userAgent);
  // Safari 3.0+ "[object HTMLElementConstructor]"
  browser['isSafari'] = !/chrome|crios|crmo/i.test(userAgent) && /safari/i.test(userAgent);
  // Chrome 1 - 79
  browser['isChrome'] =
    (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) ||
    /chrome|crios|crmo/i.test(userAgent);

  fesdDB.ver.library.isBrowser4.list = browser;

  /**
   * isMobile4
   */

  fesdDB.ver.library.isMobile4 = {};
  fesdDB.ver.library.isMobile4.ver = '2.0';
  fesdDB.ver.library.isMobile4.update = '2021.01.20';

  let mobile = {};
  // Android
  mobile['isAndroid'] = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
  // iOS | ipad
  mobile['isiOS'] = userAgent.indexOf('Mac') > -1 && 'ontouchend' in document;

  fesdDB.ver.library.isMobile4.list = mobile;

  /**
   * isOs4
   */

  fesdDB.ver.library.isOs4 = {};
  fesdDB.ver.library.isOs4.ver = '1.0';
  fesdDB.ver.library.isOs4.update = '2021.02.03';

  let os = {};
  // window
  os['isWindows'] = userAgent.indexOf('Win') > -1;
  // macos
  os['isMacOS'] = userAgent.indexOf('Mac') > -1;
  // UNIX
  os['isUNIX'] = userAgent.indexOf('X11') > -1;
  // Linux
  os['isLinux'] = userAgent.indexOf('Linux') > -1;

  fesdDB.ver.library.isOs4.list = os;

  $.extend({
    isBrowser4: function () {
      for (let i = 0; i < Object.keys(browser).length; i++) {
        if (browser[Object.keys(browser)[i]]) return Object.keys(browser)[i];
      }
    },
    isMobile4: function () {
      for (let i = 0; i < Object.keys(mobile).length; i++) {
        if (mobile[Object.keys(mobile)[i]]) return true;
      }
      return false;
    },
    isOs4: function () {
      for (let i = 0; i < Object.keys(os).length; i++) {
        if (os[Object.keys(os)[i]]) return Object.keys(os)[i];
      }
      return false;
    },
  });

  fesdDB.is.isBrowser4 = $.isBrowser4();
  fesdDB.is.isMobile4 = $.isMobile4();
  fesdDB.is.isOs4 = $.isOs4();
})(jQuery);
