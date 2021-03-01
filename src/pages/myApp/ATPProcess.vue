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
  <div class="padding56">
    <!-- <Navcomp /> -->
    <div class="process">
      <div
        class="back"
      >
        <el-button
          :disabled="report"
          id="back_button"
          type="primary"
          icon="el-icon-document"
          plain
          @click="jumpTo()"
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
          >发现{{ allfailNum }}项问题</span>
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage"
            class="percenprocess"
            :class="casefailclass"
          />
        </div>
      </div>
      <div class="content">
        <el-tabs
          v-model="activeTabsName"
          type="border-card"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="(item,index) in testScenarios"
            :key="index"
            :label="language==='cn'?item.nameCh:item.nameEn"
            :name="item.nameEn"
          >
            <div class="content-title">
              <div class="sceneRunning">
                <el-tooltip
                  effect="light"
                  content="成功用例/总用例"
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
                  header-cell-class-name="headerStyle"
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { Userpage } from '../../tools/api.js'
// import Navcomp from '../../components/layout/Nav'
export default {
  // components: { Navcomp },
  data () {
    return {
      currUrl: window.location.href,
      language: localStorage.getItem('language'),
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
      activeTabsName: ''
    }
  },
  mounted () {
    this.getTaskId()
    this.getTaskProcess()
    this.interval = setInterval(() => {
      this.getTaskProcess()
    }, 1000)
  },
  watch: {
    '$i18n.locale': function () {
      let language = localStorage.getItem('language')
      this.language = language
    }
  },
  methods: {
    getTaskId () {
      if (this.currUrl.indexOf('?') !== -1) {
        this.taskId = this.currUrl.split('?')[1].split('=')[1]
      } else {
        let params = sessionStorage.getItem('taskId')
        this.taskId = params
      }
    },
    jumpTo () {
      let taskId = this.taskId
      let routeData = this.$router.resolve({ name: 'atpreport', query: { taskId: taskId } })
      window.open(routeData.href, '_blank')
    },
    getTaskProcess () {
      Userpage.getTaskApi(this.taskId).then(res => {
        let data = res.data.testScenarios
        let taskStatus = res.data.status
        this.testScenarios = data
        this.activeName = []
        this.hasFailActiveName = []
        this.finishActiveName = []
        this.activeTabsName = ''
        let allsuccessNum = 0
        let allfailNum = 0
        let allNum = 0
        data.forEach(element => {
          element.totalNum = 0
          element.successNum = 0
          element.failNum = 0
          element.testSuites.forEach(ele => {
            this.finishActiveName.push(element.nameEn + ele.nameEn)
            ele.testCases.forEach(item => {
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
                this.activeName.push(element.nameEn + ele.nameEn)
                if (item.type === 'automatic') {
                  this.testingCase = [item.nameCh, item.nameEn]
                  this.testingScene = [element.nameCh, element.nameEn]
                  // 判断显示哪一个tab
                  this.activeTabsName = element.nameEn
                }
              }
            })
          })
        })
        // 分数和进度百分比
        this.score = Number((allsuccessNum / allNum * 100).toFixed(0))
        this.percentage = Number(((allsuccessNum + allfailNum) / allNum * 100).toFixed(0))
        this.allfailNum = allfailNum
        if (this.percentage === 100) {
          this.report = false
          this.isTest = 'finished'
          this.activeName = this.finishActiveName
          this.clearInterval()
        } else {
          this.statusTitle = ['正在测试...', 'Testing...']
          this.isTest = 'running'
        }
        if (taskStatus === 'success') {
          this.statusTitle = ['测试成功', 'Test Successful']
          this.activeTabsName = data[0].nameEn
        } else if (taskStatus === 'failed') {
          this.statusTitle = ['测试失败', 'Test Failed']
          this.activeTabsName = data[0].nameEn
        }
      }).catch(() => {})
    },
    handleClick (tab) {
      this.activeTabsName = tab.name
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
      // background-color: #c8d1eb;
      // border: 2px solid #688ef3;
    }
    .score{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      text-align: center;
      display: table-cell;
      vertical-align:middle;
      // border: 2px solid #688ef3;
      em{
        display: inline-block;
        font-size: 30px;
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
      // .sceneRunning{
      //   border-radius: 50%;
      //    border:2px dashed #688ef3;
      //   animation: rotate 5s infinite linear ;
      // }
      .testing-case-process{
          width:60px;
          height:60px;
          text-align: center;
          display: table-cell;
          vertical-align:middle;
          border-radius: 50%;
          // animation: rotateinside 5s infinite linear ;
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
    .headerStyle{
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
