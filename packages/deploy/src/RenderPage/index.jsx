import { defineComponent, onMounted } from "vue";
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter()
    return () => <div>
      渲染页面: { router.currentRoute.value.fullPath }
    </div>
  }
})