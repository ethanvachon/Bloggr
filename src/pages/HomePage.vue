<template>
  <div class="home flex-grow-1 d-flex flex-column align-items-center pt-3">
    <div class="container-fluid">
      <div v-if="state.user.isAuthenticated">
        <div>
          <form v-if="state.post === true" class="d-flex align-items-center justify-content-around" @submit.prevent="addPost(state.newPost)">
            <input class="title" type="text" v-model="state.newPost.title" placeholder="title">
            <input class="body" type="text" v-model="state.newPost.body" placeholder="body">
            <button type="submit" class="btn btn-success">Post</button>
          </form>
        </div>
        <div class="mb-3 d-flex justify-content-end pr-2" v-if="state.post === false">
          <button class="btn btn-success" @click="state.post = !state.post">+</button>
        </div>
      </div>
      <div class="row">
        <BlogComponent v-for="blog in state.blogs" :key="blog.id" :blog-prop="blog" />
      </div>
    </div>
  </div>
</template>

<script>
import { AppState } from '../AppState'
import { computed, onMounted, reactive } from 'vue'
import { logger } from '../utils/Logger'
import { blogService } from '../services/BlogService'

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      blogs: computed(() => AppState.blogs),
      post: false,
      user: computed(() => AppState.user),
      newPost: {}
    })
    onMounted(async() => {
      try {
        await blogService.getBlogs()
      } catch (error) {
        logger.error(error)
      }
    })
    return {
      state,
      async addPost(data) {
        try {
          state.post = false
          await blogService.addPost(data)
        } catch (error) {
          logger.error(error)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.home{
  text-align: center;
  user-select: none;
  background-image: url('https://cssauthor.com/wp-content/uploads/2015/01/Seamless-Paper-Textures.jpg');
  background-position: center;
    > img{
    height: 200px;
    width: 200px;
  }
}
button{
  height: 4vh;
  width: auto
}
input{
  height: 4vh
}
.body{
  width: 55vw
}
</style>
