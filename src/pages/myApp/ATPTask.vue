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
  <div class="task">
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
        <el-table
          v-loading="dataLoading"
          :data="currentData"
          style="width: 100%;"
          border
        >
          <el-table-column
            prop="id"
            :label="$t('myApp.taskNumber')"
          >
            <template slot-scope="scope">
              <el-button
                id="checkReportProess"
                @click="handleClickTaskNo(scope.row)"
                type="text"
                size="small"
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
                @click="handleClickTaskNo(scope.row)"
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
          >
            <template slot-scope="scope">
              <el-button
                id="checkReportBtn"
                @click="handleClickReport(scope.row)"
                type="text"
                :disabled="(scope.row.status==='success' || scope.row.status==='failed')?false:true"
                size="small"
              >
                {{ $t('myApp.checkReport') }}
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
</template>

<script>
import { Atp } from '../../tools/api.js'
import pagination from '../../components/common/Pagination.vue'
export default {
  name: 'Task',
  components: { pagination },
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
        // createTime: '',
        // endTime: ''
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
      userId: sessionStorage.getItem('userId'),
      userName: sessionStorage.getItem('userName')
    }
  },
  mounted () {
    this.getTaskList()
    this.interval = setInterval(() => {
      this.getTaskList()
    }, 20000)
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
    handleClickReport (val) {
      sessionStorage.setItem('taskData', JSON.stringify(val))
      this.$router.push('/atpreport')
    },
    handleClickTaskNo (val) {
      let taskId = val.id
      sessionStorage.setItem('taskId', taskId)
      this.$router.push('/atpprocess')
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
      Atp.taskListApi(this.form).then(
        res => {
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
        },
        () => {
          this.dataLoading = false
          this.$message({
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.getTaskListFail')
          })
          this.clearInterval()
        }
      )
    },
    resetForm () {
      this.form = {
        appName: '',
        status: ''
        // createTime: '',
        // endTime: ''
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
    background-color: #fff;
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
    margin-top: 25px;
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
