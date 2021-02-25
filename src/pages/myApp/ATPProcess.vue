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
            <em class="scoreem">{{ score }}</em>
          </div>
        </div>
        <div class="status-title">
          <p>{{ language==='cn'?statusTitle[0]:statusTitle[1] }}</p>
          <span>{{ language==='cn'?testingScene[0]:testingScene[1] }}:{{ language==='cn'?testingCase[0]:testingCase[1] }}</span>
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="percentage"
            color="#688ef3"
          />
        </div>
      </div>
      <div class="content">
        <div
          v-for="(item,index) in testScenarios"
          :key="index"
        >
          <div class="content-title">
            <div class="sceneRunning">
              <div class="testing-case-process">
                <span>{{ item.successNum }}</span>
                <span class="sum">/</span>
                <span class="sum">{{ item.totalNum }}</span>
              </div>
            </div>
            <span class="scene">{{ language==='cn'?item.nameCh:item.nameEn }}</span>
            <em class="allsuccess rt" />
          </div>
          <el-collapse
            v-model="activeName"
          >
            <el-collapse-item
              v-for="(suiteItem,dex) in item.testSuites"
              :key="dex"
              :title="language==='cn'?suiteItem.nameCh:suiteItem.nameEn"
              :name="item.nameEn+suiteItem.nameEn"
            >
              <el-table
                :data="suiteItem.testCases"
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
        </div>
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
      interval: ''
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
        this.testScenarios = data
        this.activeName = []
        this.finishActiveName = []
        let allsuccessNum = 0
        let allfailNum = 0
        let allNum = 0
        data.forEach(element => {
          this.finishActiveName.push(element.nameEn + element.testSuites[0].nameEn)
          element.totalNum = 0
          element.successNum = 0
          element.failNum = 0
          element.testSuites.forEach(ele => {
            ele.testCases.forEach(item => {
              element.totalNum++
              allNum++
              if (item.result === 'success') {
                allsuccessNum++
                element.successNum++
              } else if (item.result === 'failed') {
                allfailNum++
                element.failNum++
              } else if (item.result === 'running') {
                this.activeName.push(element.nameEn + ele.nameEn)
                if (item.type === 'automatic') {
                  this.testingCase = [item.nameCh, item.nameEn]
                  this.testingScene = [element.nameCh, element.nameEn]
                }
              }
            })
          })
        })
        console.log(this.activeName)
        // 分数和进度百分比
        this.score = Number((allsuccessNum / allNum * 100).toFixed(0))
        this.percentage = Number(((allsuccessNum + allfailNum) / allNum * 100).toFixed(0))
        if (this.percentage === 100) {
          this.statusTitle = ['测试完成', 'Finished test']
          this.report = false
          this.isTest = 'finished'
          this.activeName = this.finishActiveName
          this.clearInterval()
        } else {
          this.statusTitle = ['正在测试...', 'Testing...']
          this.isTest = 'running'
        }
        console.log(this.testScenarios)
      }).catch(() => {})
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
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #c8d1eb;
      // border: 2px solid #688ef3;
    }
    .score{
      width: 80px;
      height: 80px;
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
      }
      span{
        font-size: 14px;
        color: #909399;
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
    .content-title{
      display: flex;
      .scene{
        padding-left: 10px;
        line-height: 60px;
        font-size: 18px;
        font-weight: 600;
        color: #688ef3;
      }
      // .allsuccess{
      //   width: 50px;
      //   height: 50px;
      //   border-radius: 50%;
      //   background-position: center;
      //   background-repeat: no-repeat;
      //   background: url('../../assets/images/chenggong.png');
      // }
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
      .success{
        color: #67c23a;
      }
      .error{
        color: #f56c6c;
      }
      .primary{
        color: #2c3fe9 ;
      }
      .el-collapse-item__header{
        font-size: 15px;
        height: 30px;
        background-image: linear-gradient(to right, #cad5f3 , #fff);
      }
      .el-icon-arrow-right:before {
        color: #000;
      }
    }
    .el-table::before {
       width: 0;
    }
    table th,table td{
      border-bottom: none !important;
    }
  }
}
</style>
