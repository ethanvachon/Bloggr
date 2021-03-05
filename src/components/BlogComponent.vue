<template>
  <div class="col-6 d-flex justify-content-center">
    <div class="card m-2">
      <div class="d-flex pl-3 mt-3 align-items-center  pb-2 border-bottom">
        <img class="card-img-top" :src="blogProp.creator.picture" alt="">
        <h5 class="pl-3">
          {{ blogProp.creator.name }}
        </h5>
        <!-- <div class="pl-5">
          <i class="fas fa-pencil-alt pl-2" v-if="state.user.name == blogProp.creator.name" @click="state.editMode = true"></i>
          <i class="fa fa-trash text-danger pl-2" v-if="state.user.name == blogProp.creator.name" @click="deleteBlog"></i>
        </div> -->
        <div class="dropdown">
          <h6 v-if="state.user.name == blogProp.creator.name">
            ...
          </h6>
          <div class="dropdown-content">
            <p @click="state.editMode = true">
              edit
            </p>
            <p @click="deleteBlog">
              delete
            </p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h4 class="card-title" v-if="state.editMode == false">
          {{ blogProp.title }}
        </h4>
        <p class="card-text" v-if="state.editMode == false">
          {{ blogProp.body }}
        </p>
        <form @submit.prevent="editBlog()">
          <input class="my-2" type="text" v-if="state.editMode == true" placeholder="New Title" v-model="state.newTitle">
          <input class="my-2" type="text" v-if="state.editMode == true" placeholder="New Body" v-model="state.newBody">
          <button type="submit" v-if="state.editMode == true" class="btn btn-success">
            Submit
          </button>
        </form>
        <div @click="state.commentDisplay = !state.commentDisplay">
          <div class="comments d-flex align-items-center">
            <i class="fas fa-comment"></i>
            <p class="mb-0 pl-2">
              {{ state.comments.length }}
            </p>
          </div>
          <router-link :to="{ name: 'PostDetailsPage', params: {id: blogProp.id}}">
            <p class="details">
              details
            </p>
          </router-link>
        </div>
        <div v-if="state.commentDisplay === true">
          <div v-for="comment in state.comments" :key="comment.id">
            <div class="container-fluid">
              <div class="row">
                <div class="col-10">
                  <div class="d-flex pt-2 border-top">
                    <p v-if="state.commentEdit == false || state.user.name !== comment.creator.name" class="creator-name mr-2">
                      {{ comment.creator.name }}:
                    </p>
                    <p v-if="state.commentEdit == false || state.user.name !== comment.creator.name">
                      {{ comment.body }}
                    </p>
                    <form v-if="state.commentEdit == true && state.user.name == comment.creator.name" @submit.prevent="editComment(comment.id)">
                      <input type="text" v-model="state.editComment">
                      <button class="btn btn-success" type="submit">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
                <div class="col-2">
                  <i class="fas fa-pencil-alt pl-2" v-if="state.user.name == comment.creator.name && state.commentEdit == false" @click="state.commentEdit = true"></i>
                  <i class="fa fa-trash text-danger pl-2" v-if="state.user.name == comment.creator.name && state.commentEdit == false" @click="deleteComment(comment.id)"></i>
                </div>
              </div>
            </div>
          </div>
          <form class="d-flex justify-content-center border-top pt-2" @submit.prevent="addComment" v-if="state.user.isAuthenticated">
            <input type="text" placeholder="add comment" v-model="state.newComment">
            <button class="btn btn-outline-success">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from 'vue'
import { logger } from '../utils/Logger'
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
      commentEdit: false,
      editComment: '',
      editMode: false,
      commentDisplay: false,
      comments: [],
      user: computed(() => AppState.user),
      newComment: '',
      newTitle: '',
      newBody: ''
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
      },
      async editBlog() {
        try {
          const data = { title: state.newTitle, body: state.newBody }
          blogService.editBlog(data, props.blogProp.id)
          state.editMode = false
        } catch (error) {
          logger.error(error)
        }
      },
      async deleteBlog() {
        try {
          await blogService.deleteBlog(props.blogProp.id)
        } catch (error) {
          logger.error(error)
        }
      },

      async editComment(id) {
        try {
          await blogService.editComment(id, { body: state.editComment })
          state.comments = await blogService.getComments(props.blogProp.id)
          state.commentEdit = false
        } catch (error) {
          logger.error(error)
        }
      },

      async deleteComment(id) {
        try {
          await blogService.deleteComment(id)
          state.comments = await blogService.getComments(props.blogProp.id)
        } catch (error) {
          logger.error(error)
        }
      }
    }
  }
}
</script>

<style scoped>
.dropdown {
  position: absolute;
  display: inline-block;
  top: 0px;
  right: 10px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
  img{
    width: 5vw;
    height: auto
  }
  .comments{
    width: fit-content;
    position: absolute;
    bottom: 2vh;
    left: 2vw;
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
    width: 40vw;
  }
  .card{
    width: 45vw;
    height: fit-content;
  }
  a{
    color: black;
  }
  .details{
    margin: 0;
    position: absolute;
    bottom: 2vh;
    right: 2vw;
    color: rgb(95, 95, 95);
  }
  .right{
    text-align: end;
  }
</style>
