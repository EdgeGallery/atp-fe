<!--
  -  Copyright 2020 Huawei Technologies Co., Ltd.
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
  <div
    class="bread-crumb"
    v-if="isShow"
  >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">
        {{ $t('nav.atp') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="item in breadCrumbData"
        :key="item.name"
        :to="item.path"
      >
        {{ language === 'en' ? item.nameEn : item.nameCn }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data () {
    return {
      breadCrumbData: [],
      isShow: false,
      language: localStorage.getItem('language')
    }
  },
  watch: {
    $route (route) {
      this.isShow = false
      this.breadCrumbData = route.meta.breadcrumb
      if (this.breadCrumbData && this.breadCrumbData.length > 0) this.isShow = true
    },
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
    }
  },
  methods: {},
  mounted () {
    this.breadCrumbData = this.$route.meta.breadcrumb
    if (this.breadCrumbData && this.breadCrumbData.length > 0) this.isShow = true
  }
}
</script>
<style lang='less'>
.bread-crumb {
  .el-breadcrumb {
    line-height: 60px;
    font-size: 14px;
    .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link{
      font-weight: normal;
      color: #999999;
    }
    .el-breadcrumb__item:last-child{
      .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link{
         color: #280b4e !important;
      }
    }
  }
}
</style>
