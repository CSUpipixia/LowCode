import { defineComponent, inject, watch, reactive, } from "vue";
import { ElForm, ElFormItem, ElButton, ElInputNumber, ElColorPicker, ElSelect, ElOption, ElInput, ElSwitch, ElUpload, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import deepcopy from "deepcopy";
import TableEditor from "./table-editor";
import styles from './styles.module.scss';

export default defineComponent({
    props: {
        block: { type: Object }, // 用户最后选中的组件
        data: { type: Object }, // 当前所有的数据
        updateContainer: { type: Function },
        updateBlock: { type: Function }
    },
   
    setup(props, ctx) {

        const config = inject('config'); // 组件的配置信息

        const state = reactive({
            editData: {}
        })
        // const { currentPageData } = useEditorData();

        const pageConfig = deepcopy(props.data.container)
        console.log('pageConfig',pageConfig);
        
            const reset = () => {
                if (!props.block) { // 说明要绑定的是容器的宽度和高度
                    console.log('props.data.container', props.data.container);
                    state.editData = deepcopy(props.data.container)
                    console.log('state.editData.background', state.editData.background);
                } else {
                    state.editData = deepcopy(props.block);
                }
            }
            const apply = () => {
                if (!props.block) { // 更改组件容器的大小
                    console.log('apply ', state.editData);
                    props.updateContainer({ ...props.data, container: state.editData });
                } else { // 更改组件的配置
                    props.updateBlock(state.editData, props.block);
                }

            }
            const beforeUpload = (file) => {
                console.log(file, '要上传的文件');
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    // pageConfig.bgImage = event.target?.result
                    console.log('url',fileReader.readAsDataURL(file));
                    pageConfig.bgImage = event.target?.result
        
                    
                }}
            watch(() => props.block, reset, { immediate: true })
            return () => {
                let content = []
                // 没有选中数据，显示默认内容，容器宽度和容器高度
                if (!props.block) {
                    console.log('state.editData.width', state.editData.width);
                    content.push(<>
                        <ElFormItem label="容器宽度">
                            <ElInputNumber v-model={state.editData.width}></ElInputNumber>
                        </ElFormItem>
                        <ElFormItem label="容器高度">
                            <ElInputNumber v-model={state.editData.height}></ElInputNumber>
                        </ElFormItem>
                        <ElFormItem label="背景颜色">
                            <ElColorPicker v-model={state.editData.background}></ElColorPicker>
                        </ElFormItem>
                        <ElFormItem label="背景图片">
                       
                            <ElUpload action={''} beforeUpload={beforeUpload} class={styles.upload}>
                                {pageConfig.bgImage ? (
                                    <img src='C:\Users\dark\Desktop\images' />)
                                    : (
                                        <ElIcon class="uploader-icon">
                                        <Plus />
                                      </ElIcon>
                                    )}
                            </ElUpload>

                        </ElFormItem>
                    </>)
                } else {

                    let component = config.componentMap[props.block.key];//拿到的是最后点击的单个组件
                    // console.log('component',component);
                    if (component && component.props) { // {text:{type:'xxx'},size:{},color:{}}
                        // {text:xxx,size:13px,color:#fff}
                        // console.log('componet.props',component.props);
                        content.push(Object.entries(component.props).map(([propName, propConfig]) => {
                            // console.log('propName',propName);
                            // console.log('propConfig.type',propConfig.type);
                            console.log('iptnum',state.editData.props[propName]);
                            // console.log('state.editData.props[propName]',state.editData.props[propName]);
                            return <ElFormItem label={propConfig.label}>
                                {/* 根据 propConfig.type 匹配渲染设置框 */}
                                {{
                                    input: () => <ElInput v-model={state.editData.props[propName]}></ElInput>,
                                    switch: () => <ElSwitch v-model={state.editData.props[propName]}></ElSwitch>,
                                    color: () => <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
                                    select: () => <ElSelect v-model={state.editData.props[propName]}>
                                        {propConfig.options.map(opt => {
                                            return <ElOption label={opt.label} value={opt.value}></ElOption>
                                        })}
                                    </ElSelect>,
                                    table: () => <TableEditor propConfig={propConfig} v-model={state.editData.props[propName]} ></TableEditor>,
                                    iptNumber: () => <ElInputNumber v-model={state.editData.props[propName]}></ElInputNumber>
                                }[propConfig.type]()}
                            </ElFormItem>
                        }))
                    }

                    if (component && component.model) {
                        // default 标签名
                        content.push(Object.entries(component.model).map(([modelName, label]) => {
                            return <ElFormItem label={label}>
                                {/* model => {default:"username"} */}
                                <ElInput v-model={state.editData.model[modelName]}></ElInput>
                            </ElFormItem>
                        }))
                    }

                }


                return <ElForm labelPosition="top" style="padding:30px">
                    {content}
                    <ElFormItem>
                        <ElButton type="primary" onClick={() => apply()}>应用</ElButton>
                        <ElButton onClick={reset} >重置</ElButton>
                    </ElFormItem>
                </ElForm>
            }
            
        
    }
})