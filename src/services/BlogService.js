// import { AppState } from '../AppState'
import { AppState } from '../AppState'
import { api } from './AxiosService'

class BlogService {
  async getBlogs() {
    const res = await api.get('api/posts')
    AppState.blogs = res.data
  }

  async getOnePost(id) {
    const res = await api.get('api/posts/' + id)
    AppState.selected = res.data
  }

  async addPost(data) {
    // const user = await api.get('account')
    // data.creator = user.data.id
    await api.post('api/posts', data)
    this.getBlogs()
  }

  async editBlog(blogData, id) {
    await api.put('api/posts/' + id, blogData)
    this.getBlogs()
  }

  async deleteBlog(id) {
    await api.delete('api/posts/' + id)
    this.getBlogs()
  }

  async getComments(id) {
    const res = await api.get('api/posts/' + id + '/comments')
    return res.data
  }

  async postComment(id, data) {
    const res = await api.get('account')
    const body = {
      body: data,
      postId: id,
      creatorId: res.data.id
    }
    await api.post('api/comments', body)
  }

  async editComment(id, data) {
    await api.put('api/comments/' + id, data)
  }

  async deleteComment(id) {
    await api.delete('api/comments/' + id)
  }
}

export const blogService = new BlogService()
