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
        src="../../assets/images/bannercn.png"
        alt=""
        class="banner-img"
        v-if="language==='cn'"
      >
      <img
        v-else
        src="../../assets/images/banneren.png"
        alt=""
        class="banner-img"
      >
      <el-button
        class="view-case"
        @click="jumpTo('/testcasemanage')"
      >
        {{ $t('userpage.seeDetail') }}<span class="right">></span>
      </el-button>
    </div>
    <div
      style="background-color: #f7f5f9;"
      class="padding200"
    >
      <div class="modelmanage">
        <div class="mainmodel">
          <div class="title">
            <p class="toptext">
              测试模型管理
            </p>
            <p class="bottomtext">
              Model management
            </p>
          </div>
          <div class="detailinfo">
            <p>{{ $t('home.importTitle') }}</p>
            <p>{{ $t('home.importIntro') }}</p>
          </div>
        </div>
        <div class="modelList">
          <div class="list">
            <div class="content">
              <img
                src="../../assets/images/ScenarioManage.png"
                alt=""
                class="listpic"
              >
              <div class="content-info">
                <div class="infoTitle flex">
                  <p class="name">
                    {{ $t('testCase.testScenarioManagement') }}
                  </p>
                  <span
                    class="godetail"
                    @click="jumpTo('/scenarios')"
                  />
                </div>
                <span class="description">{{ this.$t('testCase.testScenarioIntro') }}</span>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="content">
              <img
                src="../../assets/images/SuiteManage.png"
                alt=""
                class="listpic"
              >
              <div class="content-info">
                <div class="infoTitle flex">
                  <p class="name">
                    {{ $t('testCase.testSuiteManagement') }}
                  </p>
                  <span
                    class="godetail"
                    @click="jumpTo('/suites')"
                  />
                </div>
                <span class="description"> {{ this.$t('testCase.testSuiteIntro') }}</span>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="content">
              <img
                src="../../assets/images/TestCaseManage.png"
                alt=""
                class="listpic"
              >
              <div class="content-info">
                <div class="infoTitle flex">
                  <p class="name">
                    {{ $t('atp.testCaseManagement') }}
                  </p>
                  <span
                    class="godetail"
                    @click="jumpTo('/testcasemanage')"
                  />
                </div>
                <span class="description">{{ this.$t('testCase.testCaseIntro') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="taskManage flex">
        <div class="infoText">
          <div class="title">
            <p class="toptext">
              任务管理
            </p>
            <p class="bottomtext">
              ask Management
            </p>
            <p class="task-des">
              {{ $t('home.taskIntro') }}
            </p>
            <p>
              <el-button
                class="dark-button"
                @click="jumpTo('/tasklist')"
              >
                {{ $t('home.viewList') }}
              </el-button>
            </p>
          </div>
        </div>
        <div class="taskImg">
          <img
            src="../../assets/images/taskmanageimg.png"
            alt=""
          >
        </div>
      </div>
      <div class="taskManage flex">
        <div class="taskImg">
          <img
            src="../../assets/images/contributionimg.png"
            alt=""
          >
        </div>
        <div class="infoText">
          <div
            class="title"
            style="padding-left:5%;"
          >
            <p class="toptext">
              贡献管理
            </p>
            <p class="bottomtext">
              Contribution Management
            </p>
            <p class="task-des">
              {{ $t('home.contributionIntro') }}
            </p>
            <p>
              <el-button
                class="dark-button"
                @click="jumpTo('/contributionList')"
              >
                {{ $t('home.viewList') }}
              </el-button>
            </p>
          </div>
        </div>
      </div>
      <div class="statisticdata">
        <div class="left">
          <div class="title">
            <p class="toptext">
              数据统计
            </p>
            <p class="bottomtext">
              Statistics
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
      language: localStorage.getItem('language'),
      screenHeight: document.body.clientHeight,
      screenWidth: document.body.clientWidth
    }
  },
  methods: {
    setScreenHeight (screenHeight) {
      this.$nextTick(() => {
        let oDiv = document.getElementsByClassName('banner-img')
        oDiv[0].style.height = (Number(screenHeight) - 65) + 'px'
      })
    },
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
              color: '#bfadd7',
              width: 4,
              type: 'dotted',
              opacity: 0.2
            }
          },
          textStyle: {
            color: '#380879',
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
              color: '#8566af',
              width: 2,
              type: 'solid'
            }
          },
          offset: 10,
          axisLabel: {
            fontSize: 24,
            color: '#52278b'
            // fontWeight: 'lighter'
          }
        },
        yAxis: {
          // name: '测试数量',
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ac96c9',
              type: 'dotted'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#5f3794',
              width: 2,
              type: 'solid'
            }
          },
          axisLabel: {
            color: '#52278b',
            fontSize: 24
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
            color: '#8566af',
            width: 5,
            type: 'solid'
          },
          emphasis: {
            lineStyle: {
              color: '#380879'
            }
          },
          itemStyle: {
            borderWidth: 4,
            borderColor: '#380879',
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
    },
    jumpTo (path) {
      this.$router.push(path)
    }
  },
  mounted () {
    this.setScreenHeight(this.screenHeight)
    window.onresize = () => {
      return (() => {
        this.screenHeight = document.body.clientHeight
        this.screenWidth = document.body.clientWidth
        this.setScreenHeight(this.screenHeight)
      })()
    }
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
    position: relative;
    img{
      width: 100%;
      display: block;
    }
    .el-button.view-case{
      position: absolute;
      bottom: 20%;
      left: 6%;
      min-width: 200px;
      height: 60px;
      background: none;
      border: 2px solid #fff;
      font-size: 20px;
      color: #fff;
      border-radius: 8px;
      margin: 118px 0 0 140px;
      .right{
        font-size: 14px;
        margin-left: 20px;
      }
    }
    .el-button.view-case:hover{
      background: #fff;
      color: #542c8a;
    }
  }
  .modelmanage{
    width: 100%;
    padding: 100px 0;
    .mainmodel{
      display: flex;
      .detailinfo{
        padding-left: 50px;
        border-left: 2px solid #987cbb;
        p{
          font-size: 22px;
          color: #280b4f;
        }
      }
    }
    .modelList{
      display:  flex;
      padding: 70px 0 10px;
      .list{
        width: 33%;
        padding: 0 2%;
        .content{
          position: relative;
          padding-bottom: 80px;
          .listpic{
            width: 100%;
            display: block;
            border-radius: 12px 12px 0 0;
          }
          .content-info{
            border-radius: 0 0 12px 12px;
            background-color: #fff;
            position: absolute;
            width: 100%;
            bottom: 0px;
            padding: 26px 20px 22px;
            .infoTitle{
              justify-content: space-between;
              position: relative;
              .godetail{
                width: 20px;
                height: 20px;
                position: absolute;
                top: 7px;
                right: -8px;
                background-image: url('../../assets/images/godetail.png');
                background-repeat: no-repeat;
              }
            }
            .name{
              font-size: 24px;
              color: #380879;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .description{
              display: block;
              font-size: 20px;
              color: #7144af;
              width: 100%;
              max-height: 0px;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-top: 10px;
              transition: all 0.6s ease-in-out;
            }
          }
        }
        .content:hover .description{
          max-height: 80px;
          transition: all 0.6s ease-in-out;
        }
        .content:hover .name{
          white-space: normal;
        }
        .content:hover .content-info{
          opacity: 0.9;
          border-radius: 12px;
        }
      }
    }
  }
  .taskManage{
    .infoText,.taskImg{
      width: 50%;
    }
    .infoText{
      position: relative;
      .title{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .taskImg{
      box-shadow: 0 0 20px rgba(66, 21, 128, 0.2);
    }
    .task-des{
      white-space: normal;
      color: #280b4f;
      font-size: 22px;
      padding: 55px 0;
    }
    img{
      display: block;
      width: 100%;
    }

  }
  .statisticdata{
    height: 720px;
    display: flex;
    padding: 100px 0;
    .left{
      position: relative;
      .title{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
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
        font-size: 22px;
        color: #280b4f;
        width: 100%;
        height: 36px;
        line-height: 36px;
        white-space: normal;
      }
    }
    .right{
      padding-left: 60px;
      width: 80%;
    }
    #main{
      height: 500px;
    }
  }
  .title{
      padding-right: 100px;
      white-space: nowrap;
      .toptext{
        font-size: 34px;
        color: #380879;
       }
      .bottomtext{
        font-size: 22px;
        color: #280b4f;
      }
    }
</style>
