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

import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
  nav: {
    logout: '注销',
    login: '登录',
    atp: 'ATP 测试'
  },
  myApp: {
    checkTest: '检查测试',
    testStatus: '测试状态',
    startTime: '提交时间',
    reset: '重置',
    inquire: '查询',
    version: '版本',
    endTime: '结束时间',
    operation: '操作',
    taskNumber: '任务序号',
    checkReport: '查看报告',
    upload: '上传',
    provider: '供应商'
  },
  report: {
    testReport: 'EdgeGallery测试认证报告',
    downloadReport: '下载报告',
    reportanalysis: '测试报告分析',
    version: '版本',
    packageName: '应用名称',
    startTime: '提交时间',
    endTime: '结束时间',
    status: '状态',
    detail: '详情',
    ticketNumber: '任务号',
    baseInfo: '基础信息',
    uploadUser: '上传人',
    failReason: '失败原因',
    rate: '通过率',
    model: '认证模板',
    reportDetail: '测试用例详情',
    number: '数量'
  },
  promptMessage: {
    guestUser: 'guest用户无权操作! 请先登录',
    gettestcaseFail: '测试用例获取失败',
    resolveFail: '解析依赖失败',
    creattaskFail: '创建任务失败',
    getprocessFail: '获取任务进展失败',
    onlyCsar: '只能上传 .csar 文件.',
    packageSizeLimit: '文件大小不超过10M',
    getTaskListFail: '获取测试任务失败。',
    contrastTime: '提交时间不能早于测试结束时间！',
    confirmLogout: '您确定要退出吗?',
    prompt: '提示',
    browserAdvise: '为了部分功能正常使用，我们建议使用Chrom浏览器！',
    downloadSuccess: '下载成功',
    downloadFail: '下载失败',
    deletePrompt: '是否要继续删除此用例？',
    onlyOneFile: '仅支持一个文件，请先移除已有文件！',
    deleteSuccess: '删除成功',
    deleteFail: '删除失败'
  },
  common: {
    cancel: '取消',
    confirm: '确定',
    delete: '删除'
  },
  atp: {
    success: '成功数量',
    failed: '失败数量',
    dependencyDetail: '依赖详情',
    versionDependency: '版本依赖',
    testTask: '测试任务描述',
    testItems: '测试项',
    caseNumber: '用例个数',
    cancel: '取消',
    confirm: '确定',
    returnList: '返回任务列表',
    security: '安全测试',
    complianceTest: '遵从性测试',
    sandboxTest: '沙箱测试',
    review: '审核',
    testCase: '测试用例',
    startTest: '开始测试',
    result: '测试结果',
    caseName: '用例名称',
    caseDetail: '用例详情',
    testReport: '测试报告分析',
    detail: '详情',
    version: '版本',
    packageName: '应用名称',
    startTime: '提交时间',
    endTime: '结束时间',
    status: '状态',
    ticketNumber: '任务号',
    baseInfo: '基础信息',
    uploadUser: '上传人',
    testCaseManagement: '测试用例管理',
    fileSize: '文件大小',
    applicationName: '应用名称',
    appPackage: '应用包',
    uploadApp: '上传应用',
    onlyCsar: '只能上传 .csar 文件.',
    packageSizeLimit: '文件大小不超过10M'
  },
  testCase: {
    management: '测试用例管理',
    caseName: '测试用例名称',
    caseType: '测试用例类型',
    casePurpose: '测试用例目的',
    expectedResult: '测试预期结果',
    language: '测试用例语言',
    verificationModel: '所属认证模板',
    operation: '操作',
    delete: '删除',
    edit: '编辑',
    add: '新增',
    model: '认证模板',
    standard: '社区标准',
    addCase: '新增测试用例',
    editCase: '编辑测试用例',
    import: '测试用例导入',
    sample: '样例下载'
  },
  home: {
    bannerTitle: '应用测试认证平台',
    bannerText1: '适配多企业标准用例集',
    bannerText2: '低门槛测试用例编写',
    bannerText3: '测试过程可视化',
    staReport: '统计报告',
    totalNum: '扫描总数',
    chartTitle: '过去六个月扫描统计数据'
  },
  process: {
    modifyStatus: '修改用例状态'
  },
  about: {},
  ...zhLocale
}
export default cn
