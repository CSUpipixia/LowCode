import { defineComponent, inject, reactive, watch, } from "vue";
import { ElForm, ElFormItem, ElButton, ElSelect, ElOption } from 'element-plus'
import deepcopy from "deepcopy";

export default defineComponent({
    props: {
        block: { type: Object },//最后一个选中的组件
        data: { type: Object },//所有的data数据
        pageList: { type: Object },
        updateBlock: { type: Function }
    },

    setup(props) {



        const stateEvent = reactive({
            editData: {}
        })

        const resetEvent = () => {
            if (props.block) {
                stateEvent.editData = deepcopy(props.block);

            }
        }
        watch(() => props.block, resetEvent, { immediate: true })
        const apply = () => {
            if (props.block) { // 更改组件配置
                props.updateBlock(stateEvent.editData, props.block);
            }

        }



        const config = inject('config'); // 组件的配置信息


        return () => {
            let Message = [];
            let visual = false;


            if (props.block) {
                visual = true
                let component = config.componentMap[props.block.key];
                Message.push(component.events.click.actions.map((item) => {
                     return <ElFormItem label={item.actionName}>
                                <ElSelect v-model={props.block.events.click.actions[0].pagePath} >
                                    {props.pageList.map(opt => {
                                        return <ElOption label={opt.title} value={opt.path} ></ElOption>
                                    })}
                                </ElSelect>,
                            </ElFormItem>
                }))
            }



            return <div>
                {
                    visual ? (
                        <div>
                            {Message}
                            <ElButton onClick={apply}>添加事件</ElButton>
                        </div>
                    ) : (<div>
                        <h3 align="center">请选择组件</h3>
                    </div>)
                }
            </div>
        }
    }
})