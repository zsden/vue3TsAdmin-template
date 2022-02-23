import { createApp, createVNode } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import * as Icons from '@element-plus/icons-vue'

const app = createApp(App)

// //遍历所有图标
const Icon = (props: { icon: string }) => {
  const { icon } = props
  return createVNode(Icons[icon as keyof typeof Icons])
}
app.component('Icon', Icon)

app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
