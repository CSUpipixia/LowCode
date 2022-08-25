import { computed, ref, defineComponent, inject, reactive,watch,} from "vue";
import { ElForm, ElFormItem, ElButton, ElInput, ElMessage, ElColorPicker,ElSelect,ElOption } from 'element-plus'
import deepcopy from "deepcopy";

// import {useEditorData} from './useEditorData'
export default defineComponent({
    props: {
        block: { type: Object },//最后一个选中的组件
        data: { type: Object },//所有的data数据
        pageList: { type: Object },
        updateBlock:{type:Function}
    },

    setup(props) {

        // 设置计算属性，以便于实现数据的双向绑定
       
        const stateEvent = reactive({
            editData: {}
        })
      
        const resetEvent = () =>{ 
            if (props.block) {
            stateEvent.editData = deepcopy(props.block);
          
         }}
        watch(() => props.block, resetEvent, { immediate: true })
        const apply = () => {
            if (props.block) { // 更改组件配置
                props.updateBlock(stateEvent.editData, props.block);
            } 

        }
       

        // console.log('event-editor-pageList', props.pageList);
        const config = inject('config'); // 组件的配置信息

        
        return () => {
            let Message = [];
            let visual = false;
            // let index;
            // console.log('data',data.value);
            
                if (props.block) {
                    
                    visual = true
                    
                    
                        let component = config.componentMap[props.block.key];
                        // console.log(component);//click   actions
                       
                        // component.events.click.actions.map((item)=>{console.log(item.config);})
                         Message.push(component.events.click.actions.map((item) => {
                            console.log('props.block.events.actions[0]',props.block);
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
                    ): (<div>
                        <h3 align="center">请选择组件</h3>
                    </div>)
                }
            </div>
        }
    }
})