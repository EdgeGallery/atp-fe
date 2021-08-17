<!--
  -  Copyright 2020-2021 Huawei Technologies Co., Ltd.
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
        :span="2"
      >
        <div class="logo">
          <img
            src="../../assets/images/logonav.png"
            class="curp"
            @click="jumpTo('/index')"
            alt
          >
        </div>
      </el-col>
      <el-col
        :span="18"
      >
        <div class="navList">
          <el-menu
            :unique-opened="true"
            router
            :default-active="activeIndex"
            @select="handleSelect"
            text-color="#bdb1e4"
            background-color="#5e40c8"
            active-text-color="#fff"
            mode="horizontal"
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
        </div>
      </el-col>
      <el-col
        :span="4"
      >
        <div class="user_right flex">
          <div
            class="user_icon"
            v-if="ifGuest"
          >
            <img
              src="../../assets/images/nav_user.png"
              alt=""
              title="登录"
              @click="logout()"
            >
          </div>
          <div
            class="nav-tabs"
            v-if="!ifGuest"
          >
            <div
              class="userName"
              @mouseenter="showUserInfo=true"
              @mouseleave="showUserInfo=false"
            >
              {{ userName }}
              <el-collapse-transition>
                <div
                  class="user_info"
                  v-show="showUserInfo"
                >
                  <span
                    class="userAccountCenter"
                    @click="openUserAccountCenter()"
                  >{{ $t('nav.userAccountCenter') }}</span>
                  <span
                    @click="beforeLogout()"
                  >{{ $t('nav.logout') }}</span>
                </div>
              </el-collapse-transition>
            </div>
          </div>
          <div
            class="curp"
            @click="changeLanguage"
          >
            <img
              src="../../assets/images/nav_en.png"
              alt=""
              v-if="language==='cn'"
            >
            <img
              src="../../assets/images/nav_cn.png"
              alt=""
              v-else
            >
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getUserInfo,
  logoutApi } from '../../tools/api.js'
export default {
  name: 'HeaderComp',
  data () {
    return {
      language: localStorage.getItem('language'),
      userName: '',
      loginPage: '',
      userCenterPage: '',
      forceModifyPwPage: '',
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
          labelEn: 'Test Model',
          labelCn: '测试模型',
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
          labelEn: 'Task',
          labelCn: '任务管理',
          route: '/tasklist',
          display: true,
          pageId: '3'
        },
        {
          labelEn: 'Contribution Case',
          labelCn: '贡献管理',
          route: '/contributionlist',
          display: true,
          pageId: '4'
        },
        {
          labelEn: 'Configuration',
          labelCn: '配置管理',
          route: '/configurationlist',
          display: true,
          pageId: '5'
        }
      ],
      activeIndex: '/',
      fromPath: '',
      showUserInfo: false
    }
  },
  watch: {
    $route (to, from) {
      this.activeIndex = to.path
      let path = this.$route.path
      if (path === '/index') {
        this.activeIndex = '/index'
      } else if (path === '/tasklist') {
        this.activeIndex = '/tasklist'
      } else if (path === '/scenarios' || path === '/suites' || path === '/testcasemanage') {
        this.activeIndex = '/scenarios'
      }
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
        // this.$router.push(this.activeIndex)
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
      })
    },
    openUserAccountCenter () {
      window.open(this.userCenterPage)
    },
    jumpToForceModifyPw () {
      if (this.ifGuest) {
        return false
      }
      if (this.forceModifyPwPage) {
        window.location.href = this.forceModifyPwPage
        return true
      }

      return false
    }
  },
  mounted () {
    this.activeIndex = this.$route.fullPath
    getUserInfo().then(res => {
      sessionStorage.setItem('userId', res.data.userId)
      sessionStorage.setItem('userName', res.data.userName)
      sessionStorage.setItem('authorities', res.data.authorities)
      this.userName = res.data.userName
      this.loginPage = res.data.loginPage
      this.userCenterPage = res.data.userCenterPage
      this.forceModifyPwPage = res.data.forceModifyPwPage
      this.ifGuest = res.data.userName === 'guest'
      if (this.jumpToForceModifyPw()) {
        return
      }
      if (res.data.authorities.indexOf('ROLE_ATP_ADMIN') === -1) {
        this.navList.splice(3, 2)
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
  color: #fff;
  padding: 0 13%;
  background-color: #5e40c8;
  top: 0px;
  width: 100%;
  z-index: 2;
  .logo {
    height: 65px;
    line-height: 65px;
    text-align: left;
    img {
      width: 100%;
      margin-top: 20px;
    }
    span {
      font-size: 18px;
      vertical-align: text-bottom;
    }
  }
    .navList {
      text-align: center;
      .el-menu--horizontal {
        border: none;
      }
      .el-menu--horizontal>.el-menu-item {
        height: 65px;
        line-height: 65px;
        font-size: 16px;
        margin-right: 0px;
        vertical-align: bottom;
      }
      .el-submenu__title {
        font-size: 16px;
      }
      .el-menu--horizontal>.el-submenu .el-submenu__title {
        height: 65px;
        line-height: 65px;
      }
    }
    .user_right{
      float: right;
      color: #fff;
      height: 26px;
      line-height: 26px;
      margin-top: 20px;
      .user_icon{
        margin: 0 20px;
        cursor: pointer;
      }
      .userName{
        position: relative;
        cursor: pointer;
        margin:0 20px;
      }
      .user_info{
        background: #6319c2;
        position: absolute;
        width: 90px;
        padding-bottom: 2px;
        border-radius: 6px;
        top: 30px;
        z-index: 100;
        span{
          display: inline-block;
          width: 100%;
          height: 44px;
          line-height: 44px;
          font-size: 14px;
          background: #3b0b7a;
          border-radius: 6px;
          margin-top: 2px;
          text-align: center;
          color: #acacac;
        }
        span:hover{
          background: #2b0064;
          color: #fff;
        }
      }
  }
}
</style>
