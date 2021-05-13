<!--
  -  Copyright 2021 Huawei Technologies Co., Ltd.
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
    <div class="task padding240">
      <div style="margin:20px 0;font-size:14px;color: #1C1C1C;">
        <span>{{ $t('testCase.applicationTestPlatform') }}</span>
        <span>></span>
        <span>贡献管理</span>
      </div>
      <div style="background: #fff; padding: 15px 30px 55px;">
        <div style="display: flex;">
          <div style="display: flex;width:90%;">
            <el-input
              v-model="namequery"
              prefix-icon="el-icon-search"
              placeholder="请输入名称进行搜索"
              size="small"
              class="search_input"
            />
            <el-button
              class="dark-button"
              @click="getAllcontribution"
            >
              搜索
            </el-button>
          </div>
          <div>
            <el-button
              class="dark-button"
              @click="deleteCase"
              :disabled="ids.length===0?true:false"
            >
              批量删除
            </el-button>
          </div>
        </div>
        <div class="content">
          <el-table
            v-loading="dataLoading"
            :data="currentData"
            header-cell-class-name="headerStyle"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="测试用例名称"
            />
            <el-table-column
              prop="type"
              label="贡献类型"
            />
            <el-table-column
              prop="objective"
              label="测试目的"
            />
            <el-table-column
              prop="step"
              label="测试步骤"
            />
            <el-table-column
              prop="expectResult"
              label="预期结果"
            />
            <el-table-column
              prop="createTime"
              label="创建时间"
            />
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <img
                  v-if="scope.row.type==='script'"
                  src="../../assets/images/download.png"
                  @click="downloadScript(scope.row)"
                  alt=""
                >
                <img
                  v-else
                  src="../../assets/images/notdownload.png"
                  alt=""
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          class="pagebar"
          style="margin-top: 20px"
        >
          <pagination
            :table-data="pageData"
            @getCurrentPageData="getCurrentPageData"
          />
        </div>
      </div>
      <el-dialog
        :visible.sync="deleteVisible"
        :close-on-click-modal="false"
        title="提示"
        width="25%"
        class="prompt-dialog"
      >
        <div style="text-align: center;">
          <img
            src="../../assets/images/deleteicon.png"
            alt=""
          >
          <p class="prompt-text">
            是否要继续删除贡献用例?
          </p>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            style="margin-right:40px;"
            class="light-button"
            @click="handleClose"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            class="dark-button"
            @click="confirmDeleteCase"
          >
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Taskmgmt } from '../../tools/api.js'
import pagination from '../../components/common/Pagination.vue'
import Navcomp from '../../components/layout/Nav.vue'
export default {
  name: 'Apttask',
  components: { pagination, Navcomp },
  data () {
    return {
      currentData: [],
      pageData: [],
      dataLoading: true,
      deleteVisible: false,
      ids: [],
      namequery: ''
    }
  },
  mounted () {
    this.getAllcontribution()
  },
  methods: {
    getCurrentPageData (val) {
      this.currentData = val
    },
    getAllcontribution () {
      Taskmgmt.contributionsApi(this.namequery).then(res => {
        this.pageData = res.data
        this.dataLoading = false
      })
    },
    handleSelectionChange (val) {
      this.ids = []
      val.forEach(item => {
        this.ids.push(item.id)
      })
    },
    handleClose () {
      this.deleteVisible = false
    },
    deleteCase () {
      this.deleteVisible = true
    },
    confirmDeleteCase () {
      this.deleteVisible = false
      let param = {
        ids: this.ids
      }
      Taskmgmt.deleteCaseApi(param).then(res => {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'success',
          message: this.$t('promptMessage.deleteSuccess')
        })
        this.getAllcontribution()
      })
    },
    downloadScript (row) {
      Taskmgmt.downLoadCaseApi(row.id).then(res => {
        console.log('download success')
      })
    }
  }
}
</script>

<style lang='less'>
.el-input__inner{
  border: 1px solid #380879;
}
.el-input{
  width: 300px;
  margin-right: 20px;
}
.el-input__inner:focus {
    outline: none;
    border-color: #380879;
}
.dark-button{
      background: #380879;
      color: #fff;
      border-radius: 10px;
}
.light-button{
      border-color:#380879 ;
      color: #380879;
      border-radius: 10px;
}
.el-button{
  padding: 9px 20px;
}
.el-button:active {
    border-color: #380879;
    outline: none;
}
.el-button:hover, .el-button:focus {
    color: #FFF;
    border-color: #380879;
    background-color: #380879;
}
.el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
    color: #fff;
    background-image: none;
    background-color: #886baf;
    border-color: #886baf;
}
.content{
  padding: 20px 0;
  .headerStyle{
      background: #ebe6f1;
      color: #666666;
      padding: 0;
      height: 60px;
      line-height: 60px;
      }
    .el-table td{
      font-size: 16px;
      color: #333;
      padding: 0;
      height: 80px;
      line-height: 80px;
      border-bottom: 2px solid #f5eeff;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #380879;
      border-color: #380879;
    }
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #380879;
      border-color: #380879;
    }
    .el-checkbox__inner:hover {
      border-color: #380879;
    }
}
  .prompt-dialog{
    .el-dialog__header{
      border: 1px solid #c9c9c9;
    }
    .el-dialog__title{
      font-size: 20px;
      color: #333333;
    }
    .el-dialog__body{
      padding: 20px 20px;
    }
    .prompt-text{
      font-size: 18px;
      color: #666666;
      padding-top: 10px;
    }
    .dialog-footer{
      text-align: center;
    }
  }
</style>
