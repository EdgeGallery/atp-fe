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
      layout="total, sizes, prev, pager, next, jumper"
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
      this.totalNum = val.length
      this.handleCurrentPageChange(1)
    },
    size (val) {
      this.handlePageSizeChange(val * 2)
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
      this.returnTableData()
    },
    handleCurrentPageChange (val) {
      this.currentPage = val
      this.returnTableData()
    },
    returnTableData () {
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      let currentPageData = this.data.slice(start, end)
      this.$emit('getCurrentPageData', currentPageData)
    }
  }
}

</script>
<style lang="less">
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #f7f3ff;
    color: #9f6dee;
    border-radius: 50%;
  }
  .el-pagination.is-background .el-pager li {
    background-color: #fff;
    color: #4e4e4e;
  }
  .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next{
    background-color: #f7f3ff;
    color: #4d4d4e;
    border-radius: 50%;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #9f6dee;
  }
  .el-pagination.is-background .btn-prev:disabled, .el-pagination.is-background .btn-next:disabled {
    display: none;
  }
</style>
