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
  <div>
    <div
      class="process padding56"
      id="process"
    >
      <div
        class="back"
      >
        <el-button
          :disabled="report"
          id="back_button"
          type="primary"
          icon="el-icon-document"
          plain
          @click="jumpToReport()"
        >
          {{ $t('myApp.checkReport') }}
        </el-button>
      </div>
      <div
        class="header"
        :class="isTest"
      >
        <div class="testing-score">
          <div class="score">
            <em class="scoreem">{{ score }}{{ $t('userpage.score') }}</em>
          </div>
        </div>
        <div class="status-title">
          <p>{{ language==='cn'?statusTitle[0]:statusTitle[1] }}</p>
          <span v-if=" isTest === 'running'">{{ language==='cn'?testingScene[0]:testingScene[1] }}:{{ language==='cn'?testingCase[0]:testingCase[1] }}</span>
          <span
            v-if="allfailNum!==0"
            class="findproblem"
          >{{ $t('userpage.find') }}{{ allfailNum }}{{ $t('userpage.issue') }}</span>
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage"
            class="percenprocess"
            :class="casefailclass"
          />
        </div>
      </div>
      <div
        class="content"
        id="content"
      >
        <el-carousel
          indicator-position="outside"
          trigger="click"
          :autoplay="false"
          :height="carouselHeight"
          :loop="false"
          arrow="always"
          ref="carousel"
          style="box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);"
        >
          <el-carousel-item
            v-for="(item,index) in testScenarios"
            :key="index"
            :label="language==='cn'?item.nameCh:item.nameEn"
            :name="item.nameEn"
            @click="setActiveItem()"
          >
            <div class="content-title">
              <div class="sceneRunning">
                <el-tooltip
                  effect="light"
                  :content="$t('userpage.hover')"
                  placement="right"
                >
                  <div class="testing-case-process">
                    <span>{{ item.successNum }}</span>
                    <span class="sum">/</span>
                    <span class="sum">{{ item.totalNum }}</span>
                  </div>
                </el-tooltip>
              </div>
              <span class="scene">{{ language==='cn'?item.nameCh:item.nameEn }}</span>
              <img
                src="../../assets/images/chenggong.png"
                alt=""
                class="ishasFailIcon"
                v-if="(item.failNum+item.successNum===item.totalNum) && item.successNum===item.totalNum"
                style="height:50px;margin-top:5px;"
              >
              <img
                v-if="(item.failNum+item.successNum===item.totalNum) && item.successNum!==item.totalNum"
                src="../../assets/images/shibai.png"
                alt=""
                class="ishasFailIcon"
                style="height:50px;margin-top:5px;"
              >
            </div>
            <el-collapse
              v-model="activeName"
              class="collapseHeight"
              @change="handleChange"
            >
              <el-collapse-item
                v-for="(suiteItem,dex) in item.testSuites"
                :key="dex"
                :title="language==='cn'?suiteItem.nameCh:suiteItem.nameEn"
                :name="item.nameEn+suiteItem.nameEn"
                :class="hasFailActiveName.indexOf(item.nameEn+suiteItem.nameEn)!==-1?'hasfailed':''"
              >
                <el-table
                  :data="suiteItem.testCases"
                  header-cell-class-name="tableheaderStyle"
                >
                  <el-table-column
                    :label="$t('userpage.name')"
                  >
                    <template scope="scope">
                      <span
                        v-if="scope.row.result=='success'"
                        class="el-icon-success success"
                        title="success"
                      />
                      <span
                        v-else-if="scope.row.result=='failed'"
                        class="el-icon-error error"
                        title="failed"
                      />
                      <span
                        v-else-if="scope.row.result=='running'"
                        class="el-icon-loading primary"
                        title="running"
                      />
                      <span
                        v-else
                        class="el-icon-refresh-left primary"
                      />
                      {{ language==='cn'?scope.row.nameCh:scope.row.nameEn }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('userpage.type')"
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
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-carousel-item>
        </el-carousel>
        <div
          style="text-align: center; margin: 25px;"
          v-if="reportData.length !== 1"
        >
          <el-button
            type="primary"
            size="mini"
            plain
            v-for="(item,index) in reportData"
            :key="index"
            :id="item.nameEn"
            v-focus
            @click="setActiveItem(item)"
          >
            {{ language==='cn'?item.nameCh:item.nameEn }}
          </el-button>
        </div>
        <el-dialog
          :title="$t('process.modifyStatus')"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <el-form
            :model="form"
            label-width="100px"
          >
            <el-form-item
              :label="$t('userpage.name')"
            >
              <el-input
                width="100px"
                size="small"
                v-model="form.name"
              />
            </el-form-item>
            <el-form-item
              :label="$t('userpage.status')"
            >
              <el-select
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
              size="small"
              @click="dialogVisible = false"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="confirmModify()"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfo, Userpage } from '../../tools/api.js'
