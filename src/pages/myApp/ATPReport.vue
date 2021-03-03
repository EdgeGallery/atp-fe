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
  <div
    class="report padding20"
    id="pdfDom"
  >
    <div class="report-content">
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
              :title="$t('report.reportanalysis')"
              :name="item.nameEn"
            >
              <div class="report-chart">
                <div class="report_analysis">
                  <div
                    class="left"
                    id="chartwidth"
                  >
                    <div
                      class="sumchart"
                      :id="`${item.nameEn}left`"
                    />
                  </div>
                  <div
                    class="right"
                    id="chartwidth"
                  >
                    <div
                      class="detailchart"
                      :id="`${item.nameEn}right`"
                    />
                  </div>
                </div>
              </div>
            </el-collapse-item>
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
      finishActiveName: []
    }
  },
  mounted () {
    this.getLanguage()
    this.getTaskId()
    this.getScenarioId()
    this.getReport()
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
      this.taskId = this.currUrl.split('?')[1].split('=')[1].split('&')[0]
    },
    getScenarioId () {
      this.scenarioId = this.currUrl.split('&')[1].split('=')[1]
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
        this.activeName = []
        this.finishActiveName = []
        data.testScenarios.forEach(element => {
          if (element.label === 'EdgeGallery' || element.id === this.scenarioId) {
            this.testScenarios.push(element)
          }
        })
        this.testScenarios.forEach(element => {
          let chartobj = {
            dataRight: [],
            nameRightCh: [],
            nameRightEn: [],
            nameCh: '',
            nameEn: '',
            dataCh: [],
            dataEn: []
          }
          chartobj.nameCh = element.nameCh
          chartobj.nameEn = element.nameEn
          // this.activeName.push(element.nameEn + element.testSuites[0].nameEn)
          this.activeName.push(element.nameEn)
          element.testSuites.forEach(ele => {
            this.finishActiveName.push(element.nameEn + ele.nameEn)
            this.finishActiveName.push(element.nameEn)
            ele.successNum = 0
            ele.failNum = 0
            chartobj.nameRightCh.push(ele.nameCh)
            chartobj.nameRightEn.push(ele.nameEn)
            let objDataCh = {
              name: '', value: 0
            }
            let objDataEn = {
              name: '', value: 0
            }
            objDataCh.name = ele.nameCh
            objDataEn.name = ele.nameEn
            objDataCh.value = ele.testCases.length
            objDataEn.value = ele.testCases.length
            chartobj.dataCh.push(objDataCh)
            chartobj.dataEn.push(objDataEn)
            ele.testCases.forEach(item => {
              if (item.result === 'success') {
                item.reason = '---'
                ele.successNum++
              } else if (item.result === 'failed') {
                ele.failNum++
              }
            })
            let passRate = Number((ele.successNum / (ele.successNum + ele.failNum) * 100).toFixed(0))
            chartobj.dataRight.push(passRate)
          })
          this.ChartData.push(chartobj)
        })
        this.$nextTick(() => {
          this.drawLeftLine()
          this.drawRightLine()
        })
      }).catch(() => {})
    },
    drawLeftLine () {
      this.ChartData.forEach(item => {
        let Chart = this.$echarts.init(document.getElementById(item.nameEn + 'left'))
        let colors = ['#89a6e6', '#deba69', '#a8d89b', '#9ed0c9', '#baa3d4']
        let option = {
          color: colors,
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['30%', '60%'],
              avoidLabelOverlap: false,
              labelLine: {
                show: false
              },
              data: []
            }
          ]
        }
        if (this.language === 'en') {
          option.series[0].name = item.nameEn
          option.series[0].data = item.dataEn
        } else if (this.language === 'cn') {
          option.series[0].name = item.nameCh
          option.series[0].data = item.dataCh
        }
        Chart.setOption(option)
      })
    },
    drawRightLine () {
      this.ChartData.forEach(item => {
        let Chart = this.$echarts.init(document.getElementById(item.nameEn + 'right'))
        let option = {
          title: {
            text: '',
            x: 'center'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: [
            {
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
              color: 'yellow'
            }
          }]
        }
        if (this.language === 'en') {
          option.title.text = 'Test case success rate'
          option.xAxis.data = item.nameRightEn
          option.series[0].data = item.dataRight
        } else if (this.language === 'cn') {
          option.title.text = '测试用例成功率'
          option.xAxis.data = item.nameRightCh
          option.series[0].data = item.dataRight
        }
        Chart.setOption(option)
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
    },
    downLoadReport () {
      this.activeName = this.finishActiveName
      setInterval(() => {
        this.getPdf('#pdfDom')
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

    .report-detail{
      .detail-content{
        .scene{
          padding-left: 10px;
          line-height: 40px;
          font-size: 20px;
          font-weight: 600;
          color: #688ef3;
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
              width: 600px;
              height: 300px;
            }
            .sumchart{
              width: 500px;
              height: 300px;
            }
            .detailchart{
              width: 500px;
              height: 300px;
            }
          }
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
          table th,table td{
            border-bottom: none !important;
          }
        }
    }
    .el-table{
      font-size: 16px;
    }
  }
}
</style>
