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
  <div id="headerComp">
    <el-row>
      <el-col
        :span="6"
      >
        <div class="logo">
          <img
            src="../../assets/images/logo.png"
            class="curp"
            @click="jumpTo('/index')"
            alt
          >
        </div>
      </el-col>
      <el-col :span="12">
        <div class="navList curp">
          <span
            @click="jumpTo('/index')"
            :class="currentUrl==='/index' ? 'active' : ''"
          >首页</span>
          <span
            @click="jumpTo('/testcasemanage')"
            :class="currentUrl==='/testcasemanage' ? 'active' : ''"
          >测试用例管理</span>
          <span
            @click="jumpTo('/tasklist')"
            :class="currentUrl==='/tasklist' ? 'active' : ''"
          >任务管理</span>
        </div>
      </el-col>
      <el-col
        :span="6"
      >
        <div class="nav-tabs rt">
          <span
            class="curp"
            @click="logout()"
            v-if="ifGuest"
          >{{ $t('nav.login') }}</span>
          <span
            class="curp"
            @click="beforeLogout"
            v-else
          >{{ $t('nav.logout') }}</span>
          <span
            @click="changeLanguage"
            class="curp"
          >
            {{ getLanguage }}
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getUserInfo,
  logoutApi } from '../../tools/api.js'
// import axios from 'axios'
export default {
  name: 'HeaderComp',
  data () {
    return {
      currentUrl: '/index',
      language: 'cn',
      userName: '',
      loginPage: '',
      ifGuest: true
    }
  },
  computed: {
    getLanguage () {
      let language
      this.language === 'cn' ? language = 'English' : language = '中文'
      return language
    }
  },
  methods: {
    jumpTo (newPath) {
      this.$router.push(newPath)
    },
    changeLanguage () {
      if (this.language === 'cn') {
        this.language = 'en'
      } else {
        this.language = 'cn'
      }
      localStorage.setItem('language', this.language)
      this.$i18n.locale = this.language
      this.$store.commit('changeLaguage', { language: this.language })
    },
    logout () {
      logoutApi().then(res => {
        window.location.href = this.loginPage + '&return_to=' + 'https://' + window.location.host
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    beforeLogout () {
      this.$confirm(this.$t('promptMessage.confirmLogout'), this.$t('promptMessage.prompt'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.logout()
      }).catch(() => {
      })
    }
  },
  mounted () {
    let path = this.$route.path
    if (path === '/index') {
      this.currentUrl = '/index'
    } else if (path === '/testcasemanage') {
      this.currentUrl = '/testcasemanage'
    } else if (path === '/tasklist') {
      this.currentUrl = '/tasklist'
    }
    localStorage.setItem('language', 'cn')
    getUserInfo().then(res => {
      sessionStorage.setItem('userId', res.data.userId)
      sessionStorage.setItem('userName', res.data.userName)
      this.loginPage = res.data.loginPage
      if (res.data.userName === 'guest') {
        this.ifGuest = true
      } else {
        this.ifGuest = false
      }
    })
    sessionStorage.setItem('userId', '58bbeb8d-c020-46e5-bab9-7d4bc9e875b8')
    sessionStorage.setItem('userName', 'baizhenzhen')
    let historyRoute = sessionStorage.getItem('historyRoute')
    if (historyRoute) {
      this.$router.push(historyRoute)
      sessionStorage.setItem('historyRoute', '')
    }
  },
  watch: {
    $route (to, from) {
      let path = this.$route.path
      console.log(path)
      if (path === '/index') {
        this.currentUrl = '/index'
      } else if (path === '/testcasemanage') {
        this.currentUrl = '/testcasemanage'
      } else if (path === '/tasklist') {
        this.currentUrl = '/tasklist'
      }
      console.log(this.currentUrl)
    }
  },
  beforeDestroy () {
    sessionStorage.setItem('historyRoute', this.$route.path)
  }
}
</script>

<style lang='less' >
#headerComp {
  height: 65px;
  color: white;
  background: #282b33;
  padding-left: 25px;
  top: 0px;
  width: 100%;
  z-index: 2;
  .logo {
    height: 65px;
    line-height: 65px;
    img {
      height: 65px;
    }
    span {
      font-size: 18px;
      vertical-align: text-bottom;
    }
  }
  .navList{
    span {
      font-size: 18px;
      font-weight: 700;
      line-height: 65px;
      margin: 0 20px;
      padding-bottom: 17px;
      vertical-align: bottom;
    }
    span:hover {
      color: #6c92fa;
      border-bottom: 2px solid #6c92fa;
    }
    .active {
      color: #6c92fa;
      border-bottom: 2px solid #6c92fa;
    }
  }
  .nav-tabs {
    padding-right: 20px;
    height: 65px;
    line-height: 65px;
    float: right;
    box-sizing: border-box;
    span{
      padding: 0 10px;
    }
  }
  @media only screen and (max-width: 991px){
    .logo{
      img{
      height: 50px;
      margin: 5px 0 0 0;
    }
      span{
        font-size: 14px;
        margin: 5px 0 0 0;
      }
    }
  }
}
</style>
