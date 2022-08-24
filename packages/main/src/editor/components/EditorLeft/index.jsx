import { defineComponent, inject, ref } from "vue";
import { useEditorData } from "@/editor/useEditorData";
import { useMenuDragger } from "@/editor/useMenuDragger";
import {
  ElButton,
  ElIcon,
  ElTabs,
  ElTabPane,
  ElTree,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from "element-plus";
import {
  Memo,
  TakeawayBox,
  MoreFilled,
  Edit,
  Delete,
  Link,
  Tickets,
  House
} from "@element-plus/icons-vue";
import "./index.scss";

export default defineComponent({
  props: {
    containerRef: { type: Object },
  },
  setup(props) {
    const config = inject("config");

    const { currentPageData, pageList, currentPage, setCurrentPage } = useEditorData();

    // 实现菜单的拖拽功能
    const { dragstart, dragend } = useMenuDragger(
      props.containerRef,
      currentPageData
    );

    const defaultProps = ref({
      children: "children",
      label: "title",
    });

    return () => (
      <>
        <div>
          <ElTabs model-value={"page"} tab-position="left" class="editor-left">
            <ElTabPane name={"page"} lazy>
              {{
                default: () => (
                  <>
                    <ElButton type="primary">添加页面</ElButton>
                    <ElTree
                      data={pageList.value}
                      props={defaultProps}
                      node-key={"_id"}
                      current-node-key={currentPage.value._id}
                      highlight-current
                      onNodeClick={(data) => {
                        setCurrentPage(data);
                      }}
                    >
                      {{
                        default: ({ node, data }) => (
                          <>
                            <span class="custom-tree-node">
                              <span>
                                {data.isHomePage ? (<ElIcon><House /></ElIcon>) : (<ElIcon><Tickets /></ElIcon>)}
                                {node.label}
                              </span>
                              <ElDropdown>
                                {{
                                  default: () => (
                                    <span class="el-dropdown-link">
                                      <ElIcon>
                                        <MoreFilled />
                                      </ElIcon>
                                    </span>
                                  ),
                                  dropdown: () => (
                                    <ElDropdownMenu>
                                      <ElDropdownItem icon={Edit} onClick={() => {console.log('编辑页面', data)}}>
                                        编辑
                                      </ElDropdownItem>
                                      <ElDropdownItem icon={Link} onClick={() => {console.log('设为首页', data)}}>
                                        设为首页
                                      </ElDropdownItem>
                                      <ElDropdownItem icon={Delete} onClick={() => {console.log('删除页面', data)}}>
                                        删除
                                      </ElDropdownItem>
                                    </ElDropdownMenu>
                                  ),
                                }}
                              </ElDropdown>
                            </span>
                          </>
                        ),
                      }}
                    </ElTree>
                  </>
                ),
                label: () => (
                  <div class="tab-item">
                    <ElIcon size={20}>
                      <Memo />
                    </ElIcon>
                  </div>
                ),
              }}
            </ElTabPane>
            <ElTabPane name={"material"} lazy>
              {{
                default: () => (
                  <>
                    {/* 根据注册列表 渲染对应的内容  可以实现h5的拖拽*/}
                    {config.componentList.map((component) => (
                      <div
                        class="editor-left-item"
                        draggable
                        onDragstart={(e) => dragstart(e, component)}
                        onDragend={dragend}
                      >
                        <span>{component.label}</span>
                        <div>{component.preview()}</div>
                      </div>
                    ))}
                  </>
                ),
                label: () => (
                  <div class="editor-left-tab-item">
                    <ElIcon size={20}>
                      <TakeawayBox />
                    </ElIcon>
                  </div>
                ),
              }}
            </ElTabPane>
          </ElTabs>
        </div>
      </>
    );
  },
});
