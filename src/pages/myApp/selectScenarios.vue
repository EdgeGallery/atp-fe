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
  <div class="padding_deafult mainScene">
    <div class="content flex">
      <img
        src="../../assets/images/testscenario.png"
        alt=""
        style="height:100%;"
        class="leftimg"
      >
      <div class="contentScene">
        <img
          src="../../assets/images/processIcon.png"
          alt=""
          class="leftimg"
        >
        <TestScenarios />
      </div>
    </div>
  </div>
</template>
<script>
import TestScenarios from './TestScenarios.vue'
export default {
  components: { TestScenarios },
  data () {
    return {
    }
  }
}
</script>
<style lang="less">
  .mainScene{
    margin: 30px 0;
    .content{
      background-color: #fbfbfb;
      border-radius: 20px;
      box-shadow: 4px 4px 30px 8px rgba(94,64,200,0.06);
      .leftimg{
        padding: 25px 0;
      }
      .contentScene{
        padding: 20px 30px 50px;
      }
    }
  }
</style>
