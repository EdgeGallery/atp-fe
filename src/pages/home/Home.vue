<!--
  -  Copyright 2021 Huawei Technologies Co., Ltd.
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
    <Navcomp />
    <div class="banner">
      <img
        v-if="language==='cn'"
        src="../../assets/images/bannercn.png"
        alt=""
      >
      <img
        v-else
        src="../../assets/images/banneren.png"
        alt=""
      >
    </div>
    <div class="statisticdata">
      <div class="left">
        <div class="lefttext">
          <p class="lefttitle">
            {{ this.$t('home.Statistics') }}
          </p>
          <p
            class="leftdetail"
          >
            {{ this.$t('home.chartTitle') }}
          </p>
        </div>
      </div>
      <div class="right">
        <div
          id="main"
        />
      </div>
    </div>
    <div class="modelmanage">
      <span class="modeltitle"> {{ this.$t('home.modelManagement') }}</span>
      <div class="modeldetail">
        <ul class="modelcontent">
          <li>
            <img
              src="../../assets/images/ScenarioManage.png"
              alt=""
            >
            <p class="keyword">
              {{ $t('testCase.testScenarioManagement') }}
            </p>
            <p class="font">
              {{ this.$t('testCase.testScenarioIntro') }}
            </p>
          </li>
          <li>
            <img
              src="../../assets/images/SuiteManage.png"
              alt=""
            >
            <p class="keyword">
              {{ $t('testCase.testSuiteManagement') }}
            </p>
            <p class="font">
              {{ this.$t('testCase.testSuiteIntro') }}
            </p>
          </li>
          <li>
            <img
              src="../../assets/images/TestCaseManage.png"
              alt=""
            >
            <p class="keyword">
              {{ $t('atp.testCaseManagement') }}
            </p>
            <p class="font">
              {{ this.$t('testCase.testCaseIntro') }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navcomp from '../../components/layout/Nav.vue'
import { Home } from '../../tools/api.js'
import Footer from '../../components/common/Footer.vue'
export default {
  components: { Navcomp, Footer },
  name: '',
  data () {
    return {
      chartData: [],
      monthData: [],
      total: '',
      language: localStorage.getItem('language')
    }
  },
  methods: {
    getStatisticData () {
      Home.getStatisticApi().then(res => {
        let data = res.data
        this.total = data.total
        for (const key in data) {
          if (key === 'fiveMonthAgo') {
            this.chartData[0] = data['fiveMonthAgo']
          } else if (key === 'fourMonthAgo') {
            this.chartData[1] = data['fourMonthAgo']
          } else if (key === 'threeMonthAgo') {
            this.chartData[2] = data['threeMonthAgo']
          } else if (key === 'twoMonthAgo') {
            this.chartData[3] = data['twoMonthAgo']
          } else if (key === 'oneMonthAgo') {
            this.chartData[4] = data['oneMonthAgo']
          } else if (key === 'currentMonth') {
            this.chartData[5] = data['currentMonth']
          }
        }
        this.drawLine()
      }).catch(() => {
        this.$message({
          duration: 2000,
          showClose: true,
          type: 'warning',
          message: this.$t('home.getFail')
        })
      })
    },
    getLastSixMon () {
      let date = new Date()
      let year = date.getFullYear()
      let mon = date.getMonth() + 1
      this.monthData = []
      for (let i = 0; i < 6; i++) {
        if (mon <= 0) {
          year = year - 1
          mon = mon + 12
        }
        if (mon < 10) {
          mon = '0' + mon
        }
        this.monthData[i] = year + '-' + mon
        mon = mon - 1
      }
      this.monthData.reverse()
    },
    drawLine () {
      let myChart = this.$echarts.init(document.getElementById('main'))
      let option = {
        grid: {
          x: 50,
          y: 50,
          x2: 10,
          y2: 50
        },
        tooltip: {
          trigger: 'axis',
          padding: 10,
          backgroundColor: '#ffffff',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#ffffff',
              width: 4,
              type: 'dotted',
              opacity: 0.2
            }
          },
          textStyle: {
            color: '#684399',
            fontSize: 24
          },
          shadowBlur: 5,
          shadowOffsetY: 5,
          shadowOffsetX: 2,
          shadowColor: '#ffffff',
          shadowStyle: {
            opacity: 0.3
          }
        },
        xAxis: {
          type: 'category',
          data: this.monthData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ffffff',
              width: 2,
              type: 'solid'
            }
          },
          offset: 10,
          axisLabel: {
            fontSize: 24,
            color: '#ffffff',
            fontWeight: 'lighter'
          }
        },
        yAxis: {
          // name: '测试数量',
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ffffff',
              type: 'dotted'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ffffff',
              width: 2,
              type: 'solid'
            }
          },
          axisLabel: {
            fontSize: 24,
            fontWeight: 'lighter'
          }
        },
        series: [{
          data: this.chartData,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 20,
          showSymbol: false,
          lineStyle: {
            color: '#ffffff',
            width: 5,
            type: 'solid'
            // opacity: 0.6
          },
          // emphasis: {
          //   lineStyle: {
          //     opacity: 1
          //   }
          // },
          itemStyle: {
            borderWidth: 4,
            borderColor: '#543b94',
            color: '#ffffff'
          }
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        if (myChart) {
          myChart.resize()
        }
      })
    }
  },
  mounted () {
    this.getLastSixMon()
    this.getStatisticData()
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
    }
  }
}
</script>

<style lang='less'>
  .banner{
    img{
      width: 100%;
      display: block;
    }
  }
  .statisticdata{
    background-color: #380879;
    height: 720px;
    display: flex;
    padding: 60px 240px;
    .left{
      width: 20%;
      .lefttext{
        position: relative;
        top: 180px;
      }
      .lefttitle{
        font-size: 60px;
        color: #fff;
        width: 100%;
      }
      .leftdetail{
        margin-top: 30px;
        font-size: 24px;
        color: #fff;
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-weight: lighter;
      }
    }
    .right{
      padding-left: 60px;
      width: 80%;
    }
    #main{
      height: 600px;
    }
  }
  .modelmanage{
    width: 100%;
    height: 400px;
    display: flex;
    background-color: #fff;
    .modeltitle{
      font-size: 60px;
      font-weight: 600;
      color: #9963ed;
      opacity: 0.2;
      writing-mode: vertical-lr;
      padding: 0 40px;
      text-align: center;
    }
    .modeldetail{
      width: 85%;
      text-align: center;
      .modelcontent{
        display: flex;
        justify-content: space-around;
        padding-top: 50px;
        li{
          text-align: center;
          .keyword{
            font-size: 30px;
            color: #333333;
            padding: 40px 0 20px 0;
          }
          .font{
            font-size: 18px;
            color: #666666;
            font-weight: lighter;
            word-wrap: break-word;
            width: 50%;
            margin: 0 auto;
          }
        }
      }
    }
  }
</style>
