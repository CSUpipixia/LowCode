// 列表区可以显示所有的物料
// key对应的组件映射关系 
import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus'
import Range from '../components/Range'

function createEditorConfig() {
    const componentList = [];
    const componentMap = {}

    return {
        componentList,
        componentMap,
        register: (component) => {
            componentList.push(component);
            componentMap[component.key] = component;
        }
    }
}
/*const fontArr = [
    { label: '宋体', value: 'SimSun' },
    { label: '黑体', value: 'SimHei' },
    { label: '微软雅黑', value: 'Microsoft Yahei' },
    { label: '微软正黑体', value: 'Microsoft JhengHei' },
    { label: '楷体', value: 'KaiTi' },
    { label: '新宋体', value: 'NSimSun' },
    { label: '仿宋', value: 'FangSong' },
    { label: '苹方', value: 'PingFang SC' },
    { label: '华文黑体', value: 'STHeiti' },
    { label: '华文楷体', value: 'STKaiti' },
    { label: '华文宋体', value: 'STSong' },
    { label: '华文仿宋', value: 'STFangsong' },
    { label: '华文中宋', value: 'STZhongsong' },
    { label: '华文琥珀', value: 'STHupo' },
    { label: '华文新魏', value: 'STXinwei' },
    { label: '华文隶书', value: 'STLiti' },
    { label: '华文行楷', value: 'STXingkai' },
    { label: '冬青黑体简', value: 'Hiragino Sans GB' },
    { label: '兰亭黑-简', value: 'Lantinghei SC' },
    { label: '翩翩体-简', value: 'Hanzipen SC' },
    { label: '手札体-简', value: 'Hannotate SC' },
    { label: '宋体-简', value: 'Songti SC' },
    { label: '娃娃体-简', value: 'Wawati SC' },
    { label: '魏碑-简', value: 'Weibei SC' },
    { label: '行楷-简', value: 'Xingkai SC' },
    { label: '雅痞-简', value: 'Yapi SC' },
    { label: '圆体-简', value: 'Yuanti SC' },
    { label: '幼圆', value: 'YouYuan' },
    { label: '隶书', value: 'LiSu' },
    { label: '华文细黑', value: 'STXihei' },
    { label: '华文楷体', value: 'STKaiti' },
    { label: '华文宋体', value: 'STSong' },
    { label: '华文仿宋', value: 'STFangsong' },
    { label: '华文中宋', value: 'STZhongsong' },
    { label: '华文彩云', value: 'STCaiyun' },
    { label: '华文琥珀', value: 'STHupo' },
    { label: '华文新魏', value: 'STXinwei' },
    { label: '华文隶书', value: 'STLiti' },
    { label: '华文行楷', value: 'STXingkai' },
    { label: '方正舒体', value: 'FZShuTi' },
    { label: '方正姚体', value: 'FZYaoti' },
    { label: '思源黑体', value: 'Source Han Sans CN' },
    { label: '思源宋体', value: 'Source Han Serif SC' },
    { label: '文泉驿微米黑', value: 'WenQuanYi Micro Hei' },
  ]*/
export let registerConfig = createEditorConfig();
//具体的物料配置
const createRichTextProp = (label) => ({ type: 'richtext', label });
const createInputProp = (label) => ({ type: 'input', label });
const createColorProp = (label) => ({ type: 'color', label });
const createSelectProp = (label, options) => ({ type: 'select', label, options })
const createTableProp = (label, table) => ({ type: 'table', label, table })
const createIptNumberProp =  (label) => ({ type: 'input', label });

registerConfig.register({
    label: '下拉框',
    preview: () => <ElSelect modelValue=""></ElSelect>,
    render: ({ props, model }) => {
        return <ElSelect {...model.default}>
            {(props.options || []).map((opt, index) => {
                return <ElOption label={opt.label} value={opt.value} key={index}></ElOption>
            })}
        </ElSelect>
    },
    key: 'select',
    props: { // [{label:'a',value:'1'},{label:'b',value:2}]
        options: createTableProp('下拉选项', {
            options: [
                { label: '显示值', field: 'label' },
                { label: '绑定值', field: 'value' },
            ],
            key: 'label' // 显示给用户的值 是label值
        })
    },
    model: { // {default:'username'}
        default: '绑定字段'
    }
})

