import Axios from 'axios'

export const api = Axios.create({
  baseURL: 'https:/localhost:5001/',
  timeout: 8000
})

export const setBearer = function(bearer) {
  api.defaults.headers.authorization = bearer
}

export const resetBearer = function() {
  api.defaults.headers.authorization = ''
}
