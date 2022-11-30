export default {
  SETTINGS: {
    target: null,
    route: null,
    action: 'toggle',
    container: 'body',
  },
  ATTRS: {
    id: 'data-modal-id',
    close: 'data-modal-close',
    destroy: 'data-modal-destroy',
  },
  EVENTS: {
    init: null,
    success: null,
    error: null,
    complete: null,
    open: null,
    close: null,
    destroy: null,
    update: null,
  },
  TEMPLATE(type) {
    return `
    <div class="modal-scroller">
      <div class="modal-wrapper" ${type === 'destroy' ? 'data-modal-destroy' : 'data-modal-close'}>
        <div class="modal-content" stop-propagation>
      </div>
    </div>
    `;
  },
};
