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
  <div>
    <Navcomp />
    <div class="task padding_deafult">
      <div class="title_top title_left defaultFontBlod">
        {{ $t('atp.taskManage') }}
        <span class="line_bot" />
      </div>
      <Atptask
        :isinternal="isInternal"
        class="common-div"
      />
    </div>
  </div>
</template>
<script>
import Atptask from '../myApp/ATPTask.vue'
import Navcomp from '../../components/layout/Nav.vue'
export default {
  components: { Atptask, Navcomp },
  data () {
    return {
      isInternal: true
    }
  }
}
</script>
