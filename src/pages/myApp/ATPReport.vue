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
  <div
    class="report padding20"
    id="pdfDom"
  >
    <div class="report-content padding20">
      <div class="logo">
        <img
          src="../../assets/images/logo.png"
          alt=""
        >
        <div class="report-tap">
          <h3> {{ $t('report.testReport') }}</h3>
        </div>
        <div class="download">
          <el-button
            v-if="downloadBtn"
            size="large"
            type="primary"
            icon="el-icon-download"
            plain
            @click="downLoadReport()"
          >
            {{ $t('report.downloadReport') }}
          </el-button>
        </div>
      </div>
      <div class="title">
        {{ $t('atp.baseInfo') }}
      </div>
      <div class="report-app-info">
        <el-row :gutter="20">
          <el-col
            :span="23"
            class="app-table"
          >
            <el-table
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column
                fixed
                prop="appName"
                :label="$t('atp.applicationName')"
              />
              <el-table-column
                prop="appVersion"
                :label="$t('atp.version')"
              />
              <el-table-column
                prop="providerId"
                :label="$t('myApp.provider')"
              />
              <el-table-column
                prop="user.userName"
                :label="$t('report.uploadUser')"
              />
              <el-table-column
                prop="createTime"
                :label="$t('atp.startTime')"
              />
              <el-table-column
                prop="endTime"
                :label="$t('atp.endTime')"
              />
              <el-table-column
                :label="$t('atp.result')"
                width="180"
              >
                <template slot-scope="scope">
                  <span
                    :class="scope.row.status==='success'?'success':'failed'"
                  >{{ scope.row.status }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <img
          :src="resulticon"
          alt=""
          class="resulticon"
        >
      </div>
      <div class="report-chart">
        <div class="title">
          {{ $t('report.reportanalysis') }}
        </div>
        <div class="report_analysis">
          <div
            class="left"
            id="chartwidth"
          >
            <div
              class="sumchart"
              id="leftchart"
            />
          </div>
          <div
            class="right"
            id="chartwidth"
          >
            <div
              class="detailchart"
              id="rightchart"
            />
          </div>
        </div>
      </div>
      <div class="report-detail">
        <div class="title">
          {{ $t('report.reportDetail') }}
        </div>
        <div
          v-for="(item,index) in testScenarios"
          :key="index"
          class="detail-content"
        >
          <div>
            <span class="scene">{{ language==='cn'?item.nameCh:item.nameEn }}</span>
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
                header-cell-class-name="headerStyle"
              >
                <el-table-column
                  :label="$t('userpage.name')"
                >
                  <template scope="scope">
                    {{ language==='cn'?scope.row.nameCh:scope.row.nameEn }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="result"
                  :label="$t('userpage.result')"
                />
                <el-table-column
                  prop="reason"
                  :label="$t('report.failReason')"
                />
                <el-table-column
                  :label="$t('userpage.type')"
                >
                  <template scope="scope">
                    {{ language==='en'?scope.row.type:scope.row.type==='automatic'?'自动化类型':'手动类型' }}
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('userpage.description')"
                  width="500"
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

export default {
  name: 'Atpreport',
  data () {
    return {
      testScenarios: [],
      language: '',
      activeName: [],
      resulticon: '',
      htmlTitle: 'report',
      currUrl: window.location.href,
      taskId: '',
      scenarioId: '',
      tableData: [],
      ChartData: [],
      finishActiveName: [],
      downloadBtn: true,
      interval: ''
    }
  },
  mounted () {
    this.getLanguage()
    this.getTaskId()
    // this.getReport()
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
        this.taskId = this.currUrl.split('?')[1].split('=')[1]
      }
      this.getReport()
    },
    getReport () {
      Userpage.getTaskApi(this.taskId).then(res => {
        let data = res.data
        // 基本信息显示
        this.tableData.push(data)
        if (this.tableData[0].status === 'success') {
          this.resulticon = require('../../assets/images/success.png')
        } else {
          this.resulticon = require('../../assets/images/fail.png')
        }
        this.tableData.forEach(item => {
          let newDateBegin = this.dateChange(item.createTime)
          item.createTime = newDateBegin
          let newDateEnd = this.dateChange(item.endTime)
          item.endTime = newDateEnd
        })
        // 测试用例详情
        this.testScenarios = data.testScenarios
        this.activeName = []
        this.finishActiveName = []
        // 获取图表数据
        let chartobj = {
          dataRight: [],
          nameRightCh: [],
          nameRightEn: [],
          dataCh: [],
          dataEn: []
        }
        this.testScenarios.forEach(testScenarios => {
        // 折叠面板打开
          this.activeName.push(testScenarios.nameEn + testScenarios.testSuites[0].nameEn)
          this.activeName.push(testScenarios.nameEn)

          chartobj.nameRightCh.push(testScenarios.nameCh)
          chartobj.nameRightEn.push(testScenarios.nameEn)
          // 图标数据用例个数
          testScenarios.totalNum = 0
          testScenarios.successNum = 0
          testScenarios.failNum = 0
          testScenarios.testSuites.forEach(ele => {
            this.finishActiveName.push(testScenarios.nameEn + ele.nameEn)
            this.finishActiveName.push(testScenarios.nameEn)
            ele.testCases.forEach(item => {
              testScenarios.totalNum++
              if (item.result === 'success') {
                item.reason = '---'
                testScenarios.successNum++
              } else if (item.result === 'failed') {
                testScenarios.failNum++
              }
            })
          })
          let objDataCh = {
            name: '', value: 0
          }
          let objDataEn = {
            name: '', value: 0
          }
          objDataCh.name = testScenarios.nameCh
          objDataEn.name = testScenarios.nameEn
          objDataCh.value = testScenarios.totalNum
          objDataEn.value = testScenarios.totalNum
          chartobj.dataCh.push(objDataCh)
          chartobj.dataEn.push(objDataEn)
          let passRate = Number((testScenarios.successNum / testScenarios.totalNum * 100).toFixed(0))
          chartobj.dataRight.push(passRate)
          this.ChartData.push(chartobj)
        })
        this.$nextTick(() => {
          this.drawLeftLine()
          this.drawRightLine()
        })
      }).catch(() => {
        this.$message({
          duration: 2000,
          showClose: true,
          type: 'warning',
          message: this.$t('promptMessage.getTaskListFail')
        })
      })
    },
    drawLeftLine () {
      let Chart = this.$echarts.init(document.getElementById('leftchart'))
      let colors = ['#89a6e6', '#deba69', '#a8d89b', '#baa3d4', '#9ed0c9']
      let option = {
        color: colors,
        legend: {
          top: '0%',
          left: 'right'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '测试场景',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              formatter: '{b} 用例数量: {@2012} ({d}%)'
            },
            labelLine: {
              show: true,
              length: 30
            },
            data: []
          }
        ]
      }
      if (this.language === 'en') {
        option.series[0].name = 'Test Scenarios'
        option.series[0].data = this.ChartData[0].dataEn
        option.series[0].label.formatter = '{b} Cases: {@2012} ({d}%)'
      } else if (this.language === 'cn') {
        option.series[0].name = '测试场景'
        option.series[0].data = this.ChartData[0].dataCh
      }
      Chart.setOption(option)
    },
    drawRightLine () {
      let Chart = this.$echarts.init(document.getElementById('rightchart'))
      let option = {
        title: {
          text: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: [
          {
            name: '成功率',
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %'
            },
            show: true
          }
        ],
        series: [{
          data: [],
          type: 'line',
          symbol: 'triangle',
          symbolSize: 20,
          lineStyle: {
            color: '#5470C6',
            width: 4,
            type: 'dashed'
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: '#EE6666',
            color: 'yellow',
            label: { show: true }
          }
        }]
      }
      if (this.language === 'en') {
        option.title.text = 'Test case success rate'
        option.yAxis[0].name = 'Success rate'
        option.xAxis.data = this.ChartData[0].nameRightEn
        option.series[0].data = this.ChartData[0].dataRight
      } else if (this.language === 'cn') {
        option.title.text = '测试用例成功率'
        option.xAxis.data = this.ChartData[0].nameRightCh
        option.series[0].data = this.ChartData[0].dataRight
      }
      Chart.setOption(option)
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
        return Y +
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
      }
    },
    downLoadReport () {
      this.activeName = this.finishActiveName
      this.downloadBtn = false
      setTimeout(() => {
        this.getPdf('#pdfDom')
        this.downloadBtn = true
      }, 1000)
    }
  }
}
</script>

