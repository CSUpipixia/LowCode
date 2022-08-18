import {events} from './events';
export function useMenuDragger(containerRef, data){
    console.log('当前点击的组件',containerRef);
    //
    let currentComponent = null;
    //dragenter当被鼠标拖动的对象进入其容器范围内时触发此事件
    const dragenter = (e) => {
        e.dataTransfer.dropEffect = 'move'; // h5拖动的图标
    }
    //在dragover中一定要执行preventDefault()，否则ondrop事件不会被触发。？？？
    const dragover = (e) => {
        e.preventDefault();
    }
    //dragleave当被鼠标拖动的对象离开其容器范围内时触发此事件
    const dragleave = (e) => {
        e.dataTransfer.dropEffect = 'none';
    }
    //drop在一个拖动过程中，释放鼠标键时触发此事件
    const drop = (e) => {
       
        let blocks =  data.value.blocks; // 内部已经渲染的组件
        data.value = {...data.value,blocks:[
            ...blocks,
            {
                top:e.offsetY,
                left:e.offsetX,
                zIndex:1,
                key:currentComponent.key,
                alignCenter:true, // 设置松手的时候鼠标在组件居中
                props:{},
                model:{}
            }
        ]}
        currentComponent = null;
    }
    const dragstart = (e, component) => {
        // dragenter进入元素中 添加一个移动的标识
        // dragover 在目标元素经过 必须要阻止默认行为 否则不能触发drop
        // dragleave 离开元素的时候 需要增加一个禁用标识
        // drop 松手的时候 根据拖拽的组件 添加一个组件
        containerRef.value.addEventListener('dragenter', dragenter)
        containerRef.value.addEventListener('dragover', dragover)
        containerRef.value.addEventListener('dragleave', dragleave)
        containerRef.value.addEventListener('drop', drop)
        currentComponent = component
        events.emit('start'); // 发布start
    }
    const dragend = (e)=>{
        containerRef.value.removeEventListener('dragenter', dragenter)
        containerRef.value.removeEventListener('dragover', dragover)
        containerRef.value.removeEventListener('dragleave', dragleave)
        containerRef.value.removeEventListener('drop', drop)
        events.emit('end'); // 发布end
    }
    return {
        dragstart,
        dragend
    }
}