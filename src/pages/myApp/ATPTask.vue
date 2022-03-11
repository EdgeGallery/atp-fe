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
    <div class="task-main">
      <div class="flex enter-search">
        <div class="flex">
          <el-input
            class="common-input right-space"
            v-model="form.appName"
            prefix-icon="el-icon-search"
            :placeholder="$t('testCase.provideNameSearch')"
          />
          <el-select
            class="common-select right-space"
            v-model="form.status"
            :placeholder="$t('myApp.testStatus')"
          >
            <el-option
              v-for="item in options"
              :key="item.index"
              :label="language==='cn'?item.labelCn:item.labelEn"
              :value="item.labelEn"
            />
          </el-select>
          <el-button
            class="common-btn"
            @click="resetForm"
          >
            {{ $t('myApp.reset') }}
          </el-button>
          <el-button
            class="common-btn"
            @click="selectList"
          >
            {{ $t('myApp.inquire') }}
          </el-button>
        </div>
        <div>
          <el-button
            class="common-btn"
            @click="deleteTask"
            :disabled="ids.length===0?true:false"
          >
            {{ $t('common.delete') }}
          </el-button>
        </div>
      </div>
      <div class="task-content">
        <el-table
          v-loading="dataLoading"
          :data="pageData"
          style="width: 100%;"
          class="common-table"
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
              <el-link
                :underline="false"
                @click="handleClickTaskNo(scope.row)"
                :disabled="(scope.row.status==='success' || scope.row.status==='failed' || scope.row.status==='running')?false:true"
              >
                {{ scope.row.id }}
              </el-link>
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
          <el-table-column
            :label="$t('myApp.testStatus')"
            width="150"
          >
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
              <span v-if="language==='en'"> {{ scope.row.status }}</span>
              <span v-else-if="scope.row.status=='success'"> 成功</span>
              <span v-else-if="scope.row.status=='failed'"> 失败</span>
              <span v-else-if="scope.row.status=='running'"> 测试中</span>
              <span v-else-if="scope.row.status=='waiting'"> 等待</span>
              <span v-else-if="scope.row.status=='created'"> 已创建</span>
              <span v-else-if="scope.row.status=='create failed'"> 创建失败</span>
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
            :label="$t('myApp.operation')"
          >
            <template slot-scope="scope">
              <el-button
                class="operaBtn"
                type="text"
                :disabled="(scope.row.status==='success' || scope.row.status==='failed')?false:true"
                size="small"
                @click="jumpToReport(scope.row)"
                style="margin-right:10px;"
              >
                {{ $t('myApp.checkReport') }}
              </el-button>
              <br>
              <el-button
                v-if="(authorities.indexOf('ROLE_ATP_ADMIN')!==-1 && isinternal)"
                class="operaBtn"
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
      append-to-body
      class="prompt-dialog commondlg"
    >
      <div style="text-align: center;">
        <img
          src="../../assets/images/deleteicon.png"
          alt=""
        >
        <p class="prompt-text">
          {{ $t('promptMessage.confirmdeleteTask') }}
        </p>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          style="margin-right:40px;"
          class="common-btn"
          @click="handleClose"
        >
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          class="common-btn"
          @click="confirmDeleteTask"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Taskmgmt, Userpage, getUserInfo } from '../../tools/api.js'
import pagination from '../../components/common/Pagination.vue'
export default {
  name: 'Apttask',
  components: { pagination },
  props: {
    isinternal: {
      type: Boolean,
      default: false
    }
  },
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
          index: 1,
          labelEn: 'running',
          labelCn: '测试中'
        },
        {
          index: 2,
          labelEn: 'waiting',
          labelCn: '等待'
        },
        {
          index: 3,
          labelEn: 'success',
          labelCn: '成功'
        },
        {
          index: 4,
          labelEn: 'failed',
          labelCn: '失败'
        },
        {
          index: 5,
          labelEn: 'created',
          labelCn: '已创建'
        },
        {
          index: 6,
          labelEn: 'create failed',
          labelCn: '创建失败'
        }
      ],
      value: '',
      interval: '',
      dialogTitle: '',
      telnetid: '',
      dataLoading: true,
      ids: [],
      userId: '',
      userName: '',
      authorities: [],
      reportData: [],
      language: localStorage.getItem('language'),
      visible: false,
      deleteVisible: false,
      limitSize: 5,
      offsetPage: 0,
      listTotal: 0,
      currentPage: 1
    }
  },
  beforeMount () {
    getUserInfo().then(res => {
      sessionStorage.setItem('userId', res.data.userId)
      sessionStorage.setItem('userName', res.data.userName)
      this.userName = res.data.userName
      this.authorities = res.data.authorities
    })
  },
  mounted () {
    this.getLanguage()
    this.getTaskList()
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
    },
    offsetPage (val, oldVal) {
      this.offsetPage = val
      this.getTaskList()
    },
    limitSize (val, oldVal) {
      this.limitSize = val
      this.getTaskList()
    }
  },
  beforeDestroy () {
    this.clearInterval()
  },
  beforeRouteEnter (to, from, next) {
    sessionStorage.removeItem('currentPage')
    next()
  },
  methods: {
    getLanguage () {
      let currUrl = window.location.href
      if (currUrl.indexOf('?') !== -1) {
        this.language = currUrl.split('?')[1].split('=')[1]
        localStorage.setItem('language', this.language)
        this.$i18n.locale = this.language
        this.$store.commit('changeLaguage', { language: this.language })
      } else {
        this.language = localStorage.getItem('language')
      }
    },
    // getCurrentPageData (val) {
    //   this.currentData = val
    //   this.getOneTaskStatus()
    // },
    selectList () {
      sessionStorage.setItem('currentPage', 1)
      this.getTaskList()
    },
    getCurrentPageData (val, pageSize, start) {
      this.limitSize = pageSize
      this.offsetPage = start
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
      this.ids = []
      val.forEach(item => {
        this.ids.push(item.id)
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
      const params = { appName: this.form.appName, status: this.form.status, limit: this.limitSize, offset: this.offsetPage }
      Taskmgmt.taskListApi(params).then(res => {
        let data = res.data.results
        this.listTotal = res.data.total
        data.forEach((item, index) => {
          let newDateBegin = this.dateChange(item.createTime)
          item.createTime = newDateBegin
          let newDateEnd = this.dateChange(item.endTime)
          item.endTime = newDateEnd
        })
        this.pageData = data
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
        ids: this.ids
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
  .task-main {
    .enter-search{
      justify-content: space-between;
      .right-space{
        margin-right: 20px;
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
        vertical-align: center;
      }
      span{
        color: #fff;
        font-size: 16px;
      }
      .el-link{
        color: #fff;
        font-size: 16px;
        span{
          border-bottom: 1px solid #fff;
        }
      }
      .el-button--text.is-disabled,.el-link.is-disabled{
        span{
          color: #999999;
          border-bottom: none;
        }
      }
      .el-button.operaBtn{
        padding: 3px 15px;
      }
    }
  }
</style>
