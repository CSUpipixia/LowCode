import { defineComponent, inject, reactive, ref } from "vue";
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
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSwitch,
  ElMessageBox
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

    const { currentPageData, pageList, currentPage, createPage, updatePage, setCurrentPage, setHomePage, deletePage } = useEditorData();

    // 实现菜单的拖拽功能
    const { dragstart, dragend } = useMenuDragger(
      props.containerRef,
      currentPageData
    );

    const defaultProps = ref({
      children: "children",
      label: "title",
    });

    // 是否显示对话框
    const dialogVisible = ref(false)
    // 对话框标题
    const dialogTitle = ref('')
    // 对话框数据
    const formData = ref({
      _id: undefined,
      title: undefined,
      path: undefined,
      isHomePage: undefined
    })
    // 对话框数据
    const rules = {
      title: [{ required: true, message: '请输入页面标题', trigger: 'blur' }],
      path: [{ required: true, message: '请输入页面路径', trigger: 'blur' }],
    };
    const ruleFormRef = ref('')
    // 提交表单
    const submitForm = () => {
      console.log('提交表单')
      ruleFormRef.value?.validate((valid) => {
        if (valid) {
          if (formData.value._id) {
            updatePage(formData.value._id, formData.value, () => {dialogVisible.value = false})
          } else {
            createPage(formData.value, () => {dialogVisible.value = false})
          }
        }
      })
    }

    return () => (
      <>
        <div>
          <ElTabs model-value={"page"} tab-position="left" class="editor-left">
            <ElTabPane name={"page"} lazy>
              {{
                default: () => (
                  <>
                    <ElButton type="primary" onClick={() => {
                      dialogTitle.value = '添加页面';
                      formData.value = {
                        _id: undefined,
                        title: undefined,
                        path: undefined,
                        isHomePage: false
                      };
                      dialogVisible.value = true;
                    }}>添加页面</ElButton>
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
                                      <ElDropdownItem icon={Edit} onClick={() => {
                                        dialogTitle.value = '编辑页面';
                                        formData.value = {
                                          _id: data._id,
                                          title: data.title,
                                          path: data.path,
                                          isHomePage: data.isHomePage
                                        };
                                        dialogVisible.value = true;
                                      }}>
                                        编辑
                                      </ElDropdownItem>
                                      <ElDropdownItem icon={Link} onClick={() => {
                                        setHomePage(data._id)
                                      }}>
                                        设为首页
                                      </ElDropdownItem>
                                      <ElDropdownItem icon={Delete} onClick={() => {
                                        ElMessageBox.confirm(
                                          `是否确认删除 ${data.title} ?`,
                                          '删除确认',
                                          {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning',
                                          }
                                        ).then(() => {
                                          deletePage(data._id)
                                        })
                                      }}>
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

        <ElDialog
          v-model={dialogVisible.value}
          title={dialogTitle.value}
          width="30%"
        >
          {{
            default: () => (
              <ElForm ref={ruleFormRef} model={formData.value} rules={rules}>
                <ElFormItem prop={'title'} label={'页面标题'} labelWidth={'80px'}>
                  <ElInput v-model={formData.value.title} />
                </ElFormItem>
                <ElFormItem prop={'path'} label={'页面路径'} labelWidth={'80px'}>
                  <ElInput v-model={formData.value.path} />
                </ElFormItem>
                <ElFormItem prop={'isHomePage'} label={'设为首页'} labelWidth={'80px'}>
                  <ElSwitch v-model={formData.value.isHomePage} />
                </ElFormItem>
              </ElForm>
            ),
            footer: () => (<span class="dialog-footer">
              <ElButton onClick={() => {dialogVisible.value = false}}>取消</ElButton>
              <ElButton type="primary" onClick={() => {submitForm()}}>确认</ElButton>
            </span>)
          }}
        </ElDialog>
      </>
    );
  },
});
