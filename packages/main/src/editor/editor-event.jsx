import { defineComponent, inject, reactive, watch } from "vue";
import { ElForm, ElFormItem, ElButton, ElSelect, ElOption } from "element-plus";
import deepcopy from "deepcopy";

export default defineComponent({
  props: {
    block: { type: Object }, // 最后一个选中的组件
    data: { type: Object }, // 所有的data数据
    pageList: { type: Object },
    updateBlock: { type: Function },
  },
  setup(props) {
    const stateEvent = reactive({
      editData: {},
    });

    const reset = () => {
      if (props.block) {
        stateEvent.editData = deepcopy(props.block);
      }
    };
    const apply = () => {
      if (props.block) {
        console.log("stateEvent.editData", stateEvent.editData);
        console.log(
          "stateEvent.editData.events.click.actions[0].pagePath",
          stateEvent.editData.events.click.actions[0].pagePath
        );
        // 更改组件配置
        props.updateBlock(stateEvent.editData, props.block);
      }
    };

    // 监听选中组件的变化
    watch(() => props.block, reset, { immediate: true });

    const config = inject("config"); // 组件的配置信息

    return () => {
      let Message = [];
      let visual = false;

      if (props.block && props.block.key === "button") {
        visual = true;
        Message.push(
          stateEvent.editData.events.click.actions.map((item) => {
            return (
              <ElFormItem label={item.actionName}>
                <ElSelect
                  v-model={stateEvent.editData.events.click.actions[0].config.pagePath}
                >
                  {props.pageList.map((opt) => {
                    return (
                      <ElOption label={opt.title} value={opt.path}></ElOption>
                    );
                  })}
                </ElSelect>
                ,
              </ElFormItem>
            );
          })
        );
      }

      return (
        <div>
          {Message.length !== 0 ? (
            <div>
              {Message}
              <ElButton onClick={apply}>保存</ElButton>
            </div>
          ) : (
            <div>无</div>
          )}
        </div>
      );
    };
  },
});
