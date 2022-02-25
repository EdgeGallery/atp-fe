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
  <div class="my-pagination">
    <el-pagination
      background
      class="rt"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="currentPage"
      :page-sizes="pageSizeArr"
      :page-size="pageSize"
      layout=" sizes, prev, pager, next,total"
      :total="totalNum"
    />
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      required: true,
      type: Array
    },
    size: {
      type: Number,
      default: 5
    },
    listTotal: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      totalNum: 0,
      currentPage: 1,
      data: [],
      pageSize: 5
    }
  },
  watch: {
    tableData (val) {
      this.data = val
      if (this.listTotal) {
        this.totalNum = this.listTotal
      } else {
        this.totalNum = val.length
      }
      this.returnTableData()
      let page = sessionStorage.getItem('currentPage') ? Number(sessionStorage.getItem('currentPage')) : 1
      this.handleCurrentPageChange(page)
    },
    listTotal (val) {
      this.totalNum = val
    }
  },
  computed: {
    pageSizeArr () {
      let arr = []
      for (let i = 1; i < 4; i++) {
        let size = i * this.size
        arr.push(size)
      }
      return arr
    }
  },
  methods: {
    handlePageSizeChange (val) {
      this.pageSize = val
      sessionStorage.setItem('currentPage', 1)
      this.currentPage = 1
      this.returnTableData()
    },
    handleCurrentPageChange (val) {
      this.currentPage = val
      this.returnTableData()
      sessionStorage.setItem('currentPage', val)
    },
    returnTableData () {
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      let currentPageData = this.data.slice(start, end)
      this.$emit('getCurrentPageData', currentPageData, this.pageSize, start)
    }
  }
}

</script>
<style lang="less">
  .my-pagination{
    .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {
      min-width: 24px;
    }
    .el-input--mini .el-input__inner,.el-pager li,.el-pagination button, .el-pagination span:not([class*=suffix]),.el-pagination__editor.el-input .el-input__inner{
      height: 24px;
      line-height: 24px;
      font-size: 14px !important;
    }
    .el-pager li:not(.disabled).active {
      background-color: #fff!important;
      color: #4D2DA8 !important;
      border-radius: 50%;
    }
    .el-pagination.is-background .el-pager li {
      background-color: transparent;
      color: rgba(255, 255, 255, .5);
    }
    .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next{
      background: transparent;
      color: #fff;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      background-color: #fff!important;
      color: #4D2DA8;
      border-radius: 50%;
    }
    .el-pagination__total{
      margin-left: 20px;
      color: #fff;
      font-size: 14px !important;
    }
    .el-pagination .el-select .el-input .el-input__inner{
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      background: transparent;
      color: #fff;
    }
    .el-select .el-input .el-select__caret{
      font-size: 14px;
      color: #fff;
      opacity: 0.4;
    }
  }
    .el-select-dropdown__item.selected{
      color: #4D2DA8 !important;
    }
</style>
