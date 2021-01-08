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
      >
        <el-step
          :title="$t('atp.security')"
          :class="steponeIcon"
        >
          <em
            class="stepone"
            :class="step1class ? 'secFinishSuccess' : 'secFinishFail'"
            slot="icon"
          />
        </el-step>
        <el-step
          :title="$t('atp.complianceTest')"
          :class="steptwoIcon"
        >
          <em
            class="steptwo"
            :class="step2class ? 'comFinishSuccess' : 'comFinishFail'"
            slot="icon"
          />
        </el-step>
        <el-step
          :title="$t('atp.sandboxTest')"
          :class="stepthreeIcon"
        >
          <em
            class="stepthree"
            :class="step3class ? 'sandFinishSuccess' : 'sandFinishFail'"
            slot="icon"
          />
        </el-step>
      </el-steps>
    </div>
    <div class="case-main">
      <div
        class="testcase-step"
      >
        <div class="case-top">
          <div class="case-title-icon">
            <span>{{ securityNum }}</span>
            <span class="sum">/</span>
            <span class="sum">{{ allcase.securityTest.length }}</span>
          </div>
        </div>
        <div class="case-detail">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in allcase.securityTest"
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
      <div
        class="testcase-step"
      >
        <div class="case-top">
          <div class="case-title-icon">
            <span>{{ complianceNum }}</span>
            <span class="sum">/</span>
            <span class="sum">{{ allcase.complianceTest.length }}</span>
          </div>
        </div>
        <div class="case-detail">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in allcase.complianceTest"
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
      <div
        class="testcase-step"
      >
        <div class="case-top">
          <div class="case-title-icon">
            <span>{{ sandboxNum }}</span>
            <span class="sum">/</span>
            <span class="sum">{{ allcase.sandboxTest.length }}</span>
          </div>
        </div>
        <div class="case-detail">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in allcase.sandboxTest"
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
    <el-dialog
      :visible.sync="dialogSuccess"
      :close-on-click-modal="false"
      class="finishDialog"
    >
      <div>
        <p>恭喜你 通过本次测试任务！</p>
      </div>
      <img
        src="../../assets/images/complianceTest_icon.png"
        class="curp"
        @click="jumpTo('/index')"
        alt
      >
      <div
        class="button-center"
      >
        <el-button
          type="primary"
          @click="cancel()"
          plain
        >
          {{ $t('atp.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="CheckReport()"
        >
          查看报告
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogFailed"
      :close-on-click-modal="false"
      class="finishDialog"
    >
      <div>
        <p>您有如下用例未通过！</p>
      </div>
      <img
        src="../../assets/images/complianceTest_icon.png"
        class="curp"
        @click="jumpTo('/index')"
        alt
      >
      <div
        class="button-center"
      >
        <el-button
          type="primary"
          @click="cancel()"
          plain
        >
          {{ $t('atp.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="CheckReport()"
        >
          查看报告
        </el-button>
      </div>
    </el-dialog>
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
      step1class: false,
      step2class: false,
      step3class: false,
      steponeIcon: 'running',
      steptwoIcon: 'running',
      stepthreeIcon: 'running',
      intervalNumone: '',
      intervalNumtwo: '',
      intervalNumthree: '',
      atptaskId: '',
      taskId: '',
      allcase: {
        securityTest: [],
        complianceTest: [],
        sandboxTest: []
      },
      interval: '',
      timeout: '',
      dialogSuccess: false,
      dialogFailed: false,
      securityNum: 0,
      complianceNum: 0,
      sandboxNum: 0
    }
  },
  mounted () {
    // 传taskid
    this.getTaskId()
    this.getCaseData()
    this.interval = setInterval(() => {
      this.getCaseData()
    }, 1000)
    this.intervalNumone = setInterval(() => {
      this.changeNumOne()
    }, 1000)
    this.intervalNumtwo = setInterval(() => {
      this.changeNumTwo()
    }, 1000)
    this.intervalNumthree = setInterval(() => {
      this.changeNumThree()
    }, 1000)
    this.timeout = setTimeout(() => {
      this.clearInterval()
    }, 30000)
  },
  beforeDestroy () {
    this.clearInterval()
    clearTimeout(this.timeout)
    clearTimeout(this.intervalNumone)
    clearTimeout(this.intervalNumtwo)
    clearTimeout(this.intervalNumthree)
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
              size: 'normal',
              icon: '',
              type: ''
            }
            obj.content = keyin
            if (caseDetail[keyin].result === 'success') {
              obj.type = 'primary'
            } else if (caseDetail[keyin].result === 'failed') {
              obj.type = 'danger'
            } else if (caseDetail[keyin].result === 'running') {
              obj.icon = 'el-icon-loading'
              obj.type = 'warning'
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
        this.changeIcon()
        this.changeNumOne()
        this.changeNumTwo()
        this.changeNumThree()
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: this.$t('promptMessage.getprocessFail'),
          type: 'warning'
        })
        this.clearInterval()
      })

      // if (this.active === 3) {
      //   this.clearInterval()
      // }
    },
    changeIcon () {
      if (this.allcase.securityTest.every((item) => {
        return item.type === 'primary' || item.type === 'danger'
      })) {
        this.active = 1
        clearTimeout(this.intervalNumone)
      }
      if (this.allcase.complianceTest.every((item) => {
        return item.type === 'primary' || item.type === 'danger'
      })) {
        this.active = 2
        clearTimeout(this.intervalNumtwo)
      }
      if (this.allcase.sandboxTest.every((item) => {
        return item.type === 'primary' || item.type === 'danger'
      })) {
        this.active = 3
        clearTimeout(this.intervalNumthree)
      }
      console.log(this.active)
      // top图标变化
      if (this.allcase.securityTest.some((item) => {
        return item.type === 'danger'
      })) {
        this.steponeIcon = 'fail'
        this.step1class = false
      } else {
        this.step1class = true
      }
      if (this.allcase.complianceTest.some((item) => {
        return item.type === 'danger'
      })) {
        this.steptwoIcon = 'fail'
        this.step2class = false
      } else {
        this.step2class = true
      }
      if (this.allcase.sandboxTest.some((item) => {
        return item.type === 'danger'
      })) {
        this.stepthreeIcon = 'fail'
        this.step3class = false
      } else {
        this.step3class = true
      }
    },
    changeNumOne () {
      this.securityNum = 0
      // 用例执行个数
      this.allcase.securityTest.forEach((item) => {
        if (item.result === 'success') {
          this.securityNum++
        }
      })
    },
    changeNumTwo () {
      this.complianceNum = 0
      this.allcase.complianceTest.forEach((item) => {
        if (item.result === 'success') {
          this.complianceNum++
        }
      })
    },
    changeNumThree () {
      this.sandboxNum = 0
      this.allcase.sandboxTest.forEach((item) => {
        if (item.result === 'success') {
          this.sandboxNum++
        }
      })
    },
    // 测试完成弹框
    CheckReport () {
      let taskId = this.taskId
      let routeData = this.$router.resolve({ name: 'atpreport', query: { taskId: taskId } })
      window.open(routeData.href, '_blank')
    },
    cancel () {
      this.dialogSuccess = false
      this.dialogFailed = false
    }
  }
}
</script>
<style lang="less">
  .process{
    background-color: white;
    // margin: 0 56px;
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
      font-weight: 500;
      color: #303133;
    }
    .el-step__line {
      background-color: #6c92fa;
    }
    .el-step__icon{
      width:90px;
      height:90px;
      bottom: 20px;
      border: 2px solid #6c92fa;
    }
    .success{
      animation-play-state: paused;
      .el-step__icon{
        border: 2px solid #6c92fa;
      }
    }
    .fail{
       animation-play-state: paused;
      .el-step__icon{
        border: 2px solid #F56C6C;
      }
    }
    .stepone, .steptwo, .stepthree{
      width: 86px;
      height: 86px;
      border-radius: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .stepone{
      background: url('../../assets/images/securityTest_icon.png');
    }
    .steptwo{
      background: url('../../assets/images/complianceTest_icon.png');
    }
    .stepthree{
      background: url('../../assets/images/sandboxTest_icon.png');
    }
    .secFinishSuccess{
      background: url('../../assets/images/secFinishSuccess.png');
    }
    .comFinishSuccess{
      background: url('../../assets/images/comFinishSuccess.png');
    }
    .sandFinishSuccess{
      background: url('../../assets/images/sandFinishSuccess.png');
    }
    .secFinishFail{
      background: url('../../assets/images/secFinishFail.png');
    }
    .comFinishFail{
      background: url('../../assets/images/comFinishFail.png');
    }
    .sandFinishFail{
      background: url('../../assets/images/sandFinishFail.png');
    }
    .running{
      .el-step__icon{
        border: 2px dashed #6c92fa;
        animation: rotate 5s infinite linear ;
      }
      .stepone, .steptwo, .stepthree{
        animation: rotateinside 5s infinite linear ;
      }
    }
    // .stop{
    //   animation-play-state: paused;
    // }
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
  }
  .case-main{
    display: flex;
    justify-content: space-around;
    padding-bottom: 20px;
    .testcase-step{
        width: 350px;
      .case-top{
        width: 350px;
        display: flex;
        background-color:#6c93bf;
        height:60px;
        background: url('../../assets/images/casetop_img.png');
        background-position:center;
        .case-title-icon{
          position: relative;
          left:50%;
          transform:translateX(-40px);
          width:80px;
          height:60px;
          text-align: center;
          line-height: 60px;
          span{
            font-size: 40px;
            color: #fff;
            font-weight: 700;
          }
          .sum{
            font-size: 25px;
            color: #6c8ce3;
          }
        }
      }
      .case-detail{
        height: 500px;
        // background-color:#f5f9fb;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        padding:25px 10px 10px;
        .el-timeline{
          font-size: 18px;
        }
      }
    }
  }
    .el-dialog{
        width: 30%;
        .button-center{
          text-align: center;
        }
    }
    //
  // .el-step.is-horizontal .el-step__line{
  //   top: 50%;
  //   left: 94px;
  //   right: 48px;
  // }
  }
</style>
