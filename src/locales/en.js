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

import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
  nav: {
    logout: 'Logout',
    login: 'Login',
    atp: 'ATP'
  },
  myApp: {
    checkTest: 'Check Test',
    testStatus: 'Test Status',
    startTime: 'Starting Time',
    reset: 'Reset',
    inquire: 'Inquire',
    version: 'Version',
    endTime: 'End Time',
    operation: 'Operation',
    taskNumber: 'Task Number',
    checkReport: 'Check Report',
    upload: 'Upload',
    appName: 'Application Name',
    status: 'Status',
    provider: 'Provider'
  },
  report: {
    testReport: 'EdgeGallery test certification report',
    downloadReport: 'Download Report',
    reportanalysis: 'Test report analysis',
    version: 'Version',
    packageName: 'Package Name',
    startTime: 'Starting Time',
    endTime: 'End Time',
    status: 'Status',
    detail: 'Details',
    ticketNumber: 'Mission ticket number',
    baseInfo: 'Basic Information',
    uploadUser: 'Upload User',
    failReason: 'Fail Reason',
    rate: 'Pass rate',
    model: 'Certification template',
    reportDetail: 'Test case details',
    number: 'Number'
  },
  promptMessage: {
    guestUser: 'The guest user has no right to operate. please log in first!',
    gettestcaseFail: 'Test case acquisition failed',
    resolveFail: 'Failed to resolve dependencies',
    creattaskFail: 'Failed to create test task',
    getprocessFail: 'Failed to get task progress',
    onlyCsar: 'Can only upload .csar files.',
    packageSizeLimit: 'no more than 10M',
    getTaskListFail: 'Failed to get test task.',
    contrastTime: 'The submission time cannot be earlier than the test end time!',
    confirmLogout: 'Are you sure to log out?',
    prompt: 'Prompt',
    browserAdvise: 'For sure some functions work well, please use Chrome',
    downloadSuccess: 'Download Success',
    downloadFail: 'Download Fail',
    deletePrompt: 'Do you want to continue deleting this use case?',
    onlyOneFile: 'Only one file is allowed, please remove the file first!',
    deleteSuccess: 'Delete Success',
    deleteFail: 'Delete Fail'
  },
  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete'
  },
  atp: {
    success: 'success',
    failed: 'failed',
    dependencyDetail: 'Dependency Details',
    versionDependency: 'Version Dependency',
    testTask: 'Test task description',
    testItems: 'Test Items',
    caseNumber: 'Number of use cases',
    cancel: 'Cancel',
    confirm: 'Confirm',
    returnList: 'Return to task list',
    security: 'security',
    complianceTest: 'Compliance Test',
    sandboxTest: 'Sandbox Test',
    review: 'Review',
    testCase: 'Test Case',
    startTest: 'Start Test',
    result: 'ATP Result',
    caseName: 'CaseName',
    caseDetail: 'CaseDetail',
    testReport: 'ATP Report',
    detail: 'detail',
    version: 'Version',
    packageName: 'Package Name',
    startTime: 'Starting Time',
    endTime: 'End Time',
    status: 'Status',
    ticketNumber: 'Mission ticket number',
    baseInfo: 'Basic Information',
    uploadUser: 'Upload User',
    testCaseManagement: 'Test Case Management',
    fileSize: 'File Size',
    applicationName: 'applicationName',
    appPackage: 'appPackage',
    uploadApp: 'uploadApp',
    onlyCsar: 'Can only upload .csar files.',
    packageSizeLimit: 'no more than 10M'
  },
  testCase: {
    management: 'Testcase Management',
    caseName: 'Testcase Name',
    caseType: 'Testcase Type',
    casePurpose: 'Purpose',
    expectedResult: 'Result',
    language: 'Language',
    verificationModel: 'Testcase Model',
    operation: 'Operation',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    model: 'Model',
    standard: 'Community standards',
    addCase: 'Add Case',
    editCase: 'Edit Case',
    import: 'Case Import',
    sample: 'Sample Download'
  },
  home: {
    bannerTitle: 'Application testing and certification platform',
    bannerText1: 'Adapt to multiple enterprise standard use case sets',
    bannerText2: 'Low threshold test case writing',
    bannerText3: 'Visualization of the test process',
    staReport: 'Statistical Report',
    totalNum: 'Total number of scans',
    chartTitle: 'Scan statistics for the past six months'
  },
  process: {
    modifyStatus: 'Modify use case status'
  },
  about: {
  },
  ...enLocale
}
export default en
