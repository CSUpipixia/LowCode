import { reactive, toRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { queryPageList, createPage, getPage, setHomePage, savePageData, deletePage } from '@/api/page'

// 初始化页面数据，包括 页面列表、当前页面（默认首页）、当前页面JSON数据，首次进入页面、页面跳转、刷新页面执行
async function initEditorData(state, path = '/') {
  console.log('initData')
  // 获取所有页面列表
  state.pageList = await queryPageList()
  console.log('pageList', state.pageList)
  // 根据页面进入情况设置
  // 若 path 为 / ，存在首页则设为当前页
  // 若 path 不为 / ，将此页设为当前页
  state.currentPage = {
    '_id': '1',
    'name': '首页',
    'path': path
  }
  // 根据当前页请求保存的 pageData
  state.currentPageData = {
    "container": {
        "width": 800,
        "height": 550
    },
    "blocks": [

    ]
  }
}

export function useEditorData() {
  const pageList = []
  const currentPage = {}
  const currentPageData = {}

  const route = useRoute();
  const router = useRouter();

  const state = reactive({
    pageList,
    currentPage,
    currentPageData
  })

  // 初始化数据
  initEditorData(state, router.currentRoute.value.fullPath)

  // 设置当前页面
  router.replace(state.currentPage.path || '/');

  // 路由变化时更新当前操作的页面
  watch (
    () => route.path,
    (url) => initEditorData(url),
  );

  // 创建页面
  const createPage = () => {

  }

  // 更新界面
  const updatePage = () => {

  }

  // 删除页面
  const deletePage = () => {

  }

  // 保存页面JSON数据
  const savePageData = () => {
    console.log('pageData', state.currentPageData)
  }

  return {
    pageList: toRef(state, 'pageList'),
    currentPage: toRef(state, 'currentPage'),
    currentPageData: toRef(state, 'currentPageData'),
    createPage,
    updatePage,
    deletePage,
    savePageData
  }
}