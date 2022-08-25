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
    Range
  },
  setup(){
    const formData = ref({
      username:'lowcode',
      password:'admin123',
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
  top:5px;
  left:20px;
  right:20px;
  bottom:20px;
}
</style>
