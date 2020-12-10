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
  <div class="report padding56">
    <div class="report-content padding20">
      <div class="download">
        <el-button
          id="back_button"
          type="primary"
          icon="el-icon-arrow-left"
          @click="jumpTo()"
        >
          {{ $t('atp.returnList') }}
        </el-button>
        <el-button
          size="large"
          type="primary"
          icon="el-icon-download"
          @click="downLoadReport()"
        >
          {{ $t('report.downloadReport') }}
        </el-button>
      </div>
      <div class="report-tap">
        <h3> {{ $t('report.testReport') }}</h3>
      </div>
      <div class="title">
        {{ $t('atp.baseInfo') }}
      </div>
      <div class="report-app--info">
        <el-row :gutter="20">
          <el-col
            :span="23"
            class="app-table"
          >
            <el-table
              :data="tableData"
              border
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
      </div>
      <div class="report-chart">
        <div class="title">
          {{ $t('report.reportanalysis') }}
        </div>
        <div>
          <el-row :gutter="20">
            <el-col
              :span="12"
              class="chartPie"
            >
              <ve-pie :data="chartData" />
            </el-col>
            <el-col
              :span="10"
              class="chartLine"
              style="margin-top:40px;"
            >
              <el-table
                :data="TestDataSum"
              >
                <el-table-column
                  prop="name"
                  :label="$t('atp.testItems')"
                />
                <el-table-column
                  prop="success"
                  :label="$t('atp.success')"
                />
                <el-table-column
                  prop="failed"
                  :label="$t('atp.failed')"
                />
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div class="title">
          {{ $t('atp.virusScan') }}
        </div>
        <div class="casereport">
          <el-table
            :data="virusScanningTest"
          >
            <el-table-column
              prop="name"
              :label="$t('atp.caseName')"
            />
            <el-table-column
              prop="result"
              :label="$t('atp.result')"
            />
            <el-table-column
              prop="reason"
              :label="$t('report.failReason')"
            />
          </el-table>
        </div>
        <div class="title">
          {{ $t('atp.complianceTest') }}
        </div>
        <div class="casereport">
          <el-table
            :data="complianceTest"
          >
            <el-table-column
              prop="name"
              :label="$t('atp.caseName')"
            />
            <el-table-column
              prop="result"
              :label="$t('atp.result')"
            />
            <el-table-column
              prop="reason"
              :label="$t('report.failReason')"
            />
          </el-table>
        </div>
        <div class="title">
          {{ $t('atp.sandboxTest') }}
        </div>
        <div class="casereport">
          <el-table
            :data="sandboxTest"
          >
            <el-table-column
              prop="name"
              :label="$t('atp.caseName')"
            />
            <el-table-column
              prop="result"
              :label="$t('atp.result')"
            />
            <el-table-column
              prop="reason"
              :label="$t('report.failReason')"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Atp } from '../../tools/api.js'
import { TESTNAME } from '../../tools/testdataname.js'
export default {
  name: 'Report',
  data () {
    return {
      currUrl: window.location.href,
      taskId: '',
      tableData: [],
      TestDataSum: [
        {
          name: '病毒扫描',
          success: 0,
          failed: 0
        },
        {
          name: '遵从性测试',
          success: 0,
          failed: 0
        },
        {
          name: '沙箱测试',
          success: 0,
          failed: 0
        }
      ],
      virusScanningTest: [],
      complianceTest: [],
      sandboxTest: [],
      chartData: {
        columns: ['status', 'case'],
        rows: [{ status: 'Virus Scan', case: 0 }, { status: 'Compliance Test', case: 0 }, { status: 'Sandbox Test', case: 0 }]
      }
    }
  },
  mounted () {
    this.getTaskId()
    this.getReport()
    console.log(this.taskId)
  },
  methods: {
    jumpTo () {
      this.$router.push('/app/test/task')
    },
    getTaskId () {
      if (this.currUrl.indexOf('?') !== -1) {
        this.taskId = this.currUrl.split('?')[1].split('=')[1]
      } else {
        // this.tableData.push(JSON.parse(sessionStorage.getItem('taskData')))
        // this.taskId = this.tableData[0].id
        // let params = JSON.parse(sessionStorage.getItem('taskData'))
        let params = sessionStorage.getItem('taskData')
        this.taskId = params.id
      }
    },
    getReport () {
      Atp.processApi(this.taskId).then(res => {
        this.tableData.push(res.data)
        let testCaseDetail = res.data.testCaseDetail
        // let testCaseDetail = this.tableData[0].testCaseDetail
        for (const key in testCaseDetail) {
          let casedata = testCaseDetail[key][0]
          for (const keyin in casedata) {
            let obj = {
              name: '',
              result: '',
              reason: ''
            }
            obj.name = keyin
            obj.result = casedata[keyin].result
            obj.reason = casedata[keyin].reason
            if (key === 'virusScanningTest') {
              this.virusScanningTest.push(obj)
              if (casedata[keyin].result === 'success') {
                this.TestDataSum[0].success++
              } else if (casedata[keyin].result === 'failed') {
                this.TestDataSum[0].failed++
              }
            } else if (key === 'complianceTest') {
              this.complianceTest.push(obj)
              if (casedata[keyin].result === 'success') {
                this.TestDataSum[1].success++
              } else if (casedata[keyin].result === 'failed') {
                this.TestDataSum[1].failed++
              }
            } else {
              this.sandboxTest.push(obj)
              if (casedata[keyin].result === 'success') {
                this.TestDataSum[2].success++
              } else if (casedata[keyin].result === 'failed') {
                this.TestDataSum[2].failed++
              }
            }
          }
        }
        this.chartData.rows[0].case = this.virusScanningTest.length
        this.chartData.rows[1].case = this.complianceTest.length
        this.chartData.rows[2].case = this.sandboxTest.length
      })
    },
    changeName () {
      if (this.language === 'en') {
        this.TestDataSum[0].name = TESTNAME[0].label[1]
        this.TestDataSum[1].name = TESTNAME[1].label[1]
        this.TestDataSum[2].name = TESTNAME[2].label[1]
      } else if (this.language === 'cn') {
        this.TestDataSum[0].name = TESTNAME[0].label[0]
        this.TestDataSum[1].name = TESTNAME[1].label[0]
        this.TestDataSum[2].name = TESTNAME[2].label[0]
      }
    },
    downLoadReport () {
      Atp.downLoadReportApi(this.taskId).then(res => {
        this.$message({
          duration: 2000,
          message: this.$t('promptMessage.downloadSuccess'),
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: this.$t('promptMessage.downloadFail'),
          type: 'warning'
        })
      })
    }
  },
  watch: {
    '$i18n.locale': function () {
      let language = localStorage.getItem('language')
      this.language = language
      this.changeName()
    }
  }
}
</script>

<style lang='less' scoped>
.report {
  .report-content {
    background: white;
    .download{
      // text-align: right;
      display: flex;
      justify-content: space-between;
    }
    .report-tap {
      // padding: 20px 0;
      h3 {
        text-align: center;
        margin: 25px 0;
      }
      p {
        color: #3399ff;
        text-align: center;
      }
    }
    .app-img {
      text-align: center;
      border: 1px solid #ddd;
      border-right: 0;
      height: 97px;
      img {
        width: 85px;
      }
    }
    .app-table {
      padding-left: 0 !important;
      margin-left: 25px;
    }
    .title {
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
    .report-chart {
      margin: 25px 0;
      .casereport{
        margin-left: 40px;
      }
    }
  }
}
</style>
