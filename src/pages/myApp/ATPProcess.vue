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
  <div class="testing-main">
    <div
      class="process common-div"
      id="process"
    >
      <div class="toptitle">
        <div class="left flex">
          <div class="left-text">
            <img
              src="../../assets/images/selectsceneIcon.png"
              alt=""
              style="margin-right:20px;"
            >
            {{ $t('atp.result') }}
          </div>
        </div>
        <div
          class="right"
        >
          <el-button
            :disabled="report || userName==='guest'"
            class="common-btn"
            icon="el-icon-upload"
            size="small"
            @click="uploadPdfVisible=true"
          >
            {{ $t('userpage.uploadReport') }}
          </el-button>
          <el-button
            size="small"
            :disabled="report"
            id="common-btn"
            class="dark-button"
            icon="el-icon-document"
            @click="jumpToReport()"
          >
            {{ $t('myApp.checkReport') }}
          </el-button>
        </div>
      </div>
      <!-- 顶部 -->
      <div class="header">
        <el-progress
          :stroke-width="10"
          :percentage="percentage"
          :color="customColor"
          class="percenprocess"
        />
        <span
          class="testing-case point"
          v-if=" isTest === 'running'"
        >
          {{ language==='cn'?testingScene[0]:testingScene[1] }}
          <span
            v-show="!manualTitle"
            style="margin-left:8px;"
          >: {{ language==='cn'?testingCase[0]:testingCase[1] }}</span>
        </span>
        <span
          v-if=" isTest === 'running'"
          v-show="manualTitle"
          class="waitManual"
        >{{ $t('userpage.waitManual') }}</span>
        <span
          v-else
          class="test-result"
          :class="{'testFailed': statusTitle[0]==='测试失败','testSuccessful': statusTitle[0]==='测试成功',}"
        >
          {{ language==='cn'?statusTitle[0]:statusTitle[1] }}
        </span>
        <span
          v-if="allfailNum!==0"
          class="findproblem point"
        >{{ $t('userpage.find') }}
          <em>
            {{ allfailNum }}
          </em>{{ $t('userpage.issue') }}</span>
      </div>
      <div
        class="content"
        id="content"
      >
        <el-tabs
          v-model="activeNameTabs"
          type="card"
        >
          <el-tab-pane
            v-for="(item,index) in testScenarios"
            :key="index"
            :label="language==='cn'?item.nameCh:item.nameEn"
            :name="item.nameEn"
            class="tab-pan-height"
          >
            <el-collapse
              v-model="activeName"
              @change="handleChange"
            >
              <el-collapse-item
                v-for="(suiteItem,dex) in item.testSuites"
                :key="dex"
                :title="language==='cn'?suiteItem.nameCh:suiteItem.nameEn"
                :name="item.nameEn+suiteItem.nameEn"
              >
                <el-table
                  :data="suiteItem.testCases"
                  header-cell-class-name="caseHearder"
                >
                  <el-table-column
                    :label="$t('userpage.name')"
                    width="270"
                  >
                    <template scope="scope">
                      <img
                        v-if="scope.row.result=='success'"
                        src="../../assets/images/successicon.png"
                        alt=""
                      >
                      <img
                        v-else-if="scope.row.result=='failed'"
                        src="../../assets/images/failicon.png"
                        alt=""
                      >
                      <img
                        v-else-if="scope.row.result=='running'"
                        src="../../assets/images/testingicon.png"
                        alt=""
                        class="icon-loading"
                      >
                      <img
                        v-else
                        src="../../assets/images/waiticon.png"
                        alt=""
                      >
                      {{ language==='cn'?scope.row.nameCh:scope.row.nameEn }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('userpage.type')"
                    width="120"
                  >
                    <template scope="scope">
                      {{ language==='en'?scope.row.type:scope.row.type==='automatic'?'自动化类型':'手动类型' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('userpage.description')"
                  >
                    <template scope="scope">
                      {{ language==='cn'?scope.row.descriptionCh:scope.row.descriptionEn }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="(authorities.indexOf('ROLE_ATP_ADMIN')!==-1 && isinternal)"
                    :label="$t('myApp.operation')"
                    width="100"
                  >
                    <template scope="scope">
                      <el-button
                        :disabled="scope.row.type==='automatic' || scope.row.result!=='running'"
                        type="text"
                        style="font-size:xx-large;"
                        class="el-icon-edit"
                        @click="modify(scope.row,item.id,suiteItem.id)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
        <el-dialog
          :title="$t('process.modifyStatus')"
          :visible.sync="dialogVisible"
          width="30%"
          class="commondlg"
        >
          <el-form
            :model="form"
            label-width="100px"
          >
            <el-form-item
              :label="$t('userpage.name')"
            >
              <el-input
                class="dlg-input"
                width="100px"
                size="small"
                v-model="form.name"
              />
            </el-form-item>
            <el-form-item
              :label="$t('userpage.status')"
            >
              <el-select
                class="dlg-select"
                v-model="form.result"
                :placeholder="$t('userpage.choose')"
              >
                <el-option
                  label="success"
                  value="success"
                />
                <el-option
                  label="failed"
                  value="failed"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('userpage.failReason')"
            >
              <el-input
                class="dlg-input"
                type="textarea"
                autosize
                v-model="form.reason"
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              class="common-btn"
              size="small"
              @click="dialogVisible = false"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              class="common-btn"
              size="small"
              @click="confirmModify()"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="uploadPdfVisible"
          width="30%"
          class="uploadPdfDialog commondlg"
        >
          <div class="uploadReport">
            <img
              src="../../assets/images/uploadReport.png"
              alt=""
            >
            <div class="uploadpdf">
              {{ $t('userpage.selftestUpload') }}
            </div>
            <p>{{ $t('userpage.haveReport') }}</p>
            <span>{{ $t('userpage.pdfFormat') }}</span>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              style="margin-right:40px;"
              @click="uploadPdfVisible=false"
              class="common-btn"
            >
              {{ $t('userpage.later') }}
            </el-button>
            <el-upload
              :show-file-list="false"
              action=""
              :limit="1"
              :auto-upload="false"
              :file-list="pdfFile"
              accept=".pdf"
              :on-change="handleChangePdf"
            >
              <el-button
                class="common-btn"
              >
                {{ $t('userpage.uploadNow') }}
              </el-button>
            </el-upload>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfo, Userpage } from '../../tools/api.js'
export default {
  props: {
    isinternal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currUrl: window.location.href,
      language: '',
      report: true,
      isTest: '',
      statusTitle: [],
      percentage: 0,
      taskId: '',
      testingScene: [],
      testingCase: [],
      testScenarios: [],
      activeName: [],
      finishActiveName: [],
      activeNameTabs: '',
      interval: '',
      allfailNum: 0,
      hasFailActiveName: [],
      firstScene: '',
      form: {
        name: '',
        result: '',
        reason: ''
      },
      dialogVisible: false,
      userName: '',
      authorities: [],
      alltestCase: [],
      scoreColor: '',
      uploadPdfVisible: false,
      pdfFile: [],
      customColor: '#5844be',
      manualTitle: false,
      uploadUser: ''
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
    this.getTaskId()
    this.getTaskProcess()
    this.interval = setInterval(() => {
      this.getTaskProcess()
    }, 1000)
  },
  methods: {
    getLanguage () {
      if (this.currUrl.indexOf('language') !== -1) {
        let language = this.currUrl.split('language')[1].split('=')[1]
        this.language = language
        localStorage.setItem('language', language)
        this.$i18n.locale = language
        this.$store.commit('changeLaguage', { language: language })
      } else {
        let language = localStorage.getItem('language')
        this.language = language
        this.$i18n.locale = language
        this.$store.commit('changeLaguage', { language: language })
      }
    },
    getTaskId () {
      if (this.currUrl.indexOf('language') !== -1) {
        this.taskId = this.currUrl.split('?')[1].split('=')[1].split('&')[0]
      } else {
        this.taskId = this.$route.query.taskId
      }
    },
    jumpToReport () {
      let taskId = this.taskId
      let routeData = this.$router.resolve({ name: 'atpreport', query: { taskId: taskId } })
      window.open(routeData.href, '_blank')
    },
    handleChange (val) {
      this.activeName = val
    },
    getTaskProcess () {
      Userpage.getTaskApi(this.taskId).then(res => {
        let data = res.data.testScenarios
        let taskStatus = res.data.status
        this.uploadUser = res.data.user.userName
        let reportPath = res.data.hasOwnProperty('reportPath')
        this.testScenarios = data
        this.setCollaspe()
        this.setCollaspe = function () {}
        this.hasFailActiveName = []
        this.finishActiveName = []
        this.firstScene = data[0].nameEn
        this.alltestCase = []
        let allsuccessNum = 0
        let allfailNum = 0
        let allNum = 0
        data.forEach(element => {
        // 场景前的数字
          element.testSuites.forEach(ele => {
          // 完成后打开的页签
            this.finishActiveName.push(element.nameEn + ele.nameEn)
            // 测试过程
            ele.testCases.forEach(item => {
              this.alltestCase.push(item)
              allNum++
              if (item.result === 'success') {
                allsuccessNum++
              } else if (item.result === 'failed') {
                allfailNum++
                this.hasFailActiveName.push(element.nameEn + ele.nameEn)
              } else if (item.result === 'running') {
                this.activeNameTabs = element.nameEn
                if (item.type === 'automatic') {
                  this.testingCase = [item.nameCh, item.nameEn]
                  this.testingScene = [element.nameCh, element.nameEn]
                }
              }
            })
          })
        })
        // 分数和进度百分比
        this.percentage = Number(((allsuccessNum + allfailNum) / allNum * 100).toFixed(0))
        this.allfailNum = allfailNum
        // 页面标题显示和class
        this.IsFinish(reportPath)
        this.setTitle(taskStatus, data)
        // 判断是否只剩下手动类型
        this.IsManualPrompt()
        this.setDivHeight()
      }).catch(() => {
        this.$message({
          duration: 2000,
          showClose: true,
          type: 'warning',
          message: this.$t('promptMessage.getprocessFail')
        })
        this.clearInterval()
      })
    },
    IsFinish (reportPath) {
      if (this.percentage === 100) {
        this.report = false
        this.isTest = 'finished'
        this.activeNameTabs = this.firstScene
        this.activeName = this.finishActiveName
        this.clearInterval()
        if (!reportPath && this.uploadUser === this.userName && this.userName !== 'guest') {
          this.uploadPdfVisible = true
        }
      } else {
        this.statusTitle = ['正在测试...', 'Testing...']
        this.isTest = 'running'
      }
    },
    setTitle (taskStatus, data) {
      if (taskStatus === 'success') {
        this.scoreColor = 'successScoreColor'
        this.statusTitle = ['测试成功', 'Test Successful']
      } else if (taskStatus === 'failed') {
        this.scoreColor = 'failScoreColor'
        this.statusTitle = ['测试失败', 'Test Failed']
      }
    },
    setactiveName (ele, element) {
      let testSuiteFinishBoolan = ele.testCases.every(caseFinish => {
        return (caseFinish.result === 'success' || caseFinish.result === 'failed')
      })
      if (testSuiteFinishBoolan && this.activeName.indexOf(element.nameEn + ele.nameEn) !== -1) {
        let index = this.activeName.indexOf(element.nameEn + ele.nameEn)
        this.activeName.splice(index, 1)
      }
    },
    // 提示手动类型
    promptWait () {
      this.manualTitle = true
      this.activeName = this.finishActiveName
      this.$message({
        offset: 200,
        duration: 5000,
        showClose: true,
        type: 'success',
        message: this.$t('promptMessage.manualTip')
      })
    },
    IsManualPrompt () {
      let everyBoolan = this.alltestCase.some(function (item) {
        return (item.result === 'running' && item.type === 'manual')
      })
      let automaticBoolan = this.alltestCase.some(function (item) {
        return ((item.result === 'running' || item.result === 'waiting') && item.type === 'automatic')
      })
      if (everyBoolan && !automaticBoolan && this.percentage !== 100) {
        this.promptWait()
        this.promptWait = function () { }
      }
    },
    // 设置所有面板打开
    setCollaspe () {
      this.testScenarios.forEach(element => {
        element.testSuites.forEach(ele => {
          this.activeName.push(element.nameEn + ele.nameEn)
        })
      })
    },
    // 设置用例高度
    setDivHeight () {
      this.$nextTick(() => {
        const processcDiv = document.getElementById('process')
        const appDiv = document.getElementById('app')
        const tabContent = document.getElementsByClassName('tab-pan-height')
        processcDiv.style.minHeight = appDiv.clientHeight - 180 + 'px'
        for (let value of tabContent) {
          value.style.minHeight = appDiv.clientHeight - 487 + 'px'
        }
      })
    },
    modify (row, testScenarioId, testSuiteId) {
      this.dialogVisible = true
      this.form.testCaseId = row.id
      this.form.testSuiteId = testSuiteId
      this.form.testScenarioId = testScenarioId
      if (this.language === 'cn') {
        this.form.name = row.nameCh
      } else {
        this.form.name = row.nameEn
      }
    },
    confirmModify () {
      this.dialogVisible = false
      let param = [{
        testScenarioId: this.form.testScenarioId,
        testSuiteId: this.form.testSuiteId,
        testCaseId: this.form.testCaseId,
        result: this.form.result,
        reason: this.form.reason
      }]
      Userpage.modifyStatusApi(this.taskId, param).then(res => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.modifySuccess'),
          type: 'success'
        })
        this.getTaskProcess()
      })
    },
    clearInterval () {
      clearTimeout(this.interval)
      this.interval = null
    },
    // pdf
    handleChangePdf (file, fileList) {
      this.pdfFile.push(file.raw)
      let fd = new FormData()
      fd.append('file', this.pdfFile[0])
      if (this.pdfFile.length > 0) {
        this.uploadPdfVisible = false
        Userpage.uploadReportApi(this.taskId, fd).then(res => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$t('promptMessage.uploadSuc'),
            type: 'success'
          })
        })
      }
    }
  },
  beforeDestroy () {
    this.clearInterval()
  }
}
</script>
<style lang="less">
.testing-main{
  .process{
      min-width: 660px;
      display: block;
    .toptitle{
      color: #fff;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      position: relative;
      .left{
        font-family: 'Harmony-Light', Arial, Helvetica, sans-serif;
        width: 55%;
        .left-text{
          position: relative;
          z-index: 2;
          padding: 10px 15px;
          border-radius: 12px;
          height: 47px;
          width: 100%;
          font-size: 24px;
        }
      }
        .right{
          font-size: 20px;
          cursor: pointer;
          padding-top: 8px;
        }
    }

    .icon-loading{
      animation: rotate 2s infinite linear ;
    }
    .header{
      padding: 20px 0 40px;
      .title{
        position: relative;
        z-index: 100;
        span{
          color: #fff;
          font-size: 28px;
          font-weight: bolder;
        }
      }
      .percenprocess{
          display: flex;
          align-items: center;
          .el-progress-bar{
            padding-right: 15%;
          }
          .el-progress__text{
            font-family: 'Harmony-SemiBold', Arial, Helvetica, sans-serif;
            font-size: 33px !important;
            color: #fff;
            margin-left: -30px;
          }
          .el-progress-bar__outer{
            background-color: #e6e2eb;
          }
      }
      .point::before{
        content: '';
        display:inline-block;
        width:6px;
        height:6px;
        border-radius: 50%;
        margin-right: 11px;
        background-color: #43F6AD;
        position: absolute;
        top: 7px;
        left: -15px;
      }
        .testing-case{
          position: relative;
          color: #fff;
          font-size: 14px;
          margin-left: 20px;
          font-family: 'Harmony-Light', Arial, Helvetica, sans-serif;
        }
        .test-result{
          position: relative;
          font-family: 'Harmony-SemiBold', Arial, Helvetica, sans-serif;
          font-size: 16px;
          color: #fff;
          margin-left: 30px;
        }
        .waitManual{
          font-family: 'Harmony-SemiBold', Arial, Helvetica, sans-serif;
          font-size: 16px;
          color: #fff;
        }
        .testFailed::before{
          content: '';
          display:inline-block;
          width:20px;
          height:20px;
          margin-right: 10px;
          background-image: url('../../assets/images/testFailed.png');
          position: absolute;
          top: 1px;
          left: -30px;
        }
        .testSuccessful::before{
          content: '';
          display:inline-block;
          width:20px;
          height:20px;
          margin-right: 10px;
          background-image: url('../../assets/images/testSuccessful.png');
          position: absolute;
          top: 1px;
          left: -30px;
        }
        .findproblem{
          font-family: 'Harmony-Light', Arial, Helvetica, sans-serif;
          position: relative;
          font-size: 14px;
          color: #fff;
          margin-left: 120px;
          em{
            padding: 0 5px;
            margin: 0 5px;
            background-color: #5844be;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            color: #fff;
            font-size: 14px;
          }
        }
    }
        @keyframes rotate {
          from {
              transform: rotate(0deg);
          }
          to {
              transform: rotate(360deg);
          }
      }
      @keyframes rotateinside {
          from {
              transform: rotate(360deg);
          }
          to {
              transform: rotate(0deg);
          }
      }
    .content{
      .el-tabs__header{
        background: transparent;
        margin: 0;
        border: none;
        font-family: 'Harmony-Light', Arial, Helvetica, sans-serif;
        .el-tabs__nav,.el-tabs__item{
          border: none;
        }
        .el-tabs__item{
          color: #fff;
          background: transparent;
          border-radius: 12px 12px 0 0;
          font-size: 20px;
        }
        .el-tabs__item.is-active{
          color: #fff;
          background: transparent;
        }
      }
      .el-tabs__content{
        padding: 35px;
        border-radius: 0 20px 20px 20px;
        background: transparent;
      }
      .el-collapse {
        border: none;
        padding: 0;
        .el-collapse-item {
          margin-bottom: 15px;
          .el-collapse-item__content{
            padding: 0;
          }
          .el-collapse-item__header{
            font-family: defaultFontLight, Arial, Helvetica, sans-serif;
            height: 40px;
            padding-left: 15px;
            font-size: 19px;
            color: #fff;
            background-color: #5F499D;
            border-radius: 19.5px;
            border: none;
          }
          .el-collapse-item__wrap{
            padding-left: 15px;
            background-color: transparent;
            border: none;
          }
        }
      }
          .caseHearder{
            background-color: transparent;
            color: #fff;
            padding: 0 10px;
            height: 35px;
            line-height: 35px;
            font-family: defaultFontLight, Arial, Helvetica, sans-serif;
            font-size: 16px;
          }
          .el-table tr {
            height: 37px;
            background-color: transparent;
            font-family: defaultFontLight, Arial, Helvetica, sans-serif;
            font-size: 16px;
          }
          .el-table td{
            padding: 0 10px;
            color: #fff;
            vertical-align: top;
            height: 37px;
            line-height: 37px;
            font-family: defaultFontLight, Arial, Helvetica, sans-serif;
            font-size: 16px;
          }
          .el-table__body{
            .cell{
              padding-top: 5px;
            }
          }
         .el-table::before {
          width: 0;
        }
        .el-table{
          background-color: transparent;
          .cell{
            display: table-cell;
            font-family: defaultFontLight, Arial, Helvetica, sans-serif;
            font-size: 16px;
            img{
              vertical-align: middle;
              margin-right: 10px;
              width: 20px;
              height: 20px;
            }
          }
        }
    }
  }
    .el-tooltip__popper.is-light{
      border: 1px solid #688ef3!important;
    }
    .uploadPdfDialog{
      .el-dialog__header {
        border: none;
      }
      .uploadReport{
        text-align: center;
        .uploadpdf{
          font-size: 24px;
          color: #333333;
        }
        p{
          font-size: 18px;
          color: #666666;
          padding: 5px 0;
        }
        span{
          font-size: 14px;
          color: #666666;
        }
      }
      .dialog-footer{
        display: flex;
        justify-content: center;
      }
    }
}
</style>
