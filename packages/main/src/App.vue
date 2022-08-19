<template>
  <div class="app">
    <Editor :formData="formData"></Editor>
  </div>
</template>

<script>
import { ref } from 'vue';
import Editor from './editor/index';
import Range from './components/Range.jsx'
export default {
  components:{
    Editor,
    Range,
   
  },
  setup(){
    const state = ref(data);

    const formData = ref({
      username:'zfjg',
      password:123,
      start:0,
      end:100
    })

    return {
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
