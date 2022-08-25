import { defineComponent, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { getHomePage, getPageByPath } from '@/api/page'

export default defineComponent({
  setup() {
    onMounted(async () => {
      const router = useRouter()
      const path = router.currentRoute.value.fullPath
      if (path === '/') {
        // 获取首页详情
        const res = await getHomePage();
        const page = res.data.data;
        console.log('page', res.data.data);
        document.title = page.title
        router.replace(`/${page.path}`);
      } else {
        const res = await getPageByPath(path.slice(1))
        console.log('res', res)
      }
    })
    return () => <div>
      渲染页面: {  }
    </div>
  }
})