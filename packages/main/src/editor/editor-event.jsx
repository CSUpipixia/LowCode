// import { defineComponent,inject} from "vue";
// export default defineComponent({
// props:{
//     block: { type: Object }, // 用户最后选中的组件
//     data: { type: Object }, // 当前所有的数据
// },
//  setup(props,ctx){
//     return () => {
//         let content = []
//         const config = inject('config'); // 组件的配置信息
        
//         if (!props.block) {
            
//             content.push(<>
//                 <div>页面暂时没有开发事件功能，请期待......</div>
//             </>)
//         } else {

//             let component = config.componentMap[props.block.key];//拿到的是最后点击的单个组件
         
//             if (component && component.props) { // {text:{type:'xxx'},size:{},color:{}}
//                 // {text:xxx,size:13px,color:#fff}
//                 //                                                   key         value
//                 // console.log('component.props',component.props);
//                 content.push(Object.entries(component.props).map(([propName, propConfig]) => {
//                     console.log('propName11',propName);
//                     // console.log('propConfig',propConfig);
//                     // console.log('Object.entries(component.props)',Object.entries(component.props));
//                     // console.log('[propName, propConfig]',[propName, propConfig]);
//                     console.log('state.editData.props[propName]',state.editData.props[propName]);
//                     return <ElFormItem label={propConfig.label}>
//                         {/* 根据 propConfig.type 匹配渲染设置框 */}
//                         {{
//                             input: () => <ElInput v-model={state.editData.props[propName]} placeholder={'输入您需要显示的值'}></ElInput>,
//                             color: () => <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
//                             select: () => <ElSelect v-model={state.editData.props[propName]}>
//                                 {propConfig.options.map(opt => {
//                                     return <ElOption label={opt.label} value={opt.value}></ElOption>
//                                 })}
//                             </ElSelect>,
//                             table: () => <TableEditor propConfig={propConfig} v-model={state.editData.props[propName]} ></TableEditor>,
//                             iptNumber: () => <ElInputNumber v-model={state.editData.props[propName] }></ElInputNumber>
//                         }[propConfig.type]()}
//                     </ElFormItem>
//                 }))
//             }

//             if (component && component.model) {
//                 // default 标签名
//                 content.push(Object.entries(component.model).map(([modelName, label]) => {
//                     return <ElFormItem label={label}>
//                         {/* model => {default:"username"} */}
//                         <ElInput v-model={state.editData.model[modelName]}></ElInput>
//                     </ElFormItem>
//                 }))
//             }

//         }


//         return <ElForm labelPosition="top" style="padding:30px">
//             {content}
//             <ElFormItem>
//                 <ElButton type="primary" onClick={() => apply()}>应用</ElButton>
//                 <ElButton onClick={reset} >重置</ElButton>
//             </ElFormItem>
//         </ElForm>
//     }
//  }
// })