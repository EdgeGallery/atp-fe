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

import {
  getCookie, GET, POST, DELETE, PUT
} from './request.js'

import axios from 'axios'

const URL_PREFIX = '/mec-atp/edgegallery/atp/v1/'

function getUserInfo () {
  let url = '/auth/login-info'
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: url,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    }).then(res => {
      resolve(res)
    }, (error) => {
      reject(error)
    })
  })
}

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
let Home = {
  // 获取首页图表数据
  getStatisticApi: function () {
    let url = 'tasks/action/analysize'
    return GET(url)
  }
}

let ModelMgmt = {
  // 查询测试套
  getTestSuite: function (params) {
    let url = 'testsuites'
    return GET(url, params)
  },
  getTestSuiteApi: function (id) {
    let url = 'testsuites/' + id
    return GET(url)
  },
  // 查询一个测试套
  getOneSuite: function (Id) {
    let url = 'testsuites/' + Id
    return GET(url)
  },
  deleteTestSuite: function (id) {
    let url = 'testsuites/' + id
    return DELETE(url)
  },
  deleteTestScenarioApi: function (id) {
    let url = 'testscenarios/' + id
    return DELETE(url)
  },
  createTestSuiteApi: function (params) {
    let url = 'testsuites'
    return POST(url, params)
  },
  editTestSuiteApi: function (params, id) {
    let url = 'testsuites/' + id
    return PUT(url, params)
  },
  editTestScenarioApi: function (params, id) {
    let url = 'testscenarios/' + id
    return PUT(url, params)
  },
  createTestScenarioApi: function (params) {
    let url = 'testscenarios'
    return POST(url, params)
  }
}

let Taskmgmt = {
  // 获取任务列表
  taskListApi: function (params) {
    let url = 'tasks'
    return GET(url, params)
  },
  // 批量删除任务
  deleteTaskApi: function (params) {
    let url = 'tasks/batch_delete'
    return POST(url, params)
  }
}
// 用户面所有接口
let Userpage = {
  // 获取所有场景
  getAllSceneApi: function (params) {
    let url = 'testscenarios'
    return GET(url, params)
  },
  // 获取场景图标
  getSceneIconApi: function (appId) {
    let url = 'apps/' + appId
    return GET(url)
  },
  // 获取场景下的用例
  getSceneCaseApi: function (params) {
    let url = 'testscenarios/testcases'
    return POST(url, params)
  },
  // 运行任务
  runTaskApi: function (taskId, params) {
    let url = 'tasks/' + taskId + '/action/run'
    return POST(url, params)
  },
  // 获取任务
  getTaskApi: function (taskId) {
    let url = 'tasks/' + taskId
    return GET(url)
  },
  modifyStatusApi: function (taskId, params) {
    let url = 'tasks/' + taskId + '/testcase'
    return PUT(url, params)
  },
  contributionApi: function (params) {
    let url = 'contributions'
    return POST(url, params)
  }
}

// 以前的接口
let Atp = {
  // new 获取所有用例
  getAllCaseApi: function (params) {
    let url = 'testcases'
    return GET(url, params)
  },
  // 创建测试用例
  createCaseApi: function (params) {
    let url = 'testcases'
    return POST(url, params)
  },
  editCaseApi: function (params) {
    let url = 'testcases'
    return PUT(url, params)
  },
  deleteCaseApi: function (Id) {
    let url = 'testcases/' + Id
    return DELETE(url)
  },
  // 获取测试用例列表
  getTestCaseApi: function () {
    let url = 'mec-atp/edgegallery/atp/v1/testcases'
    return axios.get(url, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
  },
  // 预检查接口（返回依赖）
  getDependencyApi: function (taskId) {
    let url = 'tasks/' + taskId + '/action/pre-check'
    return GET(url)
  },
  // 创建测试任务
  creatTaskApi: function (params) {
    let url = 'mec-atp/edgegallery/atp/v1/tasks'
    return axios.post(url, params, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
  },
  // 运行任务
  runTaskApi: function (taskId) {
    let url = 'mec-atp/edgegallery/atp/v1/tasks/' + taskId + '/action/run'
    return axios.post(url, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
  },
  // 获取进展
  processApi: function (taskId) {
    let url = 'mec-atp/edgegallery/atp/v1/tasks/' + taskId
    return axios.get(url, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
  },
  // 获取任务列表
  taskListApi: function (params) {
    let url = 'mec-atp/edgegallery/atp/v1/tasks'
    return axios.get(url, {
      params: params,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
  },
  // 下载
  downLoadCaseApi: function (Id, codeLanguage) {
    let url = 'mec-atp/edgegallery/atp/v1/testcases/' + Id + '/action/download'
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
      link.setAttribute('download', Id + '.' + codeLanguage)
      document.body.appendChild(link)
      link.click()
    })
  }
}

export {
  URL_PREFIX,
  getUserInfo,
  logoutApi,
  Atp,
  ModelMgmt,
  Home, Taskmgmt, Userpage
}
