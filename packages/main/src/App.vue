<template>
  <div class="app">
    <Editor v-model="state" :formData="formData"></Editor>
  </div>
</template>

<script>
import { ref } from 'vue';
import data from './data.json';
import Editor from './editor/index';
import Range from './components/Range.jsx'
export default {
  components:{
    Editor,
    Range,
   
  },
  setup(){
    //为啥不用reactive 方便实现数据双向绑定，对象不好赋值
    const state = ref(data);

    const formData = ref({
      username:'zfjg',
      password:123,
      start:0,
      end:100
    })

    return {
      state,
      formData
    }
  }
}

</script>

<style lang="scss">
.app{
  position:fixed;
  top:20px;
  left:20px;
  right:20px;
  bottom:20px;
}
</style>
