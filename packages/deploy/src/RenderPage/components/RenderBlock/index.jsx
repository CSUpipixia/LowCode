import { computed, defineComponent, inject, onMounted, ref } from "vue";
import { registerConfig as config } from "@/utils/editor-config";
import './index.scss'

export default defineComponent({
  //从父组件editor index 收到的block 和formdata 渲染列表组件
  props: {
    block: { type: Object },
    formData: { type: Object },
    scale: {type: Number}
  },
  setup(props) {

    // 计算属性 - 计算出需要渲染组件的宽高 block top left
    // console.log('props.data',props.data);
    const blockStyles = computed(() => ({
      top: `${props.scale * props.block.top}px`,
      left: `${props.scale * props.block.left}px`,
      zIndex: `${props.block.zIndex}`,
    }));

    return () => {
      // 通过block的key属性直接获取对应的组件
      const component = config.componentMap[props.block.key];

      return (
        <div class="editor-block" style={blockStyles.value}>
          {
            component.render({
              size: props.block.hasResize
                ? { width: props.scale * props.block.width, height: props.scale * props.block.height }
                : {},
              props: props.block.props,
              // model: props.block.model  => {default:'username'}  => {modelValue: FormData.username,"onUpdate:modelValue":v=> FormData.username = v}
      
              model: Object.keys(component.model || {}).reduce((prev, modelName) => {
                let propName = props.block.model[modelName]; // 'username'
                prev[modelName] = {
                  modelValue: props.formData[propName], // zfjg
                  "onUpdate:modelValue": (v) => (props.formData[propName] = v),
                };
                return prev;
              }, {}),
            })
          }
        </div>
      );
    };
  },
});
