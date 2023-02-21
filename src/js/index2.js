function imagePreview (target) {
  const option = {
    // on: {
    //   changeAfter() {
    //     alert('success')
    //   },
    //   overLimit() {
    //     alert('error')
    //   }
    // },
    sizeLimit: 1
  }
  _g.imagePreview(target, option);
}


imagePreview(".upload-btn")
