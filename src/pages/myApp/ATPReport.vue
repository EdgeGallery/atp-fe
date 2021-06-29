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
    class="report padding200"
    id="pdfDom"
  >
    <div class="report-content padding20">
      <div class="logo">
        <img
          src="../../assets/images/logo.png"
          alt=""
        >
        <h3> {{ $t('report.testReport') }}</h3>
        <div>
          <el-button
            v-if="downloadBtn"
            class="dark-button"
            icon="el-icon-download"
            plain
            @click="downLoadReport()"
          >
            {{ $t('report.downloadReport') }}
          </el-button>
        </div>
      </div>
      <div class="baseInfo padding20">
        <div class="title">
          <div class="title-text">
            <span class="titleTextWidth">
              {{ $t('atp.baseInfo') }}
            </span>
          </div>
          <div
            class="backColor"
          />
        </div>
        <div class="report-app-info">
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
          <img
            :src="resulticon"
            alt=""
            class="resulticon"
          >
        </div>
      </div>
      <div class="report-chart">
        <div
          class="left"
          id="chartwidth"
        >
          <div class="title padding20">
            <div class="title-text">
              <span class="titleTextWidth">
                {{ $t('report.caseDistribution') }}
              </span>
            </div>
            <div
              class="backColor"
            />
          </div>
          <div
            class="sumchart"
            id="leftchart"
          />
        </div>
        <div
          class="right"
          id="chartwidth"
        >
          <div class="title padding20">
            <div class="title-text">
              <span class="titleTextWidth">
                {{ $t('report.successfulRate') }}
              </span>
            </div>
            <div
              class="backColor"
            />
          </div>
          <div
            class="detailchart"
            id="rightchart"
          />
        </div>
      </div>
      <div class="report-detail padding20">
        <div class="title">
          <div class="title-text">
            <span
              class="titleTextWidth"
            >
              {{ $t('report.reportDetail') }}
            </span>
          </div>
          <div
            class="backColor"
          />
        </div>
        <div
          v-for="(item,index) in testScenarios"
          :key="index"
          class="detail-content"
        >
          <div style="padding:10px 0 0;">
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
                header-cell-class-name="tableheaderStyle"
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
    setBackColorWidth () {
      const titleWidth = document.getElementsByClassName('titleTextWidth')
      const backColorWidth = document.getElementsByClassName('backColor')
      for (let index = 0; index < titleWidth.length; index++) {
        backColorWidth[index].style.width = titleWidth[index].offsetWidth + 'px'
      }
    },
    getReport () {
      Userpage.getTaskApiV2(this.taskId).then(res => {
        let data = res.data.data
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
          this.setBackColorWidth()
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
      let colors = ['#d3b6ff', '#ffd65e', '#616cf7', '#ff509f', '#9ed0c9']
      let option = {
        color: colors,
        legend: {
          top: '0%',
          orient: 'vertical',
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
            radius: ['30%', '60%'],
            // avoidLabelOverlap: false,
            label: {
              formatter: '{b} \n用例数量: {@2012} ({d}%)',
              minMargin: 10,
              edgeDistance: 10,
              lineHeight: 20
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
      window.addEventListener('resize', () => {
        if (Chart) {
          Chart.resize()
        }
      })
    },
    drawRightLine () {
      let Chart = this.$echarts.init(document.getElementById('rightchart'))
      let option = {
        grid: {
          x: 80,
          y: 20,
          x2: 50,
          y2: 50
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#c77bf4',
          axisPointer: {
            animation: false,
            type: 'line',
            lineStyle: {
              color: '#b44ef1',
              width: 4,
              type: 'dotted',
              opacity: 0.2
            }
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            color: '#666666',
            fontSize: '16'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#cccccc',
              type: 'dotted'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %',
              color: '#666666',
              fontSize: '16'
            },
            show: true,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#cccccc',
                type: 'dotted'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#cccccc',
                width: 2,
                type: 'dashed'
              }
            }
          }
        ],
        series: [{
          data: [],
          type: 'line',
          symbol: 'circle',
          symbolSize: 20,
          lineStyle: {
            color: '#b44ef1',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            borderWidth: 4,
            borderColor: '#b44ef1',
            color: '#fff',
            label: { show: true }
          }
        }]
      }
      if (this.language === 'en') {
        option.xAxis.data = this.ChartData[0].nameRightEn
        option.series[0].data = this.ChartData[0].dataRight
      } else if (this.language === 'cn') {
        option.xAxis.data = this.ChartData[0].nameRightCh
        option.series[0].data = this.ChartData[0].dataRight
      }
      Chart.setOption(option)
      window.addEventListener('resize', () => {
        if (Chart) {
          Chart.resize()
        }
      })
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
    // background-image: url('../../assets/images/edgegallery.png');
     .logo {
      display: flex;
      justify-content: space-between;
      height: 65px;
      line-height: 65px;
      img {
        height: 65px;
      }
      h3{
        font-family: sans-serif;
        color: #380879;
        font-size: 24px;
        font-weight: 800;
      }
    }
    .baseInfo{
      background-color: #fff;
      box-shadow: 0 0 10px 2px #e8e6f1;
      margin-bottom: 30px;
      border-radius: 6px;
      .report-app-info{
        position: relative;
        .resulticon{
          position: absolute;
          right: 20px;
          top: -30px;
        }
        .el-table th,.el-table td{
          border-bottom: none !important;
        }
        .el-table__fixed::before, .el-table__fixed-right::before, .el-table::before{
          width: 0;
        }
      }
    }
    .title {
      font-family: sans-serif;
      font-size: 24px;
      color: #380879;
      padding-bottom: 10px;
      .title-text{
        position: relative;
        z-index: 100;
      }
      .backColor{
          height: 15px;
          border-radius: 10px;
          background-color: #d3b6ff;
          // float: left;
          position: relative;
          top: -10px;
          left: 8px;
      }
    }
      .report-chart{
        display: flex;
        margin-bottom: 30px;
            .left{
              margin-right: 30px;
            }
            .left,.right{
              width: 100%;
              // height: 500px;
              background-color: #fff;
              box-shadow: 0 0 10px 2px #e8e6f1;
              border-radius: 6px;
            }
            .sumchart{
              width: 100%;
              height: 500px;
            }
            .detailchart{
              width: 100%;
              height: 500px;
            }
      }
    .report-detail{
      background-color: #fff;
      box-shadow: 0 0 10px 2px #e8e6f1;
      border-radius: 6px;
      .detail-content{
        .scene{
          padding-left: 10px;
          line-height: 40px;
          font-size: 24px;
          font-weight: 600;
          color: #a000ff;
        }
          .el-collapse{
            padding: 5px 20px;
            .el-collapse-item{
              padding: 8px 0;
            }
            .el-collapse-item__content{
              padding-bottom: 0;
            }
            .el-collapse-item__header{
              font-size: 20px;
              color: #111111;
              height: 50px;
            }
            .el-collapse-item__wrap{
              border: none;
            }
          }
          .tableheaderStyle{
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
    // .el-table{
    //   font-size: 16px;
    // }
  }
}
</style>
