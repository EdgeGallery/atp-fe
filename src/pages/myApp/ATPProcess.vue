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
      class="process"
      id="process"
    >
      <div
        class="back"
      >
        <el-button
          :disabled="report"
          id="back_button"
          class="dark-button"
          icon="el-icon-document"
          @click="jumpToReport()"
        >
          {{ $t('myApp.checkReport') }}
        </el-button>
      </div>
      <!-- 顶部 -->
      <div class="header">
        <div class="padding20">
          <div class="title">
            <span
              class="titleTextWidth"
              v-if=" isTest === 'running'"
            >
              {{ language==='cn'? '正在测试...':'Testing' }}
            </span>
            <span
              class="titleTextWidth"
              v-else
            >
              {{ language==='cn'? '测试结果':'Test Result' }}
            </span>
          </div>
          <div class="backColor" />
          <div class="score">
            <div
              class="score-center"
              :class="scoreColor"
            >
              <span class="score-num">{{ score }}</span>
              <span class="score-text">{{ $t('userpage.score') }}</span>
            </div>
            <img
              v-if=" isTest === 'running'"
              src="../../assets/images/testwaiting.png"
              alt=""
            >
            <img
              v-else-if="statusTitle[0]==='测试成功'"
              src="../../assets/images/testSuccessful.png"
              alt=""
            >
            <img
              v-else-if="statusTitle[0]==='测试失败'"
              src="../../assets/images/testFailed.png"
              alt=""
            >
          </div>
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage"
            class="percenprocess"
            :class="casefailclass"
          />
          <span
            class="testing-case"
            v-if=" isTest === 'running'"
          >{{ language==='cn'?testingScene[0]:testingScene[1] }}:{{ language==='cn'?testingCase[0]:testingCase[1] }}</span>
          <span
            v-else
            class="test-result"
          >
            {{ language==='cn'?statusTitle[0]:statusTitle[1] }}
          </span>
          <span
            v-if="allfailNum!==0"
            class="findproblem"
          >{{ $t('userpage.find') }}
            <em>
              {{ allfailNum }}
            </em>{{ $t('userpage.issue') }}</span>
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
          style="box-shadow: 0 0 10px 2px #e8e6f1;"
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
          </el-carousel-item>
        </el-carousel>
        <div
          style="text-align: center; margin: 25px;"
          v-if="reportData.length !== 1"
        >
          <el-button
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
      alltestCase: [],
      scoreColor: ''
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
    setBackColorWidth () {
      const titleWidth = document.getElementsByClassName('titleTextWidth')
      const backColorWidth = document.getElementsByClassName('backColor')
      for (let index = 0; index < titleWidth.length; index++) {
        backColorWidth[index].style.width = titleWidth[index].offsetWidth + 'px'
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
          return (item.result === 'running' && item.type === 'manual')
        })
        let automaticBoolan = this.alltestCase.some(function (item) {
          return ((item.result === 'running' || item.result === 'waiting') && item.type === 'automatic')
        })
        if (everyBoolan && !automaticBoolan && this.percentage !== 100) {
          this.promptWait()
          this.promptWait = function () {}
        }
        this.setDivHeight()
        this.$nextTick(() => {
          this.setBackColorWidth()
        })
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
        this.scoreColor = 'successScoreColor'
        this.statusTitle = ['测试成功', 'Test Successful']
        this.$refs.carousel.setActiveItem(data[0].nameEn)
      } else if (taskStatus === 'failed') {
        this.scoreColor = 'failScoreColor'
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
// .testing-main{
//   // padding: 0 20%;
//   padding: 0 20px;
// }
.process{
  background-color: #fff;
  .back{
    padding: 10px 0  20px;
    text-align: right;
  }
  .icon-loading{
     animation: rotate 2s infinite linear ;
  }
    // .running{
    //   .testing-score{
    //     border: 2px dashed #688ef3;
    //     animation: rotate 8s infinite linear ;
    //   }
    //   .scoreem{
    //     animation: rotateinside 8s infinite linear ;
    //   }
    // }
    // .finished{
    //   .testing-score{
    //     border: 2px solid #688ef3;
    //   }
    // }
  .header{
    box-shadow: 0 0 10px 2px #e8e6f1;
    margin-bottom: 30px;
    .title{
      position: relative;
      z-index: 100;
      span{
        color: #333333;
        font-size: 28px;
        font-weight: bolder;
      }
    }
    .backColor{
      height: 15px;
      border-radius: 10px;
      background-color: #d3b6ff;
      position: relative;
      top: -10px;
      left: 8px;
    }
    .score{
      display: flex;
      justify-content: space-between;
      padding: 0 15px 10px;
      .score-center{
        padding-top: 10px;
        color: #333333;
      }
      .failScoreColor{
        color: #ed395f;
      }
      .successScoreColor{
        color: #8097f7;
      }
      .score-num{
        font-size: 40px;
        font-weight: 900;
      }
      .score-text{
        font-size: 30px;
        font-weight: 900;
      }
    }
    .percenprocess{
        margin-bottom: 10px;
        .el-progress-bar{
          border: 2px solid #e6eafd;
          border-radius: 15px;
        }
        .el-progress-bar__inner{
          background-color: #8097f7;
        }
        .el-progress-bar__outer{
          background-color: #e6eafd;
        }
      }
      .casefail{
        .el-progress-bar{
          border: 2px solid #ffeaee;
          border-radius: 15px;
        }
        .el-progress-bar__inner{
          background-color: #ec748d;
        }
        .el-progress-bar__outer{
          background-color: #ffeaee;
        }
      }
      .testing-case{
        color: #666;
        font-size: 14px;
        padding: 0 15px 0 5px;
      }
      .test-result{
        font-size: 28px;
        color: #333333;
        font-weight: 600;
      }
      .findproblem{
        font-size: 18px;
        color: #111;
        em{
          color: #ff2222;
          font-size: 20px;
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
    // padding: 20px 60px;
    // .el-tabs--border-card {
    //   border: none;
    // }
    .content-title{
      display: flex;
      .scene{
        padding-left: 10px;
        line-height: 60px;
        font-size: 18px;
        font-weight: 600;
        color: #688ef3;
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
      padding: 10px 20px;
      border: none!important;
      font-size: large;
      overflow-y: scroll;
      .el-collapse-item{
        padding: 3px 0;
      }
      .el-collapse-item__header{
        padding-left: 8px;
        font-size: 18px;
        color: #111;
        height: 30px;
        border-radius: 5px;
        background-image: linear-gradient(to right, rgba(124,156,250,.5) , rgba(249,195,255,.2));
      }
      .hasfailed{
        .el-collapse-item__header{
          background-image: linear-gradient(to right, rgba(251,123,119,.5) , rgba(249,195,255,.2));
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
    .el-table{
      .cell{
        display: table-cell;
        img{
          vertical-align: middle;
          margin-right: 10px;
        }
      }
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
