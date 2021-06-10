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
    <div class="task padding200">
      <div style="margin:20px 0;font-size:14px;color: #1C1C1C;">
        <span>{{ $t('testCase.applicationTestPlatform') }}</span>
        <span>></span>
        <span>{{ $t('atp.taskManage') }}</span>
      </div>
      <div class="task-main">
        <div class="flex enter-search">
          <div class="flex">
            <el-input
              v-model="form.appName"
              prefix-icon="el-icon-search"
              placeholder="请输入名称进行搜索"
              size="small"
            />
            <el-select
              size="small"
              v-model="form.status"
              :placeholder="$t('myApp.testStatus')"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
            <el-button
              size="small"
              class="light-button"
              @click="resetForm"
            >
              {{ $t('myApp.reset') }}
            </el-button>
            <el-button
              size="small"
              class="dark-button"
              @click="getTaskList"
            >
              {{ $t('myApp.inquire') }}
            </el-button>
          </div>
          <div>
            <el-button
              v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1"
              size="small"
              class="dark-button"
              @click="deleteTask"
              :disabled="taskIds.length===0?true:false"
            >
              {{ $t('common.delete') }}
            </el-button>
          </div>
        </div>
        <div class="task-content">
          <el-table
            v-loading="dataLoading"
            :data="currentData"
            style="width: 100%;"
            header-cell-class-name="headerStyle"
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
                <img
                  v-if="scope.row.status=='success'"
                  src="../../assets/images/successful.png"
                  alt=""
                >
                <img
                  v-else-if="scope.row.status=='failed'"
                  src="../../assets/images/failed.png"
                  alt=""
                >
                <img
                  v-if="scope.row.status=='running'"
                  src="../../assets/images/running.png"
                  alt=""
                >
                <img
                  v-if="scope.row.status=='waiting'"
                  src="../../assets/images/waiting.png"
                  alt=""
                >
                <img
                  v-if="scope.row.status=='created'"
                  src="../../assets/images/created.png"
                  alt=""
                >
                <img
                  v-if="scope.row.status=='create failed'"
                  src="../../assets/images/create failed.png"
                  alt=""
                >
                <span> {{ scope.row.status }}</span>
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
              width="250"
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
                  v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1"
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
            是否要继续删除测试任务?
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
            @click="confirmDeleteTask"
          >
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
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
      updateData: [],
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
      authorities: sessionStorage.getItem('authorities'),
      reportData: [],
      language: localStorage.getItem('language'),
      visible: false,
      deleteVisible: false
    }
  },
  mounted () {
    this.getTaskList()
  },
  beforeDestroy () {
    this.clearInterval()
  },
  methods: {
    getCurrentPageData (val) {
      this.currentData = val
      this.getOneTaskStatus()
    },
    clearInterval () {
      clearTimeout(this.interval)
      this.interval = null
    },
    jumpToReport (val) {
      let taskId = val.id
      let routeData = this.$router.resolve({ name: 'atpreport', query: { taskId: taskId } })
      window.open(routeData.href, '_blank')
    },
    handleClickTaskNo (row) {
      let taskId = row.id
      sessionStorage.setItem('taskId', taskId)
      let routeData = this.$router.resolve({ name: 'testprocess', query: { taskId: taskId } })
      window.open(routeData.href, '_blank')
    },
    modifyStatus (row) {
      let taskId = row.id
      let routeData = this.$router.resolve({ name: 'testprocess', query: { taskId: taskId } })
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
      }).catch(() => {
        this.dataLoading = false
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'warning',
          message: this.$t('promptMessage.getTaskListFail')
        })
      })
    },
    getOneTaskStatus () {
      this.currentData.forEach((item, index) => {
        let id = item.id
        if (item.status === 'running' || item.status === 'waiting' || item.status === 'created' || item.status === 'create failed') {
          Userpage.getTaskApi(id).then(res => {
            let data = res.data
            let newDateBegin = this.dateChange(data.createTime)
            data.createTime = newDateBegin
            let newDateEnd = this.dateChange(data.endTime)
            data.endTime = newDateEnd
            this.currentData.splice(index, 1, data)
          })
        }
      })
    },
    handleClose () {
      this.deleteVisible = false
    },
    deleteTask () {
      this.deleteVisible = true
    },
    confirmDeleteTask () {
      this.deleteVisible = false
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
    },
    resetForm () {
      this.form = {
        appName: '',
        status: ''
      }
      this.getTaskList()
    },
    dateChange (dateStr) {
      if (dateStr) {
        let date = new Date(Date.parse(dateStr))
        let Y = date.getFullYear()
        let M = date.getMonth() + 1
        let D = date.getDate()
        let H = date.getHours()
        let m = date.getMinutes()
        let s = date.getSeconds()
        return Y + '-' +
          (M > 9 ? M : '0' + M) +
          '-' +
          (D > 9 ? D : '0' + D) +
          ' ' +
          (H > 9 ? H : '0' + H) +
          ':' +
          (m > 9 ? m : '0' + m) +
          ':' +
          (s > 9 ? s : '0' + s)
      }
    }
  }
}
</script>

<style lang='less'>
.task {
  .task-main {
    background-color: #fff;
    padding: 15px 10px 35px;
    .enter-search{
      justify-content: space-between;
      .el-input, .el-select{
        margin-right: 20px !important;
      }
      .el-input__inner{
        border: 1px solid #380879 !important;
      }
      .el-input__inner:focus {
        outline: none !important;
        border-color: #380879 !important;
      }
      .el-button:active {
          border-color: #380879;
          outline: none;
      }
      .el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
        color: #fff;
        background-image: none;
        background-color: #886baf !important;
        border-color: #886baf;
      }
    }
  .task-content {
    padding: 20px 0;
      img{
        vertical-align: middle;
      }
      span{
        color: #380879;
        font-size: 16px;
      }
      .el-button--text{
        color: #380879;
        font-size: 16px;
        span{
          border-bottom: 1px solid #5d3692;
        }
      }
      .el-button--text.is-disabled{
        span{
          color: #999999;
          border-bottom: none;
        }
      }
    }
  }
}
</style>
