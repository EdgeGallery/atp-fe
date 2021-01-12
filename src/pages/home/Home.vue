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
      <div class="left">
        <h2>应用测试认证平台</h2>
        <p>适配多企业标准用例集</p>
        <p>低门槛测试用例编写</p>
        <p>测试过程可视化</p>
      </div>
      <div class="right">
        <img
          src="../../assets/images/atpindex.png"
          alt=""
        >
      </div>
    </div>
    <div class="mainreport">
      <div class="title">
        <span>统计报告</span>
      </div>
      <div class="statisticdata">
        <div class="left" />
        <div class="mychart">
          <span>过去六个月扫描统计数据</span>
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
export default {
  components: { Navcomp },
  name: '',
  data () {
    return {
    }
  },
  methods: {
    drawLine () {
      let myChart = this.$echarts.init(document.getElementById('main'))
      // const myChart = this.$echarts.init(this.$refs.myCharts)
      // 绘制图表
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
            data: ['2020-08', '2020-09', '2020-10', '2020-11', '2020-12', '2020-01'],
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
        series: [
          {
            type: 'bar',
            barWidth: '30%',
            data: [75, 81, 70, 82, 99, 19]
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  mounted () {
    this.drawLine()
  }
}
</script>

<style lang='less'>
.topImage{
  background-color: #262F47;
  display: flex;
  justify-content: space-around;
  height: 300px;
  .left{
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
  .right{
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
      background: url('../../assets/images/sumnumber.png');
      position: relative;
      top: 100px;
      left: 50px;
      .leftnum{
        text-align: center;
        color: #fff;
        position: relative;
        top: 80px;
      }
    }
    .mychart{
      width: 80%;
    }
    #main{
      height: 400px;
    }
  }
}
</style>
