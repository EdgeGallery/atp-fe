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
            数据统计
          </p>
          <p
            class="leftdetail"
          >
            近六个月扫描统计数据
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
      <span class="modeltitle">测试模型管理</span>
      <div class="modeldetail">
        <ul class="modelcontent">
          <li>
            <img
              src="../../assets/images/ScenarioManage.png"
              alt=""
            >
            <p class="keyword">
              测试场景管理
            </p>
            <p class="font">
              测试场景是测试的最大单元集，一个测试场景可以包含多个测试套
            </p>
          </li>
          <li>
            <img
              src="../../assets/images/SuiteManage.png"
              alt=""
            >
            <p class="keyword">
              测试套管理
            </p>
            <p class="font">
              测试套是测试类型的分类，一个测试套可以属于一个或者多个测试场景，一个测试套可以包含多个测试用例
            </p>
          </li>
          <li>
            <img
              src="../../assets/images/TestCaseManage.png"
              alt=""
            >
            <p class="keyword">
              测试用例管理
            </p>
            <p class="font">
              测试用例是测试的最小执行单元，一个测试用例可以属于一个或者多个测试套
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div class="friendlink">
        <div class="linktext">
          <ul>
            <li>
              <p>关于Edge-Gallery</p>
              <p>能力访问</p>
            </li>
            <li>
              <p>交流与咨询</p>
              <p>论坛</p>
              <p>博客</p>
              <p>新闻资讯</p>
            </li>
            <li>
              <p>友情链接</p>
              <p>华为官网</p>
              <p>华为计算</p>
              <p>华为云</p>
            </li>
          </ul>
        </div>
        <div>
          <p class="followus">
            关注我们
          </p>
          <p>
            <img
              src="../../assets/images/wechaticon.png"
              alt=""
            >
            <img
              src="../../assets/images/QQicon.png"
              alt=""
            >
            <img
              src="../../assets/images/weiboicon.png"
              alt=""
            >
          </p>
        </div>
      </div>
      <div class="footer">
        <div>
          <p style="font-size:14px;">
            @2021 Huaweicloud.com 版权所有苏ICP备17040376号-32苏B2-20130048号 代理域名注册服务机构:新网
          </p>
          <p style="font-size:12px;">
            苏公网安备012011010101号
          </p>
        </div>
        <div>
          <span>法律声明</span>
          <span>|</span>
          <span>隐私政策</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navcomp from '../../components/layout/Nav.vue'
import { Home } from '../../tools/api.js'
export default {
  components: { Navcomp },
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
        // textStyle: {
        //   fontStyle: 'light'
        // },
        grid: {
          x: 50,
          y: 20,
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
            show: false
          },
          offset: 10,
          axisLabel: {
            fontSize: 24,
            color: '#ffffff',
            fontWeight: 'lighter'
          }
        },
        yAxis: {
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
              type: 'dashed'
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
            type: 'solid',
            opacity: 0.6
          },
          emphasis: {
            lineStyle: {
              opacity: 1
            }
          },
          itemStyle: {
            borderWidth: 4,
            borderColor: '#543b94',
            color: '#ffffff'
          }
        }]
      }
      myChart.setOption(option)
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
    // justify-content: space-between;
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
        // justify-content: center;
        padding-top: 50px;
        li{
          // float: left;
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
            height: 30px;
            line-height: 30px;
            width: 240px;
          }
        }
      }
    }
  }
  .friendlink{
    display: flex;
    justify-content: space-around;
    height: 224px;
    background-color: #380879;
    padding-top: 45px;
    .linktext{
      color: #fff;
      font-size: 12px;
      ul{
        display: flex;
        p:first-child{
          font-size: 16px;
          padding: 0 50px 10px;
        }
        p:not(:first-child) {
          padding: 10px 50px;
        }
      }
    }
    .followus{
      color: #fff;
      font-size: 16px;
      padding-left: 15px;
    }
    img{
      margin: 15px 15px 0;
    }
  }
  .footer{
    height: 80px;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    p{
      color: #000000;
      padding: 5px 0;
    }
    span{
      font-size: 14px ;
      padding: 0 5px;
    }
  }
</style>
