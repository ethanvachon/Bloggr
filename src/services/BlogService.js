// import { AppState } from '../AppState'
import { AppState } from '../AppState'
import { api } from './AxiosService'

class BlogService {
  async getBlogs() {
    const res = await api.get('api/blogs')
    AppState.blogs = res.data
  }

  async getComments(id) {
    const res = await api.get('api/blogs/' + id + '/comments')
    return res.data
  }

  async postComment(id, data) {
    const res = await api.get('account')
    const body = {
      body: data,
      blog: id,
      creator: res.data.id
    }
    await api.post('api/comments', body)
  }
}

export const blogService = new BlogService()
