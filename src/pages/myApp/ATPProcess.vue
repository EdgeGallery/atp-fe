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
  <div class="process">
    <div
      class="back"
    >
      <el-button
        id="back_button"
        type="primary"
        icon="el-icon-arrow-left"
        plain
        @click="jumpTo()"
      >
        {{ $t('atp.returnList') }}
      </el-button>
    </div>
    <div class="step-title">
      <el-steps
        :active="active"
        align-center
        finish-status="success"
      >
        <el-step
          :title="$t('atp.security')"
        />
        <el-step
          :title="$t('atp.complianceTest')"
        />
        <el-step
          :title="$t('atp.sandboxTest')"
        />
      </el-steps>
    </div>
    <div class="case-main">
      <div
        class="testcase-step"
        v-for="(item, i) in allcase"
        :key="i"
      >
        <div class="case-top">
          <div class="case-title-icon" />
        </div>
        <div class="case-detail">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in item"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Atp } from '../../tools/api.js'
// import { TESTNAME } from '../../tools/testdataname.js'
export default {
  data () {
    return {
      currUrl: window.location.href,
      active: 0,
      atptaskId: '',
      taskId: '',
      allcase: {
        securityTest: [],
        complianceTest: [],
        sandboxTest: []
      },
      interval: '',
      timeout: ''
    }
  },
  mounted () {
    // 传taskid
    this.getTaskId()
    this.getCaseData()
    this.interval = setInterval(() => {
      this.getCaseData()
    }, 1000)
    this.timeout = setTimeout(() => {
      this.clearInterval()
    }, 30000)
  },
  beforeDestroy () {
    this.clearInterval()
    clearTimeout(this.timeout)
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
      this.$router.push('/app/test/task')
    },
    clearInterval () {
      clearTimeout(this.interval)
      this.interval = null
    },
    getCaseData () {
      Atp.processApi(this.taskId).then(res => {
        let testCaseDetail = res.data.testCaseDetail
        this.allcase = {
          securityTest: [],
          complianceTest: [],
          sandboxTest: []
        }
        for (const key in testCaseDetail) {
          let caseDetail = testCaseDetail[key][0]
          for (const keyin in caseDetail) {
            let obj = {
              content: '',
              size: 'large',
              icon: '',
              type: ''
            }
            obj.content = keyin
            if (caseDetail[keyin].result === 'success') {
              obj.icon = 'el-icon-check'
              obj.type = 'success'
            } else if (caseDetail[keyin].result === 'failed') {
              obj.icon = 'el-icon-close'
              obj.type = 'danger'
            } else if (caseDetail[keyin].result === 'running') {
              obj.icon = 'el-icon-loading'
              obj.type = 'info'
            } else {
              obj.icon = ''
              obj.type = ''
            }
            if (key === 'securityTest') {
              this.allcase.securityTest.push(obj)
            } else if (key === 'complianceTest') {
              this.allcase.complianceTest.push(obj)
            } else {
              this.allcase.sandboxTest.push(obj)
            }
          }
        }
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: this.$t('promptMessage.getprocessFail'),
          type: 'warning'
        })
        this.clearInterval()
      })
      this.allcase.securityTest.every((item) => {
        if (item.type === 'success' || item.type === 'danger') {
          this.active = 1
        }
      })
      this.allcase.complianceTest.every((element) => {
        if (element.type === 'success' || element.type === 'danger') {
          this.active = 2
        }
      })
      this.allcase.sandboxTest.every((val) => {
        if (val.type === 'success' || val.type === 'danger') {
          this.active = 3
        }
      })
      if (this.active === 3) {
        this.clearInterval()
      }
    }
  }
}
</script>
<style lang="less">
  .process{
    background-color: white;
    margin: 0 56px;
  .back{
    padding: 10px 10px 0;
  }
  .step-title{
    margin-bottom: 50px;
    margin-top: 50px;
    .el-step__title {
      font-size: 20px;
      line-height: 45px;
      border-radius: 50%;
    }
  }
  .case-main{
    display: flex;
    justify-content: space-around;
    padding-bottom: 20px;
    .testcase-step{
        width: 300px;
      .case-top{
        display: flex;
        background-color:#6a849c;
        height:50px;
        .case-title-icon{
          position: relative;
          left:50%;
          transform:translateX(-25px);
          top:20px;
          border: 1px solid #7e9c94;
          border-radius: 50%;
          width:50px;
          height:50px;
          background: url('../../assets/images/test-step.png');
          background-position: center;
        }
      }
      .case-detail{
        height: 500px;
        background-color:#f5f9fb;
        padding:25px 10px 10px;
        .el-timeline{
          font-size: 18px;
        }
      }
    }
    }
  }
</style>
