/*
 *  Copyright 2020-2021 Huawei Technologies Co., Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Vue from 'vue'
import Router from 'vue-router'
import en from './locales/en.js'
import cn from './locales/cn.js'

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)

const currUrl = window.location.href
const iframeUrl = currUrl.split('#')[1]

export default new Router({
  routes: [
    {
      path: '/',
      redirect: currUrl.indexOf('language') !== -1 ? iframeUrl : '/index'
    },
    {
      path: '',
      component: () => import('./components/layout/Index.vue'),
      children: [
        {
          path: 'index',
          name: 'home',
          component: () => import('./pages/home/Home.vue')
        },
        {
          path: 'scenarios',
          name: 'scenarios',
          component: () => import('./pages/ModelMgmt/ScenariosManage.vue'),
          meta: {
            breadcrumb: [{
              nameEn: en.testCase.testScenarioManagement,
              path: '/scenarios',
              nameCn: cn.testCase.testScenarioManagement
            }]
          }
        },
        {
          path: 'suites',
          name: 'suites',
          component: () => import('./pages/ModelMgmt/SuitesManage.vue'),
          meta: {
            breadcrumb: [{
              nameEn: en.testCase.testSuiteManagement,
              path: '/suites',
              nameCn: cn.testCase.testSuiteManagement
            }]
          }
        },
        {
          path: 'testcasemanage',
          name: 'testcasemanage',
          component: () => import('./pages/ModelMgmt/TestCaseManage.vue'),
          meta: {
            breadcrumb: [{
              nameEn: en.testCase.management,
              path: '/testcasemanage',
              nameCn: cn.testCase.management
            }]
          }
        },
        {
          path: 'tasklist',
          name: 'tasklist',
          component: () => import('./pages/home/TaskList.vue'),
          meta: {
            breadcrumb: [{
              nameEn: en.atp.taskManage,
              path: '/tasklist',
              nameCn: cn.atp.taskManage
            }]
          }
        },
        {
          path: 'contributionList',
          name: 'contributionList',
          component: () => import('./pages/home/ContributionList.vue'),
          meta: {
            breadcrumb: [{
              nameEn: en.nav.contributionMgmt,
              path: '/testcasemanage',
              nameCn: cn.nav.contributionMgmt
            }]
          }
        },
        {
          path: 'configurationlist',
          name: 'configurationlist',
          component: () => import('./pages/home/Configuration.vue'),
          meta: {
            breadcrumb: [{
              nameEn: en.nav.contributionMgmt,
              path: '/testcasemanage',
              nameCn: cn.nav.contributionMgmt
            }]
          }
        },
        {
          path: 'app/test/task',
          name: 'apttask',
          component: () => import('./pages/myApp/ATPTask.vue')
        },
        {
          path: 'atpreport',
          name: 'atpreport',
          component: () => import('./pages/myApp/ATPReport.vue')
        },
        {
          path: 'atpprocess',
          name: 'atpprocess',
          component: () => import('./pages/myApp/ATPProcess.vue')
        },
        {
          path: 'testprocess',
          name: 'testprocess',
          component: () => import('./pages/myApp/testProcess.vue')
        },
        {
          path: 'selectscene',
          name: 'selectscene',
          component: () => import('./pages/myApp/TestScenarios.vue')
        },
        {
          path: 'allscene',
          name: 'allscene',
          component: () => import('./pages/myApp/selectScenarios.vue')
        }
      ]
    }
  ]
})
