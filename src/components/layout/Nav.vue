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
    <Navcomp
      :scroll-top-prop="scrollTop"
      class="clearfix"
      @clickLogo="clickLogo"
      @changeLange="changeLanguage"
      @logout="logout"
      :if-guest-prop="ifGuest"
      :user-name-prop="userName"
      :user-center-page-prop="userCenterPage"
      @beforeLogout="beforeLogout"
      :json-data-prop="jsonData"
      :nav-menu-fontsize-prop="navMenuFontsize"
      :version-prop="version"
    />
  </div>
</template>

<script>
import {
  getUserInfo,
  logoutApi } from '../../tools/api.js'
import {
  PROXY_PREFIX_CURRENTSERVER,
  PLATFORMNAME_EG,
  PLATFORMNAME_APPSTORE,
  PLATFORMNAME_DEVELOPER } from '../../tools/constant.js'
import { common } from '../../tools/common.js'
import Navcomp from 'eg-view/src/components/EgNav.vue'
export default {
  name: 'HeaderComp',
  components: { Navcomp },
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
          id: '1',
          name: '首页',
          path: '/index',
          display: true
        },
        {
          id: '2',
          name: '测试模型',
          display: true,
          path: '/scenarios',
          children: [
            {
              name: '测试场景管理',
              path: '/scenarios',
              display: true,
              id: '2.1'
            }, {
              name: '测试套管理',
              path: '/suites',
              display: true,
              id: '2.2'
            }, {
              name: '测试用例管理',
              path: '/testcasemanage',
              display: true,
              id: '2.3'
            }
          ]
        },
        {
          name: '任务管理',
          path: '/tasklist',
          display: true,
          id: '3'
        },
        {
          name: '贡献管理',
          path: '/contributionlist',
          display: true,
          id: '4'
        },
        {
          name: '配置管理',
          path: '/configurationlist',
          display: true,
          id: '5'
        }
      ],
      navListEn: [
        {
          id: '1',
          name: 'Home',
          path: '/index',
          display: true
        },
        {
          name: 'Test Model',
          display: true,
          path: '/scenarios',
          id: '2',
          children: [
            {
              name: 'Scenarios Management',
              path: '/scenarios',
              display: true,
              id: '2.1'
            }, {
              name: 'Suites Management',
              path: '/suites',
              display: true,
              id: '2.2'
            }, {
              name: 'Case Management',
              path: '/testcasemanage',
              display: true,
              id: '2.3'
            }
          ]
        },
        {
          name: 'Task',
          path: '/tasklist',
          display: true,
          id: '3'
        },
        {
          name: 'Contribution Case',
          path: '/contributionlist',
          display: true,
          id: '4'
        },
        {
          name: 'Configuration',
          path: '/configurationlist',
          display: true,
          id: '5'
        }
      ],
      activeIndex: '/',
      fromPath: '',
      showUserInfo: false,
      wsSocketConn: null,
      wsMsgSendInterval: null,
      manualLoggout: false,
      scrollTop: 0,
      navMenuFontsize: 18,
      version: 'v1.5.1',
      jsonData: []
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
    clickLogo () {
      this.$router.push('/index')
    },
    changeLanguage (lan) {
      if (lan === 'cn') {
        this.jsonData = this.navList
        this.language = 'cn'
      } else if (lan === 'en') {
        this.jsonData = this.navListEn
        this.language = 'en'
      } else if (this.language === 'cn') {
        this.jsonData = this.navListEn
        this.language = 'en'
      } else {
        this.jsonData = this.navList
        this.language = 'cn'
      }
      localStorage.setItem('language', this.language)
      this.$i18n.locale = this.language
      this.$store.commit('changeLaguage', { language: this.language })
    },
    handleSelect (index, path, item) {
      if (index) {
        this.activeIndex = index
      }
    },
    logout () {
      this.manualLoggout = true
      logoutApi().then(res => {
        this.enterLoginPage()
      }).catch(error => {
        this.$message.error(error.message)
        this.enterLoginPage()
      })
    },
    enterLoginPage () {
      window.location.href = this.loginPage + '&return_to=' + window.location.origin + PROXY_PREFIX_CURRENTSERVER + '&lang=' + this.language
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
      window.open(this.userCenterPage + '?lang=' + this.language)
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
    },
    sendPageLoadedMsg (userId) {
      if (window.parent !== window) {
        let _possibleTopWinOriginUrlList = []
        if (PROXY_PREFIX_CURRENTSERVER) {
          _possibleTopWinOriginUrlList.push(window.location.origin)
        } else {
          _possibleTopWinOriginUrlList.push(common.getPlatformUrlPrefix(PLATFORMNAME_EG))
          _possibleTopWinOriginUrlList.push(common.getPlatformUrlPrefix(PLATFORMNAME_APPSTORE))
          _possibleTopWinOriginUrlList.push(common.getPlatformUrlPrefix(PLATFORMNAME_DEVELOPER))
        }
        _possibleTopWinOriginUrlList.forEach(_possibleTopWinOriginUrl => {
          window.top.postMessage({
            cmd: 'subpageLoaded',
            params: { userId }
          }, _possibleTopWinOriginUrl)
        })
      }
    },
    startHttpSessionInvalidListener (sessId) {
      if (typeof (WebSocket) === 'undefined') {
        return
      }
      let _wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
      this.wsSocketConn = new WebSocket(_wsProtocol + window.location.host + PROXY_PREFIX_CURRENTSERVER + '/wsserver/' + sessId)
      let _thisObj = this
      this.wsSocketConn.onmessage = function (msg) {
        clearTimeout(_thisObj.wsMsgSendInterval)
        _thisObj.wsMsgSendInterval = null
        if (_thisObj.manualLoggout) {
          return
        }
        let _hintInfo = _thisObj.$t('nav.hsInvalidHint')
        if (msg && msg.data) {
          if (msg.data === '1') {
            _hintInfo = _thisObj.$t('nav.hsInvalidHintForTimeout') + _hintInfo
          } else if (msg.data === '2') {
            _hintInfo = _thisObj.$t('nav.hsInvalidHintForLogout') + _hintInfo
          } else if (msg.data === '3') {
            _hintInfo = _thisObj.$t('nav.hsInvalidHintForServerStopped') + _hintInfo
          } else {
            _hintInfo = _thisObj.$t('nav.hsInvalidHintForTimeout') + _hintInfo
          }
        }
        if (_thisObj.ifGuest) {
          window.location.reload()
          return
        }
        _thisObj.$confirm(_hintInfo, _thisObj.$t('promptMessage.prompt'), {
          confirmButtonText: _thisObj.$t('nav.reLogin'),
          cancelButtonText: _thisObj.$t('nav.refresh'),
          type: 'warning'
        }).then(() => {
          _thisObj.logout()
        }).catch(() => {
          window.location.reload()
        })
      }
      this.wsMsgSendInterval = setInterval(() => {
        this.wsSocketConn.send('')
      }, 10000)
    }
  },
  beforeMount () {
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'cn')
    }
    let language = localStorage.getItem('language') || 'cn'
    this.$i18n.locale = language
    if (language === 'en') {
      this.jsonData = this.navListEn
    } else {
      this.jsonData = this.navList
    }
  },
  mounted () {
    this.activeIndex = this.$route.fullPath
    getUserInfo().then(res => {
      sessionStorage.setItem('userId', res.data.userId)
      sessionStorage.setItem('userName', res.data.userName)
      const authorities = res.data.authorities || []
      sessionStorage.setItem('authorities', authorities)
      this.userName = res.data.userName
      this.loginPage = res.data.loginPage
      this.userCenterPage = res.data.userCenterPage
      this.forceModifyPwPage = res.data.forceModifyPwPage
      this.ifGuest = res.data.userName === 'guest'
      if (this.jumpToForceModifyPw()) {
        return
      }
      if (res.data.authorities.indexOf('ROLE_ATP_ADMIN') === -1) {
        this.navList.splice(3, 1)
        this.navListEn.splice(3, 1)
      }
      let language = localStorage.getItem('language')
      if (language === 'en') {
        this.jsonData = this.navListEn
      } else {
        this.jsonData = this.navList
      }
      this.jsonData = this.navList
      this.startHttpSessionInvalidListener(res.data.sessId)
      this.sendPageLoadedMsg(res.data.userId)
    })
    let historyRoute = sessionStorage.getItem('historyRoute')
    if (historyRoute) {
      this.$router.push(historyRoute)
      sessionStorage.setItem('historyRoute', '')
    }
    // Switch language
    let lanIndex = window.location.href.search('language')
    if (lanIndex > 0) {
      let lang = window.location.href.substring(lanIndex + 9, lanIndex + 11)
      this.changeLanguage(lang)
    }
    // message listener, message from unified platform
    window.addEventListener('message', (event) => {
      var data = event.data
      console.log('handleMessage, message info: ' + JSON.stringify(data))
      if (data.cmd === 'iframeLanguageChange') {
        let lang = data.params.lang
        this.changeLanguage(lang)
      }
    })
  },
  beforeDestroy () {
    sessionStorage.setItem('historyRoute', this.$route.path)
    clearTimeout(this.wsMsgSendInterval)
    this.wsMsgSendInterval = null
  }
}
</script>
