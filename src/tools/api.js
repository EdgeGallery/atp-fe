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

import {
  getCookie
} from './request.js'

// import './mock.js'
import axios from 'axios'

// const URL_PREFIX = '/mec-appstore/mec/appstore/v1/'

// const TEST_URL_PREFIX = '/mec-developer/'

// function getUserInfo () {
//   let url = '/auth/login-info'
//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'GET',
//       url: url,
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//         'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
//       }
//     }).then(res => {
//       resolve(res)
//     }, (error) => {
//       reject(error)
//     })
//   })
// }

function logoutApi () {
  return axios({
    method: 'POST',
    url: '/logout',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
    }
  })
}

// mockAPI任务列表
// function testAppList () {
//   let url = '/mock/testapp/app'
//   return axios.get(url)
// }

let Atp = {
  // 获取测试用例列表
  getTestCaseApi: function () {
    let url = 'edgegallery/atp/v1/testcases'
    return axios.get(url)
  },
  // 解析依赖信息
  getDependencyApi: function (params) {
    let url = 'edgegallery/atp/v1/common-action/analysis-app'
    return axios.post(url, params)
  },
  // 创建任务
  creatTaskApi: function (params) {
    let url = 'edgegallery/atp/v1/tasks'
    return axios.post(url, params)
  },
  // 获取任务，获取进展
  processApi: function (taskId) {
    let url = 'edgegallery/atp/v1/tasks/' + taskId
    return axios.get(url)
  },
  // 获取任务列表
  taskListApp: function (params) {
    let url = 'edgegallery/atp/v1/tasks'
    return axios.get(url, params)
  },
  // 下载报告
  downLoadReportApi: function (taskId) {
    let url = 'edgegallery/atp/v1/tasks/' + taskId + '/action/download'
    return axios({
      method: 'get',
      url: url,
      responseType: 'blob'
    }).then((res) => {
      if (!res) {
        return
      }
      let objectUrl = window.URL.createObjectURL(res.data)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = objectUrl
      link.setAttribute('download', taskId + '.yaml')
      document.body.appendChild(link)
      link.click()
    })
  }
}

export {
  // URL_PREFIX,
  // TEST_URL_PREFIX,
  // getUserInfo,
  logoutApi,
  // testAppList,
  Atp
}
