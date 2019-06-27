const localStorage = window.localStorage
const USER_KEY = 'user_info'

// 保存本地存储
export function getUser () {
  return JSON.parse(localStorage.getItem(USER_KEY))
}
// 获取本地存储
export function saveUser (data) {
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}
// 删除本地存储
export function removeUser () {
  localStorage.removeItem(USER_KEY)
}
