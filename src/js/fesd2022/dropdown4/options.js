export default {
  SETTINGS: {
    scrollbar: {
      'scrollbar-track-color': 'transparent',
      'scrollbar-thumb-color': 'rgba(0,0,0,.4)',
      'scrollbar-thumb-hover-color': 'rgba(0,0,0,.55)',
      'scrollbar-radius': '10px',
    },
  },
  TEMPLATE(filter) {
    if (filter) {
      return `
        <div class="select-wrapper">
          <div class="select-display"></div>
          <i class="dropdown-icon"></i>
          <div class="dropdown">
            <div class="filter-bar">
              <input class="filter-input" type="text">
            </div>
            <div class="dropdown-scroller">
              <ul class="dropdown-list"></ul>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="select-wrapper">
          <div class="select-display"></div>
          <i class="dropdown-icon"></i>
          <div class="dropdown">
            <div class="dropdown-scroller">
              <ul class="dropdown-list"></ul>
            </div>
          </div>
        </div>
      `;
    }
  },
};
