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
  <div>
    <navcomp />
    <div class="topImage">
      <div class="bannerLeft">
        <h2>{{ $t('home.bannerTitle') }}</h2>
        <p>{{ $t('home.bannerText1') }}</p>
        <p>{{ $t('home.bannerText2') }}</p>
        <p>{{ $t('home.bannerText3') }}</p>
      </div>
      <div class="bannerRight">
        <img
          src="../../assets/images/atpindex.png"
          alt=""
        >
      </div>
    </div>
    <div class="mainreport">
      <div class="title">
        <span>{{ $t('home.staReport') }}</span>
      </div>
      <div class="statisticdata">
        <div class="left">
          <p>{{ $t('home.totalNum') }}</p>
          <p style="margin-top:5px;">
            {{ total }}
          </p>
        </div>
        <div class="right">
          <span>{{ $t('home.chartTitle') }}</span>
          <div
            id="main"
          />
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
      total: ''
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
        console.log(this.chartData)
        this.drawLine()
      }).catch(() => {
      })
    },
    getLastSixMon () {
      let date = new Date()
      let year = date.getFullYear()
      let mon = date.getMonth() + 1
      let arr = []
      for (let i = 0; i < 6; i++) {
        if (mon <= 0) {
          year = year - 1
          mon = mon + 12
        }
        if (mon < 10) {
          mon = '0' + mon
        }
        arr[i] = year + '-' + mon
        mon = mon - 1
      }
      this.monthData = arr.reverse()
      console.log(this.monthData)
    },
    drawLine () {
      console.log('draw')
      let myChart = this.$echarts.init(document.getElementById('main'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // data: ['2020-08', '2020-09', '2020-10', '2020-11', '2020-12', '2021-01'],
            data: this.monthData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [{
          type: 'bar',
          barWidth: '30%',
          // data: [75, 81, 70, 82, 99, 19]
          data: this.chartData,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: 'black',
                  fontSize: 16
                }
              }
            }
          }
        }]
      }
      myChart.setOption(option)
    }
  },
  mounted () {
    this.getLastSixMon()
    this.getStatisticData()
    // this.drawLine()
  }
}
</script>

<style lang='less'>
.topImage{
  background-color: #262F47;
  display: flex;
  justify-content: space-around;
  height: 300px;
  .bannerLeft{
    margin-left: -100px;
    color: #fff;
    h2{
      font-size: 30px;
      margin-top: 50px;
      margin-bottom: 30px;
      font-weight: 500;
    }
    p{
      font-size: 14px;
      margin: 10px 15px;
    }
  }
  .bannerRight{
    margin:-20px -100px 0 -20px;
    img{
      height: 300px;
    }
  }
}
.mainreport{
  background-color: white;
  .title{
    font-size: 22px;
    font-weight: 500;
    padding: 15px 10px;
  }
  .statisticdata{
    display: flex;
    justify-content: space-between;
    height: 500px;
    margin:10px 30px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    .left{
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-position: center;
      background-repeat: no-repeat;
      background-color: #50abe6;
      position: relative;
      top: 100px;
      left: 50px;
      p{
        position: relative;
        top: 50px;
        text-align: center;
        font-size: 18px;
        color: #fff;
      }
      .leftnum{
        text-align: center;
        color: #fff;
        position: relative;
        top: 80px;
      }
    }
    .right{
      margin-top: 10px;
      width: 80%;
    }
    #main{
      height: 400px;
    }
  }
}
</style>
