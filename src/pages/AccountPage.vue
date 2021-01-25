<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-10 d-flex justify-content-center">
        <div class="card d-flex justify-content-center align-items-center">
          <img class="rounded" :src="account.picture" alt="" />
          <div class="card-body">
            <h1>{{ account.name }}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
export default {
  name: 'Account',
  setup() {
    return {
      account: computed(() => AppState.account)
    }
  }
}
</script>

<style scoped>
img {
  max-width: 100px;
}
</style>
