<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 d-flex justify-content-center">
        <div v-if="post">
          <div class="card">
            <div class="d-flex border-bottom pb-3 align-items-center justify-content-center">
              <img :src="post.creator.picture" class="card-img-top">
              <h1 class="pl-2">{{ post.creator.name }}</h1>
            </div>
            <div class="card-body">
              <div class="text-center">
                <h1 class="card-title">{{ post.title }}</h1>
                <h4 class="card-text pb-5">{{ post.body }}</h4>
              </div>
              <div v-for="comment in state.comments" :key="comment.id">
                <div class="d-flex pt-2 border-top width">
                  <p class="pr-2 border-right bold">{{ comment.creator.name }}</p>
                  <p class="pl-2">{{ comment.body }}</p>
                </div>
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
      post: computed(() => AppState.selected),
      state
    }
  }
}
</script>

<style scoped>
  .card{
    width: 70vw;
  }
  .width{
    width: 67vw;
    overflow: auto;
  }
  img{
    width: 7vw;
    height: auto;
  }
</style>
