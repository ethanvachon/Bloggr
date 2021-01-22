<template>
  <div class="col-6">
    <div class="card m-2">
      <div class="d-flex pl-3 mt-3 align-items-center  pb-2 border-bottom">
        <img class="card-img-top" :src="blogProp.creator.picture" alt="">
        <h5 class="pl-3">
          {{ blogProp.creator.name }}
        </h5>
      </div>
      <div class="card-body">
        <router-link :to="{ name:'PostDetails', params: { id: blogProp.id} }">
          <h4 class="card-title">
            {{ blogProp.title }}
          </h4>
          <p class="card-text">
            {{ blogProp.body }}
          </p>
        </router-link>

        <div class="text-left d-flex align-items-center pb-2" @click="state.commentDisplay = !state.commentDisplay">
          <i class="fas fa-comment"></i>
          <p class="comment-num pl-2">
            {{ state.comments.length }}
          </p>
        </div>
        <div v-if="state.commentDisplay === true">
          <div v-for="comment in state.comments" :key="comment.id">
            <div class="d-flex pt-2 border-top">
              <p class="creator-name mr-2">{{comment.creator.name}}:</p>
              <p>{{comment.body}}</p>
            </div>
          </div>
          <form class="d-flex justify-content-center border-top pt-2" @submit.prevent="addComment" v-if="state.user.isAuthenticated">
            <input type="text" placeholder="add comment" v-model="state.newComment">
            <button class="btn btn-outline-success">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from 'vue'
import { logger } from '../utils/Logger'
// import { AppState } from '../AppState'
import { blogService } from '../services/BlogService'
import { AppState } from '../AppState'
export default {
  props: {
    blogProp: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const state = reactive({
      commentDisplay: false,
      comments: [],
      user: computed(() => AppState.user),
      newComment: ''
    })
    onMounted(async() => {
      try {
        state.comments = await blogService.getComments(props.blogProp.id)
      } catch (error) {
        logger.error(error)
      }
    })
    return {
      state,
      async addComment() {
        await blogService.postComment(props.blogProp.id, state.newComment, state.user)
        state.comments = await blogService.getComments(props.blogProp.id)
      }
    }
  }
}
</script>

<style scoped>
  img{
    width: 5vw;
    height: auto
  }
  .comment-num{
    margin: 0px;
  }
  .creator-name{
    font-weight: bold;
  }
  button{
    height: 4vh;
    width: auto;
  }
  input{
    height: 4vh;
  }
</style>
