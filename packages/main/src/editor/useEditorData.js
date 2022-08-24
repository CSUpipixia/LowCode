
import { reactive, toRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import * as pageApi from '@/api/page'

// 初始化页面数据，包括 页面列表、当前页面（默认首页）、当前页面JSON数据，首次进入页面、页面跳转、刷新页面执行
export const initEditorData = async (state, router) => {
  // 获取当前路径
  let path = router?.currentRoute.value.fullPath ? router.currentRoute.value.fullPath : '/'
  
  console.log('initData', path)
  // 获取所有页面列表
  let res = await pageApi.queryPageList()
  state.pageList = res.data.data
  
  // 根据页面进入情况设置
  // 若 path 为 / ，存在首页则设为当前页
  // 若 path 不为 / ，将此页设为当前页
  if (path !== '/') {
    // 获取当前页信息
    state.pageList.forEach(page => {
      if (`/${page._id}` === path) {
        state.currentPage = page
      }
    });
  }
  // 仍然为空，可能是 path 不为 /，或者获取当前页失败
  if (Object.keys(state.currentPage).length === 0) {
    // 获取首页
    state.pageList.forEach(page => {
      if (page.isHomePage === true) {
        state.currentPage = page
      }
    });
  }

  // 获取页面数据
  state.currentPageData = state.currentPage.pageData ? state.currentPage.pageData : state.currentPageData

  // 设置当前页面
  console.log('currentPage', state.currentPage)
  router.replace(`/${state.currentPage._id}` || '/');
}

export function useEditorData() {
  const pageList = []
  const currentPage = {}
  const currentPageData = {
    container: {
        width: 800,
        height: 550
    },
    blocks: [
    ]
}


  const route = useRoute();
  const router = useRouter();


  const state = reactive({
    pageList,
    currentPage,
    currentPageData,
  });

  // 初始化数据

  initEditorData(state, router)

  // 路由变化时更新当前操作的页面
  watch(
    () => route.path,

    (url) => initEditorData(state, router),
  );

  // 获取所有页面
  const getPageList = async () => {
    let res = await pageApi.queryPageList()
    state.pageList = res.data.data
  }

  // 创建页面
  const createPage = async (data) => {
    let res = await pageApi.createPage(data);
    if (res.data.code === 200) {
      ElNotification({
        title: '创建成功',
        type: 'success'
      })
    } else {
      ElNotification({
        title: '创建失败',
        type: 'Error'
      })
    }
    getPageList()
  }

  // 设置首页界面
  const setHomePage = async (_id) => {
    let res = await pageApi.setHomePage(_id);
    if (res.data.code === 200) {
      ElNotification({
        title: '设置首页成功',
        type: 'success'
      })
    } else { 
      ElNotification({
        title: '设置首页失败',
        type: 'Error'
      })
    }
    getPageList()
  }

  // 删除页面
  const deletePage = async (_id) => {
    let res = await pageApi.deletePage(_id);
    if (res.data.code === 200) {
      ElNotification({
        title: '删除成功',
        type: 'success'
      })
    } else { 
      ElNotification({
        title: '删除失败',
        type: 'Error'
      })
    }
    getPageList()
  }

  // 保存页面JSON数据
  const savePageData = async () => {
    let res = await pageApi.savePageData(state.currentPage._id, state.currentPageData)
    if (res.data.code === 200) {
      ElNotification({
        title: '保存成功',
        type: 'success'
      })
    } else { 
      ElNotification({
        title: '保存失败',
        type: 'Error'
      })
    }
  }

  return {
    pageList: toRef(state, 'pageList'),
    currentPage: toRef(state, 'currentPage'),
    currentPageData: toRef(state, 'currentPageData'),
    getPageList,
    setHomePage,

    createPage,
    deletePage,
    savePageData,
  };
}
