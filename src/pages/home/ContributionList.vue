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
    <div class="contribution padding_deafult">
      <div class="title_top title_left defaultFontBlod">
        {{ $t('nav.contributionMgmt') }}
        <span class="line_bot" />
      </div>
      <div class="main">
        <div class="header flex">
          <div class="search flex">
            <el-input
              v-model="form.name"
              prefix-icon="el-icon-search"
              :placeholder="$t('testCase.provideNameSearch')"
              size="small"
              @clear="selectContributionList"
              @change="selectContributionList"
            />
          </div>
          <div>
            <el-button
              size="small"
              class="dark-button"
              @click="deleteCase"
              :disabled="ids.length===0?true:false"
            >
              {{ $t('common.delete') }}
            </el-button>
          </div>
        </div>
        <div class="content">
          <el-table
            v-loading="dataLoading"
            :data="pageData"
            header-cell-class-name="headerStyle"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              :label="$t('testCase.caseName')"
            />
            <el-table-column
              prop="type"
              :label="$t('testCase.type')"
            >
              <template
                slot-scope="scope"
              >
                {{ scope.row.type==='script' ? $t('modelmgmt.script') : $t('modelmgmt.text') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="objective"
              :label="$t('testCase.casePurpose')"
            />
            <el-table-column
              prop="step"
              :label="$t('testCase.step')"
            />
            <el-table-column
              prop="expectResult"
              :label="$t('testCase.expectedResult')"
            />
            <el-table-column
              prop="createTime"
              :label="$t('testCase.createTime')"
            />
            <el-table-column
              :label="$t('myApp.operation')"
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
          <div
            class="pagebar"
            style="margin-top: 20px"
          >
            <pagination
              :table-data="pageData"
              @getCurrentPageData="getCurrentPageData"
              :list-total="listTotal"
            />
          </div>
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
            {{ $t('promptMessage.deleteContrubuteCase') }}
          </p>
        </div>
        <div
          slot="footer"
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
      pageData: [],
      dataLoading: true,
      deleteVisible: false,
      ids: [],
      form: {
        name: ''
      },
      language: localStorage.getItem('language'),
      limitSize: 5,
      offsetPage: 0,
      listTotal: 0
    }
  },
  mounted () {
    this.getAllcontribution()
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
    },
    offsetPage (val, oldVal) {
      this.offsetPage = val
      this.getAllcontribution()
    },
    limitSize (val, oldVal) {
      this.limitSize = val
      this.getAllcontribution()
    }
  },
  methods: {
    selectContributionList () {
      sessionStorage.setItem('currentPage', 1)
      this.getAllcontribution()
    },
    getCurrentPageData (val, pageSize, start) {
      this.limitSize = pageSize
      this.offsetPage = start
    },
    getAllcontribution () {
      const params = { name: this.form.name, limit: this.limitSize, offset: this.offsetPage }
      Taskmgmt.contributionsApi(params).then(res => {
        let data = res.data.results
        this.listTotal = res.data.total
        this.dataLoading = false
        data.forEach((item, index) => {
          let newDateBegin = this.dateChange(item.createTime)
          item.createTime = newDateBegin
        })
        this.pageData = data
      }).catch(() => {
        this.dataLoading = false
      })
    },
    dateChange (dateStr) {
      if (dateStr) {
        let date = new Date(Date.parse(dateStr))
        let Y = date.getFullYear()
        let M = date.getMonth() + 1
        let D = date.getDate()
        return Y + '-' +
          (M > 9 ? M : '0' + M) +
          '-' +
          (D > 9 ? D : '0' + D)
      }
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
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'warning',
          message: this.$t('promptMessage.deleteFail')
        })
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
.contribution{
  .main{
    background: #fff;
    padding: 30px 60px 60px;
    border-radius: 20px;
    .header{
      justify-content: space-between;
      .el-input__inner{
        border: 1px solid #380879 !important;
      }
      .el-input__inner:focus {
        outline: none !important;
        border-color: #380879 !important;
      }
      .el-input{
        margin-right: 20px !important;
      }
    }
    .content{
      padding: 20px 0;
    }
  }
    .el-button:active {
        border-color: #380879;
        outline: none;
    }
    .el-button:hover, .el-button:focus {
        color: #fff;
        border-color: #380879;
        background-color: #380879;
    }
    .el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
        color: #fff;
        background-image: none;
        background-color: #886baf !important;
        border-color: #886baf;
    }
}
</style>