<style lang='less'>
.report {
  .report-content {
    background: white;
    background-image: url('../../assets/images/edgegallery.png');
     .logo {
      display: flex;
      justify-content: space-between;
      height: 65px;
      line-height: 65px;
      padding-left: 25px;
      img {
        height: 65px;
      }
      .report-tap {
        display: flex;
        text-align: center;
        line-height: 65px;
        img{
          margin-top: 5px;
          width: 50px;
          height: 50px;
          line-height: 65px;
        }
        h3 {
          text-align: center;
          font-size: 25px;
          color: #55565df2;
        }
        p {
          color: #3399ff;
          text-align: center;
        }
      }
      .download{
        text-align: right;
        margin-right: 30px;
      }
    }
    .report-app-info{
      position: relative;
      .app-table {
        padding-left: 0 !important;
        margin-left: 25px;
      }
      .resulticon{
        position: absolute;
        right: 30px;
        top: -25px;
      }
    }

    .title {
      font-size: 20px;
      margin: 15px 0;
    }
    .title::before {
      content: "";
      display: inline-block;
      width: 3px;
      background: #3399ff;
      height: 20px;
      position: relative;
      top: 5px;
    }
      .report-chart{
          span{
            padding-left: 25px;
            line-height: 40px;
            font-size: 16px;
          }
          .report_analysis{
            display: flex;
            justify-content: space-around;
            .left,.right{
              width: 100%;
              height: 300px;
            }
            .sumchart{
              width: 100%;
              height: 300px;
            }
            .detailchart{
              width: 80%;
              height: 300px;
            }
          }
      }
    .report-detail{
      .detail-content{
        .scene{
          padding-left: 10px;
          line-height: 40px;
          font-size: 20px;
          font-weight: 600;
          color: #688ef3;
        }
          .el-collapse{
            padding: 5px 20px;
            .el-collapse-item__header{
              font-size: 16px !important;
            }
          }
          .headerStyle{
            padding: 0;
            height: 40px;
            line-height: 40px;
            font-size: 15px;
          }
          .el-table::before {
            width: 0;
          }
          .el-table td{
            padding: 0;
            height: 45px;
            line-height: 45px;
          }
          .el-table tr{
            background-color: transparent;
          }
          .el-table {
            background-color: transparent;
          }
          table th,table td{
            border-bottom: none !important;
            background-color: transparent;
          }
          .el-collapse-item__wrap {
            background-color: transparent;
           }
           .el-table, .el-table__expanded-cell {
          background-color: transparent;
          }
        }
    }
    .el-table{
      font-size: 16px;
    }
  }
}
</style>
