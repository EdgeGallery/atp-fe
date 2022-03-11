<!--
  -  Copyright 2020-2021 Huawei Technologies Co., Ltd.
  -
  -  Licensed under the Apache License, Version 2.0 (the "License");
  -  you may not use this file except in compliance with the License.
  -  You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  -  Unless required by applicable law or agreed to in writing, software
  -  distributed under the License is distributed on an "AS IS" BASIS,
  -  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  -  See the License for the specific language governing permissions and
  -  limitations under the License.
  -->
<template>
  <div class="padding_deafult mainProcess">
    <div class="content flex">
      <img
        src="../../assets/images/testscenario.png"
        alt=""
        style="height:100%;width: 20%;margin-top:30px;"
        class="leftimg"
      >
      <div class="contentProcess">
        <img
          src="../../assets/images/processIcontwo.png"
          alt=""
          class="leftimg"
        >
        <Atpprocess :isinternal="isInternal" />
      </div>
    </div>
  </div>
</template>
<script>
import Atpprocess from './ATPProcess.vue'
export default {
  components: { Atpprocess },
  data () {
    return {
      isInternal: true
    }
  }
}
</script>
<style lang="less">
  .mainProcess{
    margin: 30px 0;
    .content{
      border-radius: 20px;
      .leftimg{
        padding: 25px 0;
      }
      .contentProcess{
        padding: 20px 30px 50px;
        width: 80%;
      }
    }
  }
</style>
