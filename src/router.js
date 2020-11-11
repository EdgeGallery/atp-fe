/*
 *  Copyright 2020 Huawei Technologies Co., Ltd.
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

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/atptestcase'
    },
    {
      path: '',
      component: () => import('./components/layout/Index.vue'),
      children: [
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
          path: 'atptestcase',
          name: 'atptestcase',
          component: () => import('./pages/myApp/ATPTestCase.vue')
        }
      ]
    }
  ]
})