registerConfig.register({
    label: '文本',
    preview: () => '预览文本',
    render: ({ props }) => <span style={{ color: props.color, fontSize: props.size,fontFamily: props.font}}>{props.text || '渲染文本'}</span>,
    key: 'text',
    props: {
        text: createInputProp('文本内容'),
        color: createColorProp('字体颜色'),
        // size: createSelectProp('字体大小', [
        //     { label: '14px', value: '14px' },
        //     { label: '20px', value: '20px' },
        //     { label: '24px', value: '24px' },
        //     { label: '26px', value: '26px' },
        // ])
        font: createSelectProp( '字体设置',  [
            { label: '宋体', value: 'SimSun' },
            { label: '黑体', value: 'SimHei' },
            { label: '微软雅黑', value: 'Microsoft Yahei' },
            { label: '微软正黑体', value: 'Microsoft JhengHei' },
            { label: '楷体', value: 'KaiTi' },
            { label: '新宋体', value: 'NSimSun' },
            { label: '仿宋', value: 'FangSong' },
            { label: '苹方', value: 'PingFang SC' },
            { label: '华文黑体', value: 'STHeiti' },
            { label: '华文楷体', value: 'STKaiti' },
            { label: '华文宋体', value: 'STSong' },
            { label: '华文仿宋', value: 'STFangsong' },
            { label: '华文中宋', value: 'STZhongsong' },
            { label: '华文琥珀', value: 'STHupo' },
            { label: '华文新魏', value: 'STXinwei' },
            { label: '华文隶书', value: 'STLiti' },
            { label: '华文行楷', value: 'STXingkai' },
            { label: '冬青黑体简', value: 'Hiragino Sans GB' },
            { label: '兰亭黑-简', value: 'Lantinghei SC' },
            { label: '翩翩体-简', value: 'Hanzipen SC' },
            { label: '手札体-简', value: 'Hannotate SC' },
            { label: '宋体-简', value: 'Songti SC' },
            { label: '娃娃体-简', value: 'Wawati SC' },
            { label: '魏碑-简', value: 'Weibei SC' },
            { label: '行楷-简', value: 'Xingkai SC' },
            { label: '雅痞-简', value: 'Yapi SC' },
            { label: '圆体-简', value: 'Yuanti SC' },
            { label: '幼圆', value: 'YouYuan' },
            { label: '隶书', value: 'LiSu' },
            { label: '华文细黑', value: 'STXihei' },
            { label: '华文楷体', value: 'STKaiti' },
            { label: '华文宋体', value: 'STSong' },
            { label: '华文仿宋', value: 'STFangsong' },
            { label: '华文中宋', value: 'STZhongsong' },
            { label: '华文彩云', value: 'STCaiyun' },
            { label: '华文琥珀', value: 'STHupo' },
            { label: '华文新魏', value: 'STXinwei' },
            { label: '华文隶书', value: 'STLiti' },
            { label: '华文行楷', value: 'STXingkai' },
            { label: '方正舒体', value: 'FZShuTi' },
            { label: '方正姚体', value: 'FZYaoti' },
            { label: '思源黑体', value: 'Source Han Sans CN' },
            { label: '思源宋体', value: 'Source Han Serif SC' },
            { label: '文泉驿微米黑', value: 'WenQuanYi Micro Hei' },
          ] ),
        size:createIptNumberProp('字体大小')

    }
})

registerConfig.register({
    label: '按钮',
    resize: {
        width: true,
        height: true
    },
    preview: () => <ElButton>预览按钮</ElButton>,
    render: ({ props, size }) =>
        <ElButton
            style={{ height: size.height + 'px', width: size.width + 'px' }}
            type={props.type}
            size={props.size}
        >{props.text || '渲染按钮'}</ElButton>,
    key: 'button',
    props: {
        text: createInputProp('按钮内容'),
        type: createSelectProp('按钮类型', [
            { label: '基础', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '危险', value: 'danger' },
            { label: '文本', value: 'text' },
        ]),
        size: createSelectProp('按钮尺寸', [
            { label: '默认', value: '' },
            { label: '中等', value: 'medium' },
            { label: '小', value: 'small' },
            { label: '极小', value: 'mini' },
        ])
    }
})

registerConfig.register({
    label: '输入框',
    resize: {
        width: true, // 更改输入框的横向大小
    },
    preview: () => <ElInput placeholder="预览输入框"></ElInput>,
    render: ({ model, size }) => <ElInput placeholder="渲染输入框" {...model.default} style={{ width: size.width + 'px' }}></ElInput>,
    key: 'input',
    model: { // {default:'username'}
        default: '绑定字段'
    }
});

registerConfig.register({
    label: '范围选择器',
    preview: () => <Range placeholder="预览输入框"></Range>,
    render: ({ model }) => {
        return <Range {...{
            start: model.start.modelValue, // @update:start
            end: model.end.modelValue,
            'onUpdate:start': model.start['onUpdate:modelValue'],
            'onUpdate:end': model.end['onUpdate:modelValue']
        }}></Range>
    },
    model: {
        start: '开始范围字段',
        end: '结束范围字段'
    },
    key: 'range',
})


// model:{// {start:'start',end:'end'}
//     start:'开始字段',
//     end:'结束字段'
// }