export default {
  data () {
    return {
      currUrl: window.location.href,
      language: '',
      report: true,
      isTest: '',
      score: 0,
      statusTitle: [],
      percentage: 0,
      taskId: '',
      testingScene: [],
      testingCase: [],
      testScenarios: [],
      activeName: [],
      finishActiveName: [],
      interval: '',
      casefailclass: '',
      allfailNum: 0,
      hasFailActiveName: [],
      // activeTabsName: '',
      firstScene: '',
      reportData: [],
      form: {
        name: '',
        result: '',
        reason: ''
      },
      dialogVisible: false,
      userName: '',
      authorities: [],
      carouselHeight: '',
      alltestCase: []
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
  directives: {
    focus: {
    // 指令的定义
      inserted: function (el, binding, vnode) {
        document.getElementById(vnode.context.testScenarios[0].nameEn).focus()
      }
    }
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
        this.reportData = []
        data.forEach(element => {
        // 场景翻页遍历
          let reportobj = {
            label: '',
            nameCh: '',
            nameEn: '',
            id: ''
          }
          reportobj.nameCh = element.nameCh
          reportobj.nameEn = element.nameEn
          reportobj.label = element.label
          reportobj.id = element.id
          this.reportData.push(reportobj)
          // 场景前的数字
          element.totalNum = 0
          element.successNum = 0
          element.failNum = 0
          element.testSuites.forEach(ele => {
          // 完成后打开的页签
            this.finishActiveName.push(element.nameEn + ele.nameEn)
            // 测试过程
            ele.testCases.forEach(item => {
              this.alltestCase.push(item)
              element.totalNum++
              allNum++
              if (item.result === 'success') {
                allsuccessNum++
                element.successNum++
              } else if (item.result === 'failed') {
                allfailNum++
                element.failNum++
                this.casefailclass = 'casefail'
                this.hasFailActiveName.push(element.nameEn + ele.nameEn)
              } else if (item.result === 'running') {
                if (item.type === 'automatic') {
                  this.testingCase = [item.nameCh, item.nameEn]
                  this.testingScene = [element.nameCh, element.nameEn]
                  // 判断显示哪一页
                  this.$refs.carousel.setActiveItem(element.nameEn)
                }
              }
            })
            // 一个测试套测试完成后收起
            this.setactiveName(ele, element)
          })
        })
        // 分数和进度百分比
        this.score = Number((allsuccessNum / allNum * 100).toFixed(0))
        this.percentage = Number(((allsuccessNum + allfailNum) / allNum * 100).toFixed(0))
        this.allfailNum = allfailNum
        // 页面标题显示和class
        this.IsFinish()
        this.setTitle(taskStatus, data)
        // 判断是否只剩下手动类型
        let everyBoolan = this.alltestCase.some(function (item) {
          return (item.result === 'running' && item.type === 'automatic')
        })
        if (!everyBoolan && this.percentage !== 100) {
          this.promptWait()
          this.promptWait = function () {}
        }
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
    IsFinish () {
      if (this.percentage === 100) {
        this.report = false
        this.isTest = 'finished'
        this.activeName = this.finishActiveName
        this.clearInterval()
      } else {
        this.statusTitle = ['正在测试...', 'Testing...']
        this.isTest = 'running'
      }
    },
    setTitle (taskStatus, data) {
      if (taskStatus === 'success') {
        this.statusTitle = ['测试成功', 'Test Successful']
        this.$refs.carousel.setActiveItem(data[0].nameEn)
      } else if (taskStatus === 'failed') {
        this.statusTitle = ['测试失败', 'Test Failed']
        this.$refs.carousel.setActiveItem(data[0].nameEn)
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
      this.activeName = this.finishActiveName
      this.$message({
        offset: 200,
        duration: 5000,
        showClose: true,
        type: 'success',
        message: this.$t('promptMessage.manualTip')
      })
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
        const collapseDiv = document.getElementsByClassName('collapseHeight')
        const appDiv = document.getElementById('app')
        processcDiv.style.minHeight = appDiv.clientHeight + 'px'
        this.carouselHeight = appDiv.clientHeight - 250 + 'px'
        for (let value of collapseDiv) {
          value.style.maxHeight = appDiv.clientHeight - 310 + 'px'
        }
      })
    },
    setActiveItem (item) {
      this.$refs.carousel.setActiveItem(item.nameEn)
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
    }
  },
  beforeDestroy () {
    this.clearInterval()
  }
}
</script>
<style lang="less">
.process{
  background-color: white;
  .back{
    padding: 10px 50px 0;
    text-align: right;
  }
    .running{
      .testing-score{
        border: 2px dashed #688ef3;
        animation: rotate 8s infinite linear ;
      }
      .scoreem{
        animation: rotateinside 8s infinite linear ;
      }
    }
    .finished{
      .testing-score{
        border: 2px solid #688ef3;
      }
    }
  .header{
    display: flex;
    .testing-score{
      margin: 0 20px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    .score{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      text-align: center;
      display: table-cell;
      vertical-align:middle;
      em{
        display: inline-block;
        font-size: 28px;
        color: #688ef3;
        font-weight: 600;
      }
    }
    .status-title{
      width: 50%;
      p{
        font-size: 22px;
        color: #000;
        margin-bottom: 8px;
        font-weight: bold;
      }
      span{
        display: inline-block;
        font-size: 14px;
        color: #909399;
      }
      .findproblem{
        padding-left: 5px;
        font-size: 20px;
        color: #000;
      }
      .percenprocess{
        margin-top: 8px;
        .el-progress-bar{
          border: 2px solid #8c98b9;
          border-radius: 15px;
        }
        .el-progress-bar__inner{
          background-color: #688ef3;
        }
      }
      .casefail{
        .el-progress-bar__inner{
          background-color: #f67878;
        }
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
    padding: 20px 60px;
    .el-tabs--border-card {
      border: none;
    }
    .content-title{
      display: flex;
      .scene{
        padding-left: 10px;
        line-height: 60px;
        font-size: 18px;
        font-weight: 600;
        color: #688ef3;
      }
      .ishasFailIcon{
        position: relative;
        right: -10px;
      }
      .testing-case-process{
          width:60px;
          height:60px;
          text-align: center;
          display: table-cell;
          vertical-align:middle;
          border-radius: 50%;
          span{
            font-size: 40px;
            color: #1ececa;
            font-weight: 700;
          }
          .sum{
            font-size: 25px;
            color: #9163cc;
          }
      }
    }
    .el-collapse{
      padding: 10px 50px;
      border: none!important;
      font-size: large;
      overflow-y: scroll;
      .success,.error,.primary{
        padding-right: 5px;
        font-size: large;
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
      .el-collapse-item{
        padding: 3px 0;
      }
      .el-collapse-item__header{
        padding-left: 8px;
        font-size: 15px;
        height: 30px;
        border-radius: 5px;
        background-image: linear-gradient(to right, #cad5f3 , #fff);
      }
      .hasfailed{
        .el-collapse-item__header{
          background-image: linear-gradient(to right, #f67878 , #fff);
        }
      }
      .el-icon-arrow-right:before {
        color: #000;
      }
    }
    .el-carousel__indicators--labels{
      margin-bottom: 10px;
      display: none;
    }
    .tableheaderStyle{
      padding: 0;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
    .el-table::before {
       width: 0;
    }
    .el-table td{
      padding: 0;
      height: 45px;
      line-height: 45px;
    }
    table th,table td{
      border-bottom: none !important;
    }
  }
}
  .el-tooltip__popper.is-light{
    border: 1px solid #688ef3!important;
  }
</style>
