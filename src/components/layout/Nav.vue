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
      <el-col
        :span="12"
        class="navList"
      >
        <el-menu
          @select="handleSelect"
          mode="horizontal"
          :unique-opened="true"
          router
          text-color="#fff"
          background-color="#282b33"
          active-text-color="#6c92fa"
          :default-active="activeIndex"
        >
          <template
            v-for="item in navList"
          >
            <el-submenu
              v-if="item.children && item.children.length"
              :index="item.route+ ''"
              :key="item.pageId"
            >
              <template
                slot="title"
              >
                {{ language === 'cn' ? item.labelCn : item.labelEn }}
              </template>
              <el-menu-item
                v-for="itemChild in item.children"
                :index="itemChild.route+ ''"
                :key="itemChild.pageId"
              >
                {{ language === 'cn' ? itemChild.labelCn : itemChild.labelEn }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              v-else
              :index="item.route"
              :key="item.pageId"
            >
              {{ language === 'cn' ? item.labelCn : item.labelEn }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <el-col
        :span="6"
      >
        <div class="nav-tabs rt">
          <span
            v-if="!ifGuest"
          >{{ userName }}</span>
          <span
            v-if="!ifGuest"
          >|</span>
          <span
            v-if="!ifGuest"
            class="curp"
            @click="openUserAccountCenter()"
          >{{ $t('nav.userAccountCenter') }}</span>
          <span
            v-if="!ifGuest"
          >|</span>
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
      language: localStorage.getItem('language') ? localStorage.getItem('language') : 'cn',
      userName: '',
      loginPage: '',
      userCenterPage: '',
      ifGuest: true,
      navList: [
        {
          labelEn: 'Home',
          labelCn: '首页',
          route: '/index',
          display: true,
          pageId: '1'
        },
        {
          labelEn: 'Model Management',
          labelCn: '测试模型管理',
          display: true,
          pageId: '2',
          children: [
            {
              labelEn: 'Scenarios Management',
              labelCn: '测试场景管理',
              route: '/scenarios',
              display: true,
              pageId: '2.1'
            }, {
              labelEn: 'Suites Management',
              labelCn: '测试套管理',
              route: '/suites',
              display: true,
              pageId: '2.2'
            }, {
              labelEn: 'Case Management',
              labelCn: '测试用例管理',
              route: '/testcasemanage',
              display: true,
              pageId: '2.3'
            }
          ]
        },
        {
          labelEn: 'Task Management',
          labelCn: '任务管理',
          route: '/tasklist',
          display: true,
          pageId: '3'
        }
      ],
      activeIndex: '',
      fromPath: ''
    }
  },
  computed: {
    getLanguage () {
      let language
      this.language === 'cn' ? language = 'English' : language = '中文'
      return language
    }
  },
  watch: {
    $route (to, from) {
      console.log(to.path)
      console.log(from.path)
      this.activeIndex = to.path
      this.fromPath = from.path
      // let path = this.$route.path
      // if (path === '/index') {
      //   this.isActive = 0
      // } else if (path === '/docs') {
      //   this.isActive = 1
      // } else if (path === '/myapp' || path === '/app/test/task' || path === '/atpreport' || path === '/myappdetail' || path === '/atpprocess' || path === '/atptestcase') {
      //   this.isActive = 2
      // } else if (path === '/about') {
      //   this.isActive = 0
      // } else if (path === '/apppromote' || path === '/apppromotion' || path === '/msgCenter' || path === '/right_panel' || path === 'app/prom/task') {
      //   this.isActive = 4
      // } else {
      //   this.isActive = 0
      // }
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
    handleSelect (index, path, item) {
      if (index) {
        this.activeIndex = index
        this.$router.push(this.activeIndex)
      }
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
    },
    openUserAccountCenter () {
      window.open(this.userCenterPage)
    }
  },
  mounted () {
    // console.log('mounted')
    // localStorage.setItem('language', 'cn')
    // let path = this.$route.path
    // if (path === '/index') {
    //   this.currentUrl = '/index'
    // } else if (path === '/testcasemanage') {
    //   this.currentUrl = '/testcasemanage'
    // } else if (path === '/tasklist') {
    //   this.currentUrl = '/tasklist'
    // }
    getUserInfo().then(res => {
      sessionStorage.setItem('userId', res.data.userId)
      sessionStorage.setItem('userName', res.data.userName)
      this.userName = res.data.userName
      this.loginPage = res.data.loginPage
      this.userCenterPage = res.data.userCenterPage
      if (res.data.userName === 'guest') {
        this.ifGuest = true
      } else {
        this.ifGuest = false
      }
    })
    let historyRoute = sessionStorage.getItem('historyRoute')
    if (historyRoute) {
      this.$router.push(historyRoute)
      sessionStorage.setItem('historyRoute', '')
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
    .navList {
      .el-menu--horizontal {
        border: none;
      }
      .el-menu--horizontal>.el-menu-item {
        height: 65px;
        line-height: 65px;
        font-size: 18px;
        font-weight: 700;
        margin-right: 0px;
        font-family: Microsoft YaHei;
        vertical-align: bottom;
      }
      .el-submenu__title {
        font-size: 18px;
        font-weight: 700;
        font-family: Microsoft YaHei;
      }
      .el-menu--horizontal>.el-submenu .el-submenu__title {
        height: 65px;
        line-height: 65px;
      }
    }
  // .navList{
  //   span {
  //     font-size: 18px;
  //     font-weight: 700;
  //     line-height: 65px;
  //     margin: 0 20px;
  //     padding-bottom: 17px;
  //     vertical-align: bottom;
  //   }
  //   span:hover {
  //     color: #6c92fa;
  //     border-bottom: 2px solid #6c92fa;
  //   }
  //   .active {
  //     color: #6c92fa;
  //     border-bottom: 2px solid #6c92fa;
  //   }
  // }
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
