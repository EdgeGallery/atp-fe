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
  <div>
    <Navcomp />
    <div class="task padding56">
      <div style="margin:20px 0">
        <span>应用测试平台</span>
        <span>></span>
        <span>任务管理</span>
      </div>
      <div class="task-search">
        <el-form
          ref="form"
          :model="form"
          label-width="150px"
        >
          <el-row>
            <el-col
              :span="6"
              :offset="6"
            >
              <el-form-item :label="$t('atp.applicationName')">
                <el-input
                  id="appName"
                  v-model="form.appName"
                  :placeholder="$t('atp.applicationName')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                id="testStatus"
                :label="$t('myApp.testStatus')"
              >
                <el-select
                  v-model="form.status"
                  :placeholder="$t('myApp.testStatus')"
                  class="statusSelect"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="search-btn">
            <el-button
              id="resetBtn"
              size="small"
              @click="resetForm"
            >
              {{ $t('myApp.reset') }}
            </el-button>
            <el-button
              id="inquireBtn"
              type="primary"
              size="small"
              @click="getTaskList"
            >
              {{ $t('myApp.inquire') }}
            </el-button>
          </div>
        </el-form>
        <div class="task-content">
          <div
            class="delBtn rt"
            v-if="userName==='admin'"
          >
            <el-button
              size="small"
              type="primary"
              @click="deleteTask"
              :disabled="taskIds.length===0?true:false"
            >
              {{ $t('common.delete') }}
            </el-button>
          </div>
          <el-table
            v-loading="dataLoading"
            :data="currentData"
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="id"
              :label="$t('myApp.taskNumber')"
            >
              <template slot-scope="scope">
                <el-button
                  id="checkReportProess"
                  type="text"
                  size="small"
                  @click="handleClickTaskNo(scope.row)"
                  :disabled="(scope.row.status==='success' || scope.row.status==='failed' || scope.row.status==='running')?false:true"
                >
                  {{ scope.row.id }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="appName"
              :label="$t('atp.applicationName')"
            />
            <el-table-column
              prop="providerId"
              :label="$t('myApp.provider')"
            />
            <el-table-column :label="$t('myApp.testStatus')">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.status=='success'"
                  class="el-icon-success success"
                  title="success"
                />
                <span
                  v-else-if="scope.row.status=='failed'"
                  class="el-icon-error error"
                  title="failed"
                />
                <span
                  v-else-if="scope.row.status=='running'"
                  class="el-icon-loading primary"
                  title="running"
                />
                <span
                  v-else
                  class="el-icon-finished primary"
                  title="success"
                />
                <el-button
                  id="statusBtn"
                  style="margin-left:20px;"
                  type="text"
                  size="small"
                >
                  {{ scope.row.status }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              :label="$t('myApp.startTime')"
            />
            <el-table-column
              prop="endTime"
              :label="$t('myApp.endTime')"
            />
            <el-table-column
              fixed="right"
              :label="$t('myApp.operation')"
              width="240"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  :disabled="(scope.row.status==='success' || scope.row.status==='failed')?false:true"
                  size="small"
                  @click="jumpToReport(scope.row)"
                  style="margin-right:10px;"
                >
                  {{ $t('myApp.checkReport') }}
                </el-button>
                <el-button
                  v-if="userName==='admin'"
                  type="text"
                  :disabled="scope.row.status==='running'?false:true"
                  size="small"
                  @click="modifyStatus(scope.row)"
                >
                  {{ $t('process.modifyStatus') }}
                </el-button>
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
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Taskmgmt, Userpage } from '../../tools/api.js'
import pagination from '../../components/common/Pagination.vue'
import Navcomp from '../../components/layout/Nav.vue'
export default {
  name: 'Apttask',
  components: { pagination, Navcomp },
  data () {
    return {
      expireTimeOption: {
        disabledDate (date) {
          return date.getTime() > Date.now()
        }
      },
      form: {
        appName: '',
        status: ''
      },
      pageData: [],
      caseList: [],
      options: [
        {
          value: 1,
          label: 'running'
        },
        {
          value: 2,
          label: 'waiting'
        },
        {
          value: 3,
          label: 'success'
        },
        {
          value: 4,
          label: 'failed'
        },
        {
          value: 5,
          label: 'created'
        },
        {
          value: 6,
          label: 'create failed'
        }
      ],
      value: '',
      interval: '',
      dialogTitle: '',
      telnetid: '',
      dataLoading: true,
      currentData: [],
      taskIds: [],
      userId: sessionStorage.getItem('userId'),
      userName: sessionStorage.getItem('userName'),
      reportData: [],
      language: localStorage.getItem('language'),
      visible: false
    }
  },
  mounted () {
    this.getTaskList()
    this.interval = setInterval(() => {
      this.getOneTaskStatus()
    }, 2000)
  },
  beforeDestroy () {
    this.clearInterval()
  },
  beforeRouteEnter (to, from, next) {
    if (from.path.indexOf('/test/report') === -1) {
      sessionStorage.removeItem('currentPage')
    }
    next()
  },
  methods: {
    getCurrentPageData (val) {
      this.currentData = val
    },
    clearInterval () {
      clearTimeout(this.interval)
      this.interval = null
    },
    // handleClickReport (val) {
    //   this.reportData = []
    //   val.testScenarios.forEach(item => {
    //     let reportobj = {
    //       taskId: '',
    //       label: '',
    //       nameCh: '',
    //       nameEn: '',
    //       scenarioId: ''
    //     }
    //     reportobj.label = item.label
    //     reportobj.nameCh = item.nameCh
    //     reportobj.nameEn = item.nameEn
    //     reportobj.scenarioId = item.id
    //     reportobj.taskId = val.id
    //     this.reportData.push(reportobj)
    //   })
    // },
    jumpToReport (val) {
      let taskId = val.id
      let routeData = this.$router.resolve({ name: 'atpreport', query: { taskId: taskId } })
      window.open(routeData.href, '_blank')
    },
    handleClickTaskNo (row) {
      let taskId = row.id
      sessionStorage.setItem('taskId', taskId)
      let routeData = this.$router.resolve({ name: 'atpprocess', query: { taskId: taskId } })
      window.open(routeData.href, '_blank')
    },
    modifyStatus (row) {
      let taskId = row.id
      let routeData = this.$router.resolve({ name: 'atpprocess', query: { taskId: taskId } })
      window.open(routeData.href, '_blank')
    },
    handleSelectionChange (val) {
      this.taskIds = []
      val.forEach(item => {
        this.taskIds.push(item.id)
      })
    },
    contrastTime () {
      if (this.form.endTime && this.form.createTime > this.form.endTime) {
        this.$message({
          message: this.$t('promptMessage.contrastTime'),
          type: 'warning'
        })
        this.form.createTime = ''
        this.form.endTime = ''
      }
    },
    getTaskList () {
      Taskmgmt.taskListApi(this.form).then(res => {
        let data = res.data
        data.forEach((item, index) => {
          let newDateBegin = this.dateChange(item.createTime)
          item.createTime = newDateBegin
          let newDateEnd = this.dateChange(item.endTime)
          item.endTime = newDateEnd
        })
        this.pageData = data
        this.totalNum = this.pageData.length
        this.dataLoading = false
        if (this.pageData.length === 0) {
          this.clearInterval()
        }
      }).catch(() => {
        this.dataLoading = false
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'warning',
          message: this.$t('promptMessage.getTaskListFail')
        })
        this.clearInterval()
      })
    },
    getOneTaskStatus () {
      this.pageData.forEach((item, index) => {
        let id = item.id
        if (item.status === 'running' || item.status === 'waiting' || item.status === 'created' || item.status === 'create failed') {
          Userpage.getTaskApi(id).then(res => {
            let data = res.data
            let newDateBegin = this.dateChange(data.createTime)
            data.createTime = newDateBegin
            let newDateEnd = this.dateChange(data.endTime)
            data.endTime = newDateEnd
            this.pageData.splice(index, 1, data)
          })
        }
      })
    },
    deleteTask () {
      this.$confirm(this.$t('promptMessage.deletePrompt'), this.$t('promptMessage.prompt'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        let param = {
          taskIds: this.taskIds
        }
        Taskmgmt.deleteTaskApi(param).then(res => {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'success',
            message: this.$t('promptMessage.deleteSuccess')
          })
          this.getTaskList()
        }).catch(() => {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.deleteFail')
          })
        })
      }).catch(() => {
      })
    },
    resetForm () {
      this.form = {
        appName: '',
        status: ''
      }
      this.getTaskList()
    },
    expandChange (row, expandedRows) {},
    dateChange (dateStr) {
      if (dateStr) {
        let date = new Date(Date.parse(dateStr))
        let Y = date.getFullYear()
        let M = date.getMonth() + 1
        let D = date.getDate()
        let H = date.getHours()
        let m = date.getMinutes()
        let s = date.getSeconds()
        let changeDate =
          Y +
          '-' +
          (M > 9 ? M : '0' + M) +
          '-' +
          (D > 9 ? D : '0' + D) +
          ' ' +
          (H > 9 ? H : '0' + H) +
          ':' +
          (m > 9 ? m : '0' + m) +
          ':' +
          (s > 9 ? s : '0' + s)
        return changeDate
      }
    }
  }
}
</script>

<style lang='less'>
.task {
  .el-input--suffix .el-input__inner {
    padding-right: 20px;
  }
  .task-search {
    background-color: white;
    padding: 40px;
    .el-form {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .search-btn {
    text-align: center;
    .el-button {
      padding: 6px 20px;
    }
    .el-button.el-button--default {
      background-color: none;
      color: #688ef3;
      border: 1px solid #688ef3;
    }
    .el-button.el-button--primary {
      background-color: #688ef3;
      color: #fff;
    }
  }
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .task-content {
    // margin-top: 25px;
    .delBtn{
      margin-bottom: 10px;
    }
    .success{
      color: #67c23a;
    }
    .error{
      color: #f56c6c;
    }
    .primary{
      color: #2c3fe9 ;
    }
  }
  .task-content:after {
    content: "";
    display: block;
    clear: both;
  }
  .statusSelect {
    width: 100%;
  }
}
</style>
