import Mock from 'mockjs'

const url = {
  testappUrl: '/mock/testapp/app',
  taskListUrl: '/mock/test/task',
  testcaseUrl: '/mock/atptestcase',
  dependencyUrl: '/mock/dependency',
  creattaskUrl: '/mock/creattask',
  processUrl: '/mock/process',
  downloadUrl: 'mock/download'
}

var testappList = Mock.mock(url.testappUrl, {
  'dataList|14': [{
    'name|1': ['AntMediaServer', 'AR视觉应用', 'DaluRobot-Server', 'Ameeting', 'drawio', 'KTMedia', 'MediaPipe', 'SnapScale', 'SRS', 'Etherpad', 'ZoneMinder', '工厂无语7.9', 'A-Frame', 'AnanMss', 'ARTookit', 'Battlecitygame', 'Excalidraw', 'nginx-rtmp-module', '河图', '金山云金晴推理服务', '明御综合日志审计平台', '云讯智能车牌识别服务', '执法办案API'],
    // 'logo': '@Image(130x130, #dddddd)',
    'provider|1': ['Huawei', 'OpenSource', 'Google', 'Dalurobot', 'Ananwulian'],
    'industry|1': ['智慧园区', '水利', '游戏竞技'],
    'type|1': ['Video,Video Surveilance', 'Game,AR/VR', 'Blockchain'],
    'architecture|1': ['x86', 'ARM64', 'ARM32', 'GPU', 'NPU'],
    'status|1': ['Environmental preparation', 'Test preparation', 'Test execution', 'IN_PROGRESS', 'COMPLETED'],
    'beginTime|1': ['2020-07-15', '2020-07-16', '2020-07-20', '2020-07-23'],
    'score|1': ['5', '3', '4', '5']
  }]
})
// var taskListApp = Mock.mock(url.taskListUrl, {
//   'tasks|3': [{
//     'task':
//       {
//         'name|1': ['AR-视觉应用', '安恒明御Web应用防火墙'],
//         'beginTime|1': ['2020-08-03T06:32:34.000+0000', '2020-08-03T06:32:34.000+0000', '2020-08-03T06:32:34.000+0000', '2020-08-03T06:32:34.000+0000', '2020-08-03T06:32:34.000+0000'],
//         'endTime|1': ['2020-08-03T06:33:30.000+0000', '2020-08-03T06:33:30.000+0000', '2020-08-03T06:33:30.000+0000'],
//         'status|1': ['Success', 'Success', 'Fail', 'Virus Scan', 'Compliance Test'],
//         // 'status|1': ['COMPLETED', 'COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'IN_PROGRESS'],
//         'taskId|1': ['0601fad0-a5c3-4b6b-9941-b47b989500c1', '0601fad0-a5c3-4b6b-9941-b47b989500c2', '0601fad0-a5c3-4b6b-9941-b47b989500c3'],
//         'taskNo|1': ['MEC20200803001', 'MEC20200803002', 'MEC20200803003', 'MEC20200803004']
//       }
//   }
//   ]
// })

