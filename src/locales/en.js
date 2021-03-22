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
    userAccountCenter: 'My Account',
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
    deletePrompt: 'Do you want to continue deleting this test case?',
    deleteSuitePrompt: 'Do you want to continue deleting this test suite？',
    deleteSenarioPrompt: 'Do you want to continue deleting this test scenario?',
    onlyOneFile: 'Only one file is allowed, please remove the file first!',
    deleteSuccess: 'Delete Success',
    deleteFail: 'Delete Fail',
    runFailed: 'Run Failed',
    getSceneFail: 'Failed to get scenario',
    modifySuccess: 'Successfully modified',
    modifyFail: 'Fail to edit',
    submitSuccess: 'Submitted successfully',
    manualTip: 'There are also manual use cases, which need to be completed manually by the administrator'
  },
  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    search: 'Search',
    edit: 'Modify',
    close: 'Close'
  },
  atp: {
    success: 'Success',
    failed: 'Failed',
    dependencyDetail: 'Dependency Details',
    versionDependency: 'Version Dependency',
    testTask: 'Test Task Description',
    testItems: 'Test Items',
    caseNumber: 'Number of Use Cases',
    cancel: 'Cancel',
    confirm: 'Confirm',
    returnList: 'Return to Task List',
    security: 'Security',
    complianceTest: 'Compliance Test',
    sandboxTest: 'Sandbox Test',
    review: 'Review',
    testCase: 'Test Case',
    startTest: 'Start Test',
    result: 'ATP Result',
    caseName: 'CaseName',
    caseDetail: 'CaseDetail',
    testReport: 'ATP Report',
    detail: 'Detail',
    version: 'Version',
    packageName: 'Package Name',
    startTime: 'Starting Time',
    endTime: 'End Time',
    status: 'Status',
    ticketNumber: 'Mission Ticket Number',
    baseInfo: 'Basic Information',
    uploadUser: 'Upload User',
    testCaseManagement: 'Test Case Management',
    fileSize: 'File Size',
    applicationName: 'Application Name',
    appPackage: 'App Package',
    uploadApp: 'Upload App',
    onlyCsar: 'Can Only Upload .csar Files.',
    packageSizeLimit: 'No More than 10M',
    taskManage: 'Task Management'
  },
  testCase: {
    management: 'Testcase Management',
    caseName: 'Testcase Name',
    caseType: 'Testcase Type',
    casePurpose: 'Purpose',
    step: 'Test Steps',
    type: 'Type',
    expectedResult: 'Result',
    language: 'Language',
    verificationModel: 'Testcase Model',
    operation: 'Operation',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    model: 'Model',
    standard: 'Community Standards',
    addCase: 'Add Case',
    editCase: 'Edit Case',
    import: 'Case Import',
    sample: 'Sample Download',
    description: 'Description',
    testSuiteList: 'Test Suite',
    nameCn: 'Chinese Name',
    nameEn: 'English Name',
    descriptionCn: 'Chinese Description',
    descriptionEn: 'English Description',
    expecteCn: 'Chinese Expected',
    expecteEn: 'English Expected',
    stepCn: 'Chinese Steps',
    stepEn: 'English Steps',
    applicationTestPlatform: 'Application Test Platform',
    testSuiteManagement: 'Test Suite Management',
    testSuiteCn: 'Test Suite Chinese Name',
    testSuiteEn: 'Test Suite English Name',
    testSuiteDescriptionCn: 'Test Suite Chinese Description',
    testSuiteDescriptionEn: 'Test Suite English Description',
    testScenarioManagement: 'Test Scenarios Management',
    testScenarioCn: 'Test Scenario Chinese Name',
    testScenarioEn: 'Test Scenario English Name',
    testScenarioDescriptionCn: 'Test Scenario Chinese Description',
    testScenarioDescriptionEn: 'Test Scenario English Description',
    testScenarioIcon: 'Test Scenario Icon',
    testScenarioLabel: 'Test Scenario Label',
    selectTestScenario: 'Select Label',
    addTestSuite: 'Add Test Suite',
    editTestSuite: 'Modify Test Suite',
    addTestScenario: 'Add Test Scenario',
    editTestScenario: 'Modify Test Scenario',
    testScenarioIntro: 'The test scenario is the largest unit set of the test, a test scenario can contain multiple test suites.',
    testSuiteIntro: 'A test suite is a classification of test types. A test suite can belong to one or more test scenarios, and a test suite can contain multiple test cases.',
    testCaseIntro: 'A test case is the smallest execution unit of a test. A test case can belong to one or more test suites.',
    pleaseInput: 'Please Input'

  },
  home: {
    bannerTitle: 'Application Testing and Certification Platform',
    bannerText1: 'Multiple Enterprise Standard Use Case Sets Adaption',
    bannerText2: 'Low Threshold Test Case Creation',
    bannerText3: 'Visualized Test Process',
    staReport: 'Statistical Report',
    totalNum: 'Total Number of Scans',
    chartTitle: 'Scan Statistics for Past Six Months',
    getFail: 'Failed to Get Data'
  },
  process: {
    modifyStatus: 'Modify Use Case Status'
  },
  Scenes: {
    name: 'Name'
  },
  userpage: {
    selectScene: 'Select Scenario',
    contribution: 'Testcase Contribution',
    seeDetail: 'See Details',
    caseDetail: 'Testcase Detail',
    name: 'Name',
    status: 'Status',
    type: 'Type',
    description: 'Description',
    score: 'Score',
    result: 'Result',
    find: '',
    issue: 'Issues were found in all scenarios',
    hover: 'Successful / Total',
    clickContribution: 'Click to contribute use case',
    choose: 'Please choose',
    failReason: 'Reasons for failure',
    clickDownloadCase: 'Click to Download the Case'
  },
  modelmgmt: {
    name: 'Name:',
    description: 'Description:',
    scene: 'Scenario'
  },
  about: {
  },
  ...enLocale
}
export default en
