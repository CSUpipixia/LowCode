import { computed, defineComponent, inject, onMounted, ref } from "vue";
import BlockResize from './block-resize'
import router from '@/router/index'

export default defineComponent({
    //从父组件editor index 收到的block 和formdata 渲染列表组件
    props: {
        block: { type: Object },
        formData: { type: Object }
    },
    setup(props) {
        // 计算属性 - 计算出需要渲染组件的宽高 block top left
        // console.log('props.data',props.data);
        const blockStyles = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            zIndex: `${props.block.zIndex}`
        }));
        // 注入editor-config 提供的 config
        const config = inject('config');

        const blockRef = ref(null)
        onMounted(() => {
            let { offsetWidth, offsetHeight } = blockRef.value;
            if (props.block.alignCenter) { // 说明是拖拽松手的时候才渲染的，其他的默认渲染到页面上的内容不需要居中
                props.block.left = props.block.left - offsetWidth / 2;
                props.block.top = props.block.top - offsetHeight / 2; // 原则上重新派发事件
                props.block.alignCenter = false; // 让渲染后的结果才能去居中
            }
            props.block.width = offsetWidth;
            props.block.height = offsetHeight;
        })

        return () => {
            // 通过block的key属性直接获取对应的组件 
            const component = config.componentMap[props.block.key];

            // 获取 render 函数，传入属性渲染对应组件
            const RenderComponent = component.preview({
                size: props.block.hasResize ? { width: props.block.width, height: props.block.height } : {},
                props: props.block.props,
                events: Object.keys(props.block.events || {}).reduce((prev, eventName) => {
                    let event = props.block.events[eventName]
                    prev[eventName] = () => {
                        (event.actions || []).forEach(action => {
                            if (action.type = "openUrl") {
                                console.log('openUrl', action.config.pagePath);
                                router.push("/" + action.config.pagePath);
                            }
                        });
                    }
                    console.log(prev)
                    return prev
                }, {}),
                // model: props.block.model  => {default:'username'}  => {modelValue: FormData.username,"onUpdate:modelValue":v=> FormData.username = v}
                model: Object.keys(component.model || {}).reduce((prev, modelName) => {
                    let propName = props.block.model[modelName]; // 'username'
                    prev[modelName] = {
                        modelValue: props.formData[propName], // zfjg
                        "onUpdate:modelValue": v => props.formData[propName] = v
                    }
                    return prev;
                }, {})
            });
            const { width, height } = component.resize || {}
            return <div class="editor-block" style={blockStyles.value} ref={blockRef}>
                {RenderComponent}
                {/* 传递block的目的是为了修改当前block的宽高， component中存放了是修改高度还是宽度 */}
                {props.block.focus && (width || height) && <BlockResize
                    block={props.block}
                    component={component}
                ></BlockResize>}
            </div>
        }
    }
})