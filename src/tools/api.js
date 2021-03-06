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
  getStatisticApi: function () {
    let url = 'tasks/action/analysize'
    return GET(url)
  }
}

let ModelMgmt = {
  getTestSuite: function (params) {
    let url = 'testsuites'
    return GET(url, params)
  },
  getTestSuiteApi: function (id) {
    let url = 'testsuites/' + id
    return GET(url)
  },
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
  },
  importTestModelApi: function (params) {
    let url = 'testmodels/action/import'
    return POST(url, params)
  }
}

let Taskmgmt = {
  taskListApi: function (params) {
    let url = 'tasks'
    return GET(url, params)
  },
  // Batch delete tasks
  deleteTaskApi: function (params) {
    let url = 'tasks/batch_delete'
    return POST(url, params)
  },
  contributionsApi: function (params) {
    let url = 'contributions'
    return GET(url, params)
  },
  deleteCaseApi: function (params) {
    let url = 'contributions/batch_delete'
    return POST(url, params)
  },
  downLoadCaseApi: function (Id) {
    let url = 'mec-atp/edgegallery/atp/v1/contributions/' + Id + '/action/download'
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
      link.setAttribute('download', Id + '.' + 'zip')
      document.body.appendChild(link)
      link.click()
    })
  }
}
let Userpage = {
  getAllSceneApi: function (params) {
    let url = 'testscenarios'
    return GET(url, params)
  },
  getSceneIconApi: function (appId) {
    let url = 'apps/' + appId
    return GET(url)
  },
  getSceneCaseApi: function (params) {
    let url = 'testscenarios/testcases'
    return POST(url, params)
  },
  runTaskApi: function (taskId, params) {
    let url = 'tasks/' + taskId + '/action/run'
    return POST(url, params)
  },
  getTaskApi: function (taskId) {
    let url = 'tasks/' + taskId
    return GET(url)
  },
  getTaskApiV2: function (taskId) {
    let url = 'mec-atp/edgegallery/atp/v2/tasks/' + taskId
    return axios.get(url, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
      }
    })
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

let Atp = {
  getAllCaseApi: function (params) {
    let url = 'testcases'
    return GET(url, params)
  },
  // Create test cases
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
  // Create test task
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
  // Get task list
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
  // download testcase
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
