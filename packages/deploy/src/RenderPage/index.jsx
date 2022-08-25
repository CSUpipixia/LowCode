import { defineComponent, onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getHomePage, getPageByPath } from "@/api/page";
import RenderBlock from "./components/RenderBlock";

export default defineComponent({
  setup() {
    let pageData = ref({
      container: {
        width: 800,
        height: 550,
      },
      blocks: [],
    });

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
    onMounted(async () => {
      const router = useRouter();
      const path = router.currentRoute.value.fullPath;
      const res =
        path === "/" ? await getHomePage() : await getPageByPath(path.slice(1));
      const page = res.data.data;
      console.log("page", page);
      document.title = page.title;
      router.replace(`/${page.path}`);
      pageData.value = page.pageData;
      console.log("pageData", pageData.value);
    });
    return () => (
      <div style={containerStyles.value}>
        {pageData.value.blocks.map((block, index) => (
          <RenderBlock block={block} formData={formData} scale={scale}></RenderBlock>
        ))}
      </div>
    );
  },
});
