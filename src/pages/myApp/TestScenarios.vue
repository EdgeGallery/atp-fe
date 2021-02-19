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
  <div class="padding56">
    <div class="selectscene padding20">
      <div class="toptitle">
        <div class="left">
          {{ $t('userpage.selectScene') }}
        </div>
        <div class="right">
          <img
            src="../../assets/images/chenggong.png"
            alt=""
            class="rt"
          >
          <span> {{ $t('userpage.contribution') }}</span>
        </div>
      </div>
      <div class="scene-main">
        <div class="scene">
          <div>
            <img
              src="../../assets/images/logo.png"
              alt=""
              class="sceneimage"
            >
          </div>
          <div class="choose">
            <h4>社区场景</h4>
            <img
              src="../../assets/images/chenggong.png"
              alt=""
            >
          </div>
        </div>
        <div class="scene">
          <div>
            <img
              src="../../assets/images/logo.png"
              alt=""
              class="sceneimage"
            >
          </div>
          <div class="choose">
            <h4>社区场景</h4>
            <img
              src="../../assets/images/shibai.png"
              alt=""
            >
          </div>
        </div>
        <div class="scene">
          <div>
            <img
              src="../../assets/images/logo.png"
              alt=""
              class="sceneimage"
            >
          </div>
          <div class="choose">
            <h4>社区场景</h4>
            <img
              src="../../assets/images/shibai.png"
              alt=""
            >
          </div>
        </div>
        <div class="scene">
          <div>
            <img
              src="../../assets/images/logo.png"
              alt=""
              class="sceneimage"
            >
          </div>
          <div class="choose">
            <h4>社区场景</h4>
            <img
              src="../../assets/images/shibai.png"
              alt=""
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Userpage } from '../../tools/api.js'
export default {
  data () {
    return {

    }
  },
  methods: {
    getAllScene () {
      Userpage.getAllSceneApi().then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>
<style lang="less">
.selectscene{
  background-color: white;
  .toptitle{
    background-color: #babbdc;
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin-bottom: 10px;
    .left{
      line-height: 46px;
    }
    .right{
      // height: 50px;
      display: flex;
      flex-direction: column;
      img{
        width: 30px;
        height: 30px;
        text-align: center;
      }
      span{
        font-size: 12px;
      }
    }
  }
  .scene-main{
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    .scene{
      width: 33%;
      height: 200px;
      border: 1px solid #d7dce6;
      border-radius: 10px;
      margin: 0 5px 10px;
      .sceneimage{
        width: 100%;
        height: 150px;
      }
      .choose{
        display: flex;
        justify-content: space-between;
        line-height: 30px;
        img{
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>
