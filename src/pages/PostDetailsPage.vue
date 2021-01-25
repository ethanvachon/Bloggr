<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 text-center">
        <div v-if="post">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">{{ post.title }}</h4>
              <p class="card-text">{{ post.body }}</p>
              <div v-for="comment in state.comments" :key="comment.id">
                <p>{{ comment.creator.name }}</p>
                <p>{{ comment.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { AppState } from '../AppState'
import { blogService } from '../services/BlogService'
import { logger } from '../utils/Logger'
export default {
  name: 'PageDetailsPage',
  setup() {
    const state = reactive({
      comments: []
    })
    const route = useRoute()
    onMounted(async() => {
      try {
        await blogService.getOnePost(route.params.id)
        state.comments = await blogService.getComments(route.params.id)
      } catch (error) {
        logger.error(error)
      }
    })
    return {
      post: computed(() => AppState.selected)
    }
  }
}
</script>

<style scoped>

</style>
