class Post {
  constructor (container) {
    this.container = container
    this.templateElement = document.querySelector('#postTemplate')
    this.baseUrl = '/api/posts'
    this.currentPost = {}
    this.url = ''

    this.init()
  }

  init () {
    window.addEventListener('posts.click', this.handlePostListClick.bind(this))
    window.addEventListener('form.edited', this.handleFormEdited.bind(this))
    this.container.addEventListener('click', this.handleClickButtonRemove.bind(this))
    this.container.addEventListener('click', this.handleClickButtonEdit.bind(this))
  }

  handlePostListClick (event) {
    const { id } = event.detail
    const url = `${this.baseUrl}/${id}`
    this.url = url

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.currentPost = data
        this.render(data)
      })
  }

  handleFormEdited (event) {
    const { posts } = event.detail
    this.render(posts)
  }

  buildTemplate (data) {
    let template = this.templateElement.innerHTML

    for (const key in data) {
      template = template.replaceAll(`{{${key}}}`, data[key])
    }

    return template
  }

  render (data) {
    const template = this.buildTemplate(data)

    this.container.innerHTML = template
  }

  handleClickButtonRemove (event) {
    const { role } = event.target.dataset
    if (role == 'remove') {
      fetch(this.url, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          const customEvent = new CustomEvent('post.removed', {
            detail: { data }
          })
          window.dispatchEvent(customEvent)
          this.container.innerHTML = ''
        })
    }
  }

  handleClickButtonEdit (event) {
    const { role } = event.target.dataset
    if (role == 'edit') {
      const customEvent = new CustomEvent('post.edit', {
        detail: { data: this.currentPost }
      })
      window.dispatchEvent(customEvent)
    }
  }
}

export { Post }
