import { defineComponent, watch, computed, ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { getHomePage, getPageByPath } from "@/api/page";
import RenderBlock from "./components/RenderBlock";
import "./index.scss";

export default defineComponent({
  setup() {
    let pageData = ref({
      container: {
        width: 800,
        height: 550,
      },
      blocks: [],
    });

    const route = useRoute();
    const router = useRouter();

    const initData = async () => {
      console.log('initData')
      const path = router.currentRoute.value.fullPath;
      const res = path === "/" ? await getHomePage() : await getPageByPath(path.slice(1));
      const page = res.data.data;
      document.title = page.title;
      router.replace(`/${page.path}`);
      pageData.value = page.pageData;
      console.log("pageData", pageData.value)
    }

    initData();

    let clientWidth = document.documentElement.clientWidth;
    console.log(clientWidth);
    let scale = clientWidth / pageData.value.container.width;
    console.log("scale", scale);

    const containerStyles = computed(() => ({
      width: scale * pageData.value.container.width + "px",
      height: scale * pageData.value.container.height + "px",
      background: pageData.value.container.background,
      backgroundImage: pageData.value.container.url,
    }));

    let formData = {};

    // 路由变化时更新当前操作的页面
    watch(
      () => route.path,
      (url) => initData(),
    );

    return () => (
      <div style={containerStyles.value}>
        {pageData.value.blocks.map((block, index) => (
          <RenderBlock class="editor-block-render" block={block} formData={formData} scale={scale}></RenderBlock>
        ))}
      </div>
    );
  },
});