// var taskListApp = Mock.mock(url.taskListUrl, {
//   'tasks|4': [{
//     'task':
//     {
//       'id': 'MEC20200803001',
//       'appName': 'AR-视觉应用',
//       'appVersion': '1.0',
//       'status': 'success',
//       'createTime': '2020-08-03T06:33:30.000+0000',
//       'endTime': '2020-08-03T06:33:30.000+0000',
//       'user': {
//         'userId': '58bbeb8d-c020-46e5-bab9-7d4bc9e875b8',
//         'userName': 'baizhenzhen'
//       }
//     }
//   }
//   ]
// })
// 获取测试任务列表
var taskListApp = Mock.mock(url.taskListUrl, {
  'tasks|5': [{
    'id': 'MEC20200803001',
    'appName': 'AR-视觉应用',
    'appVersion': '1.0',
    'status': 'success',
    'createTime': '2020-08-03T06:33:30.000+0000',
    'endTime': '2020-08-03T06:33:30.000+0000',
    'user': {
      'userId': '58bbeb8d-c020-46e5-bab9-7d4bc9e875b8',
      'userName': 'baizhenzhen'
    },
    'testCaseDetail': {
      'virusScanningTest': [{
        'testCaseName1': {
          'result': 'success',
          'reason': ''
        }
      }
      ],
      'complianceTest': [{
        'testCaseName3': {
          'result': 'success',
          'reason': ''
        },
        'testCaseName4': {
          'result': 'failed',
          'reason': 'do not have mf file.'
        }
      }
      ],
      'sandboxTest': [{
        'testCaseName5': {
          'result': 'failed',
          'reason': 'instantial failed.'
        }
      }]
    }
  }]

})
// 测试用例
var testCase = Mock.mock(url.testcaseUrl, {
  'data': [
    {
      'id': 'id',
      'name': 'virusScan',
      'type': 'virusScanningTest',
      'className': 'classPath',
      'description': 'Virus scan test case.'
    },
    {
      'id': 'id',
      'name': 'MFFilePathValidation',
      'type': 'complianceTest',
      'className': 'classPath',
      'description': 'Root path must contain the file which name ends of .mf'
    },
    {
      'id': 'id',
      'name': 'MFFileFieldValidation',
      'type': 'complianceTest',
      'className': 'classPath',
      'description': '.mf file must contain the following field: app_name, app_provider, app_archive_version, app_release_date_time and app_contact'
    },
    {
      'id': 'id',
      'name': 'MFFileSourcePathValidation',
      'type': 'complianceTest',
      'className': 'classPath',
      'description': 'The value of Source filed must be right path, the corresponding file must exist'
    },
    {
      'id': 'id',
      'name': 'ToscaFileValidation',
      'type': 'complianceTest',
      'className': 'classPath',
      'description': 'TOSCA.meta file must exist, and it must contain the following field: Entry-Definitions, ETSI-Entry-Manifest, Entry-Tests, ETSI-Entry-Change-Log and Entry-Helm-Package, and the the value of above filed must be right path, the corresponding file must exist'
    },
    {
      'id': 'id',
      'name': 'InstantiateApp',
      'type': 'sandboxTest',
      'className': 'classPath',
      'description': 'instantiate application and its dependency application on one edge host'
    },
    {
      'id': 'id',
      'name': 'InstantiateAUnInstantiateApp',
      'type': 'sandboxTest',
      'className': 'classPath',
      'description': 'Uninstantiate application and its dependency application on one edge host'
    }
    // 'complianceTest': [
    //   {
    //     'name': 'MFFilePathValidation',
    //     'description': 'Root path must contain the file which name ends of .mf'
    //   },
    //   {
    //     'name': 'MFFileFieldValidation',
    //     'description': '.mf file must contain the following field: app_name, app_provider, app_archive_version, app_release_date_time and app_contact'
    //   },
    //   {
    //     'name': 'MFFileSourcePathValidation',
    //     'description': 'The value of Source filed must be right path, the corresponding file must exist'
    //   },
    //   {
    //     'name': 'ToscaFileValidation',
    //     'description': 'TOSCA.meta file must exist, and it must contain the following field: Entry-Definitions, ETSI-Entry-Manifest, Entry-Tests, ETSI-Entry-Change-Log and Entry-Helm-Package, and the the value of above filed must be right path, the corresponding file must exist'
    //   }
    // ],
    // 'sandboxTest': [
    //   {
    //     'name': 'InstantiateApp',
    //     'description': 'instantiate application and its dependency application on one edge host'
    //   },
    //   {
    //     'name': 'InstantiateAUnInstantiateApppp',
    //     'description': 'Uninstantiate application and its dependency application on one edge host'
    //   }
    // ]
  ]
})
// 解析依赖信息
var dependencyUrl = Mock.mock(url.dependencyUrl, 'post', function (option) {
  // console.log(option)
  return Mock.mock({
    'dependencydata': {
      'dependency': {
        'appName1': '1.0',
        'appName2': '2.0'
      }
    }
  })
})
// 创建任务
var creattask = Mock.mock(url.creattaskUrl, 'post', function (option) {
  // console.log(option)
  return Mock.mock({
    'data': [{
      'id': 'dc123381-ca4b-4d2e-b9a5-efbfee51dae2',
      'appName': 'AR_app',
      'appVersion': '0.8',
      'status': 'failed',
      'createTime': '1970-01-01T08:00:46.948+0000',
      'endTime': '1970-01-01T08:00:47.240+0000',
      'user': {
        'userId': '58bbeb8d-c020-46e5-bab9-7d4bc9e875b8',
        'userName': 'baizhenzhen'
      },
      'testCaseDetail': {}
    }]
  })
})
// 测试进展数据,获取任务
var process = Mock.mock(url.processUrl, {
  'data': [{
    'id': 'dc123381-ca4b-4d2e-b9a5-efbfee51dae2',
    'appName': 'AR_app',
    'appVersion': '0.8',
    'status': 'failed',
    'createTime': '1970-01-01T08:00:46.948+0000',
    'endTime': '1970-01-01T08:00:47.240+0000',
    'user': {
      'userId': '58bbeb8d-c020-46e5-bab9-7d4bc9e875b8',
      'userName': 'baizhenzhen'
    },
    'testCaseDetail': {
      'virusScanningTest': [{
        'virusScan': {
          'result': 'success',
          'reason': ''
        }
      }],
      'complianceTest': [{
        'SourcePath': {
          'result': 'success',
          'reason': ''
        },
        'Suffix': {
          'result': 'success',
          'reason': ''
        },
        'MFContent': {
          'result': 'failed',
          'reason': 'inner exception, please check the log.'
        },
        'ToscaFile': {
          'result': 'failed',
          'reason': 'inner exception, please check the log.'
        }
      }],
      'sandboxTest': [{
        'UnInstantiate': {
          'result': 'success',
          'reason': ''
        },
        'Instantiate': {
          'result': 'success',
          'reason': ''
        }
      }]
    }
  }]
})
// 测试报告下载
var download = Mock.mock(url.downloadUrl, {
  'data|1': []
})
export {
  testappList, taskListApp, testCase, dependencyUrl, creattask, process, download
}
