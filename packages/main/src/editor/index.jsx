import { computed, defineComponent, ref, provide } from "vue";
import "./editor.scss";
import EditorBlock from "./editor-block";
import { useFocus } from "./useFocus";
import { useBlockDragger } from "./useBlockDragger";
import { useCommand } from "./useCommand";
import { $dialog } from "../components/Dialog";
import { $dropdown, DropdownItem } from "../components/Dropdown";
import EditorOperator from "./editor-operator";
import { ElButton, ElTabs, ElTabPane } from "element-plus";
import { registerConfig as config } from "@/utils/editor-config";
import { useEditorData } from "./useEditorData";
import EditorLeft from "./components/EditorLeft";

export default defineComponent({
  props: {
    formData: { type: Object },
  },
  setup(props, ctx) {
    // 预览的时候 内容不能在操作了 ，可以点击 输入内容 方便看效果
    const previewRef = ref(false);
    const editorRef = ref(true);

    const { currentPageData, savePageData } = useEditorData();
    const data = currentPageData;

    const containerStyles = computed(() => ({
      width: data.value.container.width + "px",
      height: data.value.container.height + "px",
      background: data.value.container.background,
      backgroundImage: data.value.container.url,
    }));
    // 注入物料配置
    provide("config", config); // 将组件的配置直接传值

    const containerRef = ref(null);

    // 2.实现获取焦点 选中后可能直接就进行拖拽了
    let {
      blockMousedown,
      focusData,
      containerMousedown,
      lastSelectBlock,
      clearBlockFocus,
    } = useFocus(data, previewRef, (e) => {
      // 获取焦点后进行拖拽
      mousedown(e);
    });

    // 2.实现组件拖拽
    let { mousedown, markLine } = useBlockDragger(
      focusData,
      lastSelectBlock,
      data
    );

    const { commands } = useCommand(data, focusData); // []

    const buttons = [
      { label: "撤销", icon: "icon-back", handler: () => commands.undo() },
      { label: "重做", icon: "icon-forward", handler: () => commands.redo() },
      {
        label: "导出",
        icon: "icon-export",
        handler: () => {
          $dialog({
            title: "导出json使用",
            content: JSON.stringify(data.value),
          });
        },
      },
      {
        label: "导入",
        icon: "icon-import",
        handler: () => {
          $dialog({
            title: "导入json使用",
            content: "",
            footer: true,
            onConfirm(text) {
              //data.value = JSON.parse(text); // 这样去更改无法保留历史记录
              commands.updateContainer(JSON.parse(text));
            },
          });
        },
      },
      {
        label: "置顶",
        icon: "icon-place-top",
        handler: () => commands.placeTop(),
      },
      {
        label: "置底",
        icon: "icon-place-bottom",
        handler: () => commands.placeBottom(),
      },
      { label: "删除", icon: "icon-delete", handler: () => commands.delete() },
      {
        label: () => (previewRef.value ? "编辑" : "预览"),
        icon: () => (previewRef.value ? "icon-edit" : "icon-browse"),
        handler: () => {
          previewRef.value = !previewRef.value;
          clearBlockFocus();
        },
      },
      {
        label: "保存",
        icon: "icon-close",
        handler: () => {
          savePageData();
        },
      },
      {
        label: "运行",
        icon: "icon-place-top",
        // 跳转到应用部署地址
        handler: () => {},
      },
    ];

    const onContextMenuBlock = (e, block) => {
      e.preventDefault();

      $dropdown({
        el: e.target, // 以哪个元素为准产生一个dropdown
        content: () => {
          return (
            <>
              <DropdownItem
                label="删除"
                icon="icon-delete"
                onClick={() => commands.delete()}
              ></DropdownItem>
              <DropdownItem
                label="置顶"
                icon="icon-place-top"
                onClick={() => commands.placeTop()}
              ></DropdownItem>
              <DropdownItem
                label="置底"
                icon="icon-place-bottom"
                onClick={() => commands.placeBottom()}
              ></DropdownItem>
              <DropdownItem
                label="查看"
                icon="icon-browse"
                onClick={() => {
                  $dialog({
                    title: "查看节点数据",
                    content: JSON.stringify(block),
                  });
                }}
              ></DropdownItem>
              <DropdownItem
                label="导入"
                icon="icon-import"
                onClick={() => {
                  $dialog({
                    title: "导入节点数据",
                    content: "",
                    footer: true,
                    onConfirm(text) {
                      text = JSON.parse(text);
                      commands.updateBlock(text, block);
                    },
                  });
                }}
              ></DropdownItem>
            </>
          );
        },
      });
    };

    return () =>
      !editorRef.value ? (
        <>
          <div
            class="editor-container-canvas__content"
            style={containerStyles.value}
          >
            {data.value.blocks.map((block, index) => (
              <EditorBlock
                class="editor-block-preview"
                block={block} //组件数据
                formData={props.formData} //data
              ></EditorBlock>
            ))}
          </div>
          <div>
            <ElButton type="primary" onClick={() => (editorRef.value = true)}>
              继续编辑
            </ElButton>
            {JSON.stringify(props.formData)}
          </div>
        </>
      ) : (
        <div class="editor">
          <div class="editor-top">
            {buttons.map((btn, index) => {
              const icon =
                typeof btn.icon == "function" ? btn.icon() : btn.icon;
              const label =
                typeof btn.label == "function" ? btn.label() : btn.label;
              return (
                <div class="editor-top-button" onClick={btn.handler}>
                  <i class={icon}></i>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
          <EditorLeft containerRef={containerRef}></EditorLeft>
          <div class="editor-right">
            <ElTabs model-value={"props"}>
              <ElTabPane label="属性" name="props">
                <EditorOperator
                  block={lastSelectBlock.value}
                  data={data.value}
                  updateContainer={commands.updateContainer}
                  updateBlock={commands.updateBlock}
                ></EditorOperator>
              </ElTabPane>
              <ElTabPane label="事件" name="events">
                {lastSelectBlock.value ? (
                  <ElButton>点击事件</ElButton>
                ) : (
                  "EmptyText"
                )}
              </ElTabPane>
              <ElTabPane label="动画" name="animates">
                {lastSelectBlock.value ? (
                  <ElButton>fade效果</ElButton>
                ) : (
                  "EmptyText"
                )}
              </ElTabPane>
            </ElTabs>
          </div>
          <div class="editor-container">
            {/*  负责产生滚动条 */}
            <div class="editor-container-canvas">
              {/* 产生内容区域 */}
              <div
                class="editor-container-canvas__content"
                style={containerStyles.value}
                ref={containerRef}
                onMousedown={containerMousedown}
              >
                {data.value.blocks.map((block, index) => (
                  <EditorBlock
                    class={block.focus ? "editor-block-focus" : ""}
                    block={block}
                    onMousedown={(e) => blockMousedown(e, block, index)}
                    onContextmenu={(e) => onContextMenuBlock(e, block)}
                    formData={props.formData}
                  ></EditorBlock>
                ))}

                {markLine.x !== null && (
                  <div class="line-x" style={{ left: markLine.x + "px" }}></div>
                )}
                {markLine.y !== null && (
                  <div class="line-y" style={{ top: markLine.y + "px" }}></div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
  },
});
