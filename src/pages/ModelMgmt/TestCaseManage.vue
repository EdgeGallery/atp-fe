<!--
  -  Copyright 2021 Huawei Technologies Co., Ltd.
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
  <div>
    <Navcomp />
    <div class="testcase padding100">
      <breadcrumb />
      <div
        class="testcase-main common-div"
      >
        <div class="flex enter-search">
          <div class="flex">
            <el-input
              class="common-input right-space"
              v-model="form.name"
              prefix-icon="el-icon-search"
              :placeholder="$t('testCase.provideNameSearch')"
            />
            <el-select
              class="common-select right-space"
              v-model="form.type"
              :placeholder="$t('testCase.provideTestType')"
            >
              <el-option
                v-for="item in testType"
                :key="item.value"
                :label="language==='cn'?item.label:item.value"
                :value="item.value"
              />
            </el-select>
            <el-select
              class="common-select right-space"
              v-model="form.testSuiteIdList"
              :placeholder="$t('testCase.provideTestSuite')"
            >
              <el-option
                v-for="item in testSuiteList"
                :key="item.id"
                :label="language==='cn'?item.nameCh:item.nameEn"
                :value="item.id"
              />
            </el-select>
            <el-button
              class="common-btn"
              @click="resetSearchForm"
            >
              {{ $t('myApp.reset') }}
            </el-button>
            <el-button
              class="common-btn"
              @click="selectcaseList"
            >
              {{ $t('myApp.inquire') }}
            </el-button>
            <el-tooltip
              :content="this.$t('testCase.testCaseIntro')"
              placement="right"
              class="questionIcon"
            >
              <div>
                <img
                  src="../../assets/images/icon-question.png"
                  alt=""
                >
              </div>
            </el-tooltip>
          </div>
          <div v-if="isAdmin">
            <el-button
              class="common-btn"
              @click="excelBringBtn"
            >
              {{ this.$t('modelmgmt.import') }}
            </el-button>
            <el-button
              class="common-btn"
              @click="addTestBtn"
            >
              {{ $t('testCase.add') }}
            </el-button>
          </div>
        </div>
        <div class="testcase-content">
          <el-table
            :data="pageData"
            class="common-table"
          >
            <el-table-column
              prop="nameCh"
              :label="$t('testCase.caseName')"
            >
              <template slot-scope="scope">
                {{ language==='cn'?scope.row.nameCh :scope.row.nameEn }}
              </template>
            </el-table-column>
            <el-table-column
              prop="testSuiteNameList"
              :label="$t('testCase.testSuiteList')"
            />
            <el-table-column
              prop="configNameList"
              :label="$t('home.configuration')"
              width="100"
            />
            <el-table-column
              prop="descriptionCh"
              :label="$t('testCase.description')"
            >
              <template slot-scope="scope">
                {{ language==='cn'?scope.row.descriptionCh :scope.row.descriptionEn }}
              </template>
            </el-table-column>
            <el-table-column
              prop="expectResultCh"
              :label="$t('testCase.expectedResult')"
            >
              <template slot-scope="scope">
                {{ language==='cn'?scope.row.expectResultCh :scope.row.expectResultEn }}
              </template>
            </el-table-column>
            <el-table-column
              prop="codeLanguage"
              :label="$t('testCase.language')"
              width="110"
            />
            <el-table-column
              prop="testStepCh"
              :label="$t('testCase.step')"
            >
              <template slot-scope="scope">
                {{ language==='cn'?scope.row.testStepCh :scope.row.testStepEn }}
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t('testCase.caseType')"
              width="150"
            >
              <template slot-scope="scope">
                {{ language==='en'?scope.row.type:scope.row.type==='automatic'?'自动化类型':'手动类型' }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('testCase.operation')"
              width="240"
              v-if="isAdmin"
            >
              <template slot-scope="scope">
                <el-button
                  class="configBtn"
                  @click="deleteCase(scope.row)"
                >
                  {{ $t('testCase.delete') }}
                </el-button>
                <el-button
                  class="configBtn"
                  @click="editCase(scope.row)"
                >
                  {{ $t('testCase.edit') }}
                </el-button>
                <el-button
                  class="configBtn"
                  @click="downLoadCase(scope.row)"
                >
                  {{ $t('testCase.download') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            style="margin-top: 20px"
          >
            <pagination
              :table-data="pageData"
              @getCurrentPageData="getCurrentPageData"
              :list-total="listTotal"
            />
          </div>
        </div>
      </div>
      <!-- 新增用例弹框 -->
      <el-dialog
        :visible.sync="addCaseVisible"
        :title="dialogTitle"
        :close-on-click-modal="false"
        width="35%"
        append-to-body
        class="addtestdialog commondlg"
      >
        <el-form
          :model="addcaseForm"
          label-width="150px"
          ref="addcaseForm"
          :rules="rules"
        >
          <el-form-item
            :label="$t('testCase.nameCn')"
            prop="nameCh"
          >
            <el-input
              class="dlg-input"
              width="100px"
              size="small"
              v-model="addcaseForm.nameCh"
              :disabled="cannotEdit"
              maxlength="64"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.nameEn')"
            prop="nameEn"
          >
            <el-input
              class="dlg-input"
              width="100px"
              size="small"
              v-model="addcaseForm.nameEn"
              :disabled="cannotEdit"
              maxlength="64"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.caseType')"
            prop="type"
          >
            <el-select
              class="dlg-select"
              size="small"
              v-model="addcaseForm.type"
              :disabled="cannotEdit"
              :placeholder="$t('userpage.choose')"
            >
              <el-option
                v-for="item in testType"
                :key="item.value"
                :label="language==='cn'?item.label:item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('testCase.descriptionCn')"
            prop="descriptionCh"
          >
            <el-input
              class="dlg-input"
              v-model="addcaseForm.descriptionCh"
              type="textarea"
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.descriptionEn')"
            prop="descriptionEn"
          >
            <el-input
              class="dlg-input"
              v-model="addcaseForm.descriptionEn"
              type="textarea"
              autosize
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.expecteCn')"
            prop="expectResultCh"
          >
            <el-input
              class="dlg-input"
              size="small"
              type="textarea"
              v-model="addcaseForm.expectResultCh"
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.expecteEn')"
            prop="expectResultEn"
          >
            <el-input
              class="dlg-input"
              size="small"
              type="textarea"
              v-model="addcaseForm.expectResultEn"
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.language')"
            prop="codeLanguage"
          >
            <el-select
              class="dlg-select"
              size="small"
              v-model="addcaseForm.codeLanguage"
              @change="languageChange"
              :placeholder="$t('userpage.choose')"
            >
              <el-option
                v-for="item in codeLanguages"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('testCase.testSuiteList')"
            prop="testSuiteIdList"
          >
            <el-select
              class="dlg-select"
              multiple
              size="small"
              v-model="addcaseForm.testSuiteIdList"
              :placeholder="$t('userpage.choose')"
            >
              <el-option
                v-for="item in testSuiteList"
                :key="item.id"
                :label="language==='cn'?item.nameCh:item.nameEn"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('testCase.stepCn')"
            prop="testStepCh"
          >
            <el-input
              class="dlg-input"
              size="small"
              type="textarea"
              v-model="addcaseForm.testStepCh"
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.stepEn')"
            prop="testStepEn"
          >
            <el-input
              class="dlg-input"
              size="small"
              type="textarea"
              v-model="addcaseForm.testStepEn"
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.import')"
            prop="file"
            :required="confirmBtnApi === 'add'? true: false"
          >
            <el-upload
              action=""
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleChange"
              :on-remove="handleDelte"
              :file-list="addcaseForm.file"
              :auto-upload="false"
              accept=".java,.py,.jar"
            >
              <el-button
                slot="trigger"
                size="small"
                class="inner-btn"
              >
                {{ $t('testCase.import') }}
              </el-button>
              <a
                :href="DemoDownload"
                download
                style="padding-left:10px;"
              >
                <el-button
                  class="inner-btn"
                  slot="trigger"
                  size="small"
                >
                  {{ $t('testCase.sample') }}
                </el-button>
              </a>
            </el-upload>
          </el-form-item>
          <el-form-item
            :label="$t('home.configuration')"
            prop="configIdList"
          >
            <el-select
              class="dlg-select"
              multiple
              size="small"
              v-model="addcaseForm.configIdList"
              :placeholder="$t('userpage.choose')"
            >
              <el-option
                :label="language==='cn'?'空':'NULL'"
                value=""
                @click.native="selectConfig('')"
              />
              <el-option
                v-for="item in configList"
                :key="item.id"
                :label="language==='cn'?item.nameCh:item.nameEn"
                :value="item.id"
                @click.native="selectConfig(item.id)"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
        >
          <el-button
            id="upload_package_close"
            @click="handleClose"
            style="margin-right:40px;"
            class="common-btn"
            size="small"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            id="upload_package_ipload"
            class="common-btn"
            @click="confirmAddCase"
            size="small"
          >
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="addExcelVisible"
        :close-on-click-modal="false"
        width="30%"
        :title="$t('modelmgmt.importCase')"
        append-to-body
        class="addtestdialog commondlg"
      >
        <el-form
          :model="batchForm"
          label-width="100px"
        >
          <el-form-item :label="this.$t('modelmgmt.import')">
            <el-upload
              action=""
              :limit="1"
              :on-change="excelChange"
              :on-remove="excelDelte"
              :file-list="batchForm.batchFile"
              :auto-upload="false"
              accept=".zip"
            >
              <el-button
                slot="trigger"
                size="small"
                class="inner-btn"
              >
                {{ $t('testCase.import') }}
              </el-button>
              <a
                :href="batchDemo"
                download
                style="padding-left:10px;"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  class="inner-btn"
                >
                  {{ $t('testCase.sample') }}
                </el-button>
              </a>
            </el-upload>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
        >
          <el-button
            id="upload_package_close"
            @click="handleClose"
            class="common-btn"
            size="small"
            style="margin-right:40px;"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            id="upload_package_ipload"
            size="small"
            @click="BatchImport"
            class="common-btn"
          >
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="deleteVisible"
        :close-on-click-modal="false"
        title="提示"
        width="25%"
        append-to-body
        class="prompt-dialog commondlg"
      >
        <div style="text-align: center;">
          <img
            src="../../assets/images/deleteicon.png"
            alt=""
          >
          <p class="prompt-text">
            {{ this.$t('promptMessage.deletePrompt') }}
          </p>
        </div>
        <div
          slot="footer"
        >
          <el-button
            style="margin-right:40px;"
            class="common-btn"
            @click="deleteVisibleClose"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            class="common-btn"
            @click="confirmdeleteCase"
          >
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Atp, ModelMgmt, Taskmgmt } from '../../tools/api.js'
import pagination from '../../components/common/Pagination.vue'
import Navcomp from '../../components/layout/Nav.vue'
import breadcrumb from '../../components/common/Breadcrumb.vue'
export default {
  components: { pagination, Navcomp, breadcrumb },
  name: 'TestCase',
  data () {
    var NameEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.nameEmpty')))
      } else {
        callback()
      }
    }
    var DescEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.descriptionEmpty')))
      } else {
        callback()
      }
    }
    var LanguageEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.languageEmpty')))
      } else {
        callback()
      }
    }
    var ResultEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.expectResultEmpty')))
      } else {
        callback()
      }
    }
    var SuiteIdListEmpty = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(this.$t('promptMessage.testSuiteEmpty')))
      } else {
        callback()
      }
    }
    var StepEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.testStepEmpty')))
      } else {
        callback()
      }
    }
    var typeEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.typeEmpty')))
      } else {
        callback()
      }
    }
    var fileEmpty = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(this.$t('promptMessage.fileEmpty')))
      } else {
        callback()
      }
    }
    var configEmpty = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(this.$t('promptMessage.configIdEmpty')))
      } else {
        callback()
      }
    }
    return {
      language: localStorage.getItem('language'),
      userName: sessionStorage.getItem('userName'),
      taskId: '',
      form: {
        testSuiteIdList: [],
        name: '',
        type: '',
        locale: ''
      },
      codeLanguages: [
        {
          value: 1,
          label: 'java'
        }, {
          value: 2,
          label: 'python'
        }, {
          value: 3,
          label: 'jar'
        }
      ],
      testType: [
        {
          value: 'manual',
          label: '手动类型'
        }, {
          value: 'automatic',
          label: '自动化类型'
        }
      ],
      testSuiteList: [],
      pageData: [],
      addCaseVisible: false,
      deleteVisible: false,
      deleteId: '',
      confirmBtnApi: '',
      dialogTitle: '',
      editid: '',
      cannotEdit: false,
      addcaseForm: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        codeLanguage: '',
        expectResultCh: '',
        expectResultEn: '',
        testSuiteIdList: [],
        testStepCh: '',
        testStepEn: '',
        type: '',
        file: [],
        configIdList: []
      },
      addExcelVisible: false,
      batchForm: {
        batchFile: []
      },
      editfile: false,
      DemoDownload: './javaExample.java',
      batchDemo: './batch_import.zip',
      mapCh: new Map(),
      mapEn: new Map(),
      configCh: new Map(),
      configEh: new Map(),
      configList: [],
      rules: {
        nameCh: [
          { required: true, validator: NameEmpty, trigger: 'blur' }
        ],
        descriptionCh: [
          { required: true, validator: DescEmpty, trigger: 'blur' }
        ],
        codeLanguage: [
          { required: true, validator: LanguageEmpty, trigger: 'change' }
        ],
        expectResultCh: [
          { required: true, validator: ResultEmpty, trigger: 'blur' }
        ],
        testSuiteIdList: [
          { required: true, validator: SuiteIdListEmpty, trigger: 'blur' }
        ],
        testStepCh: [
          { required: true, validator: StepEmpty, trigger: 'blur' }
        ],
        type: [
          { required: true, validator: typeEmpty, trigger: 'blur' }
        ],
        file: [
          { required: true, validator: fileEmpty, trigger: 'change' }
        ],
        configIdList: [
          { required: true, validator: configEmpty, trigger: 'change' }
        ]
      },
      limitSize: 5,
      offsetPage: 0,
      listTotal: 0,
      currentPage: 1,
      isAdmin: false
    }
  },
  mounted () {
    let _timer = setTimeout(() => {
      clearTimeout(_timer)
      this.initUser()
    }, 500)
    this.getAllcase()
  },
  beforeRouteEnter (to, from, next) {
    sessionStorage.removeItem('currentPage')
    next()
  },
  methods: {
    initUser () {
      let _authorities = sessionStorage.getItem('authorities')
      if (_authorities && _authorities.length > 0) {
        this.isAdmin = _authorities.includes('ROLE_ATP_ADMIN')
      }
    },
    resetForm () {
      if (this.$refs['addcaseForm']) {
        this.$refs['addcaseForm'].resetFields()
      }
    },
    selectcaseList () {
      sessionStorage.setItem('currentPage', 1)
      this.getAllcase()
    },
    getCurrentPageData (val, pageSize, start) {
      this.limitSize = pageSize
      this.offsetPage = start
    },
    resetSearchForm () {
      this.form = {
        testSuiteIdList: [],
        name: '',
        type: '',
        locale: ''
      }
      this.getAllcase()
    },
    async getAllcase () {
      await this.getALlSuites()
      await this.getALlConfig()
      this.pageData = []
      this.form.locale = this.language === 'cn' ? 'ch' : 'en'
      const params = { name: this.form.name,
        type: this.form.type,
        locale: this.form.locale,
        testSuiteIdList: this.form.testSuiteIdList,
        limit: this.limitSize,
        offset: this.offsetPage }
      Atp.getAllCaseApi(params).then(res => {
        let data = res.data.results
        this.listTotal = res.data.total
        data.forEach(item => {
          let testSuiteList = []
          item.testSuiteIdList.forEach(Id => {
            if (this.language === 'cn') {
              testSuiteList.push(this.mapCh.get(Id))
            } else {
              testSuiteList.push(this.mapEn.get(Id))
            }
          })
          item.testSuiteNameList = testSuiteList.toString()
          let configList = []
          this.setConfig(item, configList)
        })
        this.pageData = data
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.gettestcaseFail'),
          type: 'warning'
        })
      })
    },
    setConfig (item, configList) {
      if (item.hasOwnProperty('configIdList')) {
        item.configIdList.forEach(Id => {
          if (this.language === 'cn') {
            configList.push(this.configCh.get(Id))
          } else {
            configList.push(this.configEh.get(Id))
          }
        })
        item.configNameList = configList.toString()
      } else {
        item.configNameList = '/'
      }
    },
    async getALlSuites () {
      this.testSuiteList = []
      await ModelMgmt.getTestSuite().then(res => {
        let data = res.data
        data.forEach(item => {
          let obj = {
            id: '',
            nameCh: '',
            nameEn: ''
          }
          obj.id = item.id
          obj.nameCh = item.nameCh
          obj.nameEn = item.nameEn
          this.testSuiteList.push(obj)
          this.mapCh.set(obj.id, obj.nameCh)
          this.mapEn.set(obj.id, obj.nameEn)
        })
      })
    },
    async getALlConfig () {
      this.configList = []
      const params = { limit: 100, offset: 0 }
      await Taskmgmt.getConfigApi(params).then(res => {
        let data = res.data.results
        data.forEach(item => {
          let obj = {
            id: '',
            nameCh: '',
            nameEn: ''
          }
          obj.id = item.id
          obj.nameCh = item.nameCh
          obj.nameEn = item.nameEn
          this.configList.push(obj)
          this.configCh.set(obj.id, obj.nameCh)
          this.configEh.set(obj.id, obj.nameEn)
        })
      })
    },
    downLoadCase (row) {
      Atp.downLoadCaseApi(row.id, row.codeLanguage).then(res => {
        this.$message({
          duration: 2000,
          showClose: true,
          type: 'success',
          message: this.$t('promptMessage.downloadSuccess')
        })
      }).catch(() => {
        this.$message({
          duration: 2000,
          showClose: true,
          type: 'warning',
          message: this.$t('promptMessage.downloadFail')
        })
      })
    },
    handleClose () {
      this.addCaseVisible = false
      this.addExcelVisible = false
    },
    excelBringBtn () {
      this.addExcelVisible = true
    },
    BatchImport () {
      let fd = new FormData()
      fd.append('file', this.batchForm.batchFile[0])
      ModelMgmt.importTestModelApi(fd).then(res => {
        this.addExcelVisible = false
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'warning',
          message: '上传成功'
        })
        this.getAllcase()
        this.batchForm = {
          batchFile: []
        }
      }).catch((error) => {
        if (error.response.status === 206) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: '部分上传成功'
          })
        } else {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: '上传失败'
          })
        }
        this.addExcelVisible = false
        this.batchForm = {
          batchFile: []
        }
      })
    },
    addTestBtn () {
      this.resetForm()
      this.confirmBtnApi = 'add'
      this.dialogTitle = this.$t('testCase.addCase')
      this.cannotEdit = false
      this.addCaseVisible = true
      this.addcaseForm = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        codeLanguage: '',
        expectResultCh: '',
        expectResultEn: '',
        testSuiteIdList: [],
        testStepCh: '',
        testStepEn: '',
        type: '',
        file: [],
        configIdList: []
      }
    },
    confirmAddCase () {
      this.$refs['addcaseForm'].validate((valid) => {
        if (valid) {
          let fd = new FormData()
          let addcaseForm = this.addcaseForm
          fd.append('nameCh', addcaseForm.nameCh)
          fd.append('nameEn', addcaseForm.nameEn)
          fd.append('type', addcaseForm.type)
          fd.append('descriptionCh', addcaseForm.descriptionCh)
          fd.append('descriptionEn', addcaseForm.descriptionEn)
          fd.append('codeLanguage', addcaseForm.codeLanguage)
          fd.append('expectResultCh', addcaseForm.expectResultCh)
          fd.append('expectResultEn', addcaseForm.expectResultEn)
          fd.append('testSuiteIdList', addcaseForm.testSuiteIdList)
          fd.append('testStepCh', addcaseForm.testStepCh)
          fd.append('testStepEn', addcaseForm.testStepEn)
          fd.append('configIdList', addcaseForm.configIdList)
          if (this.confirmBtnApi === 'add') {
            fd.append('file', addcaseForm.file[0])
            Atp.createCaseApi(fd).then(res => {
              this.addCaseVisible = false
              this.getAllcase()
              this.$message({
                duration: 2000,
                showClose: true,
                message: this.$t('promptMessage.addSuccess'),
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: this.$t('promptMessage.addFail'),
                type: 'warning'
              })
              this.addCaseVisible = false
            })
          } else if (this.confirmBtnApi === 'edit') {
            fd.append('id', this.editid)
            this.confirmedit(fd, addcaseForm)
            Atp.editCaseApi(fd).then(res => {
              this.addCaseVisible = false
              this.getAllcase()
              this.$message({
                showClose: true,
                duration: 2000,
                message: this.$t('promptMessage.modifySuccess'),
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: this.$t('promptMessage.modifyFail'),
                type: 'warning'
              })
              this.addCaseVisible = false
            })
          }
          this.editfile = false
        } else {
          return false
        }
        if (this.addcaseForm.file.length !== 0) {
          this.$refs.addcaseForm.clearValidate(['file'])
        }
      })
    },
    // sonarqube Refactor
    confirmedit (fd, addcaseForm) {
      if (this.editfile) {
        fd.append('file', addcaseForm.file[0])
      } else {
        if (addcaseForm.file.length > 0) {
          fd.append('file', addcaseForm.file[0])
        } else {
          let objFile = new File([], 'kong.java')
          addcaseForm.file.push(objFile)
          fd.append('file', addcaseForm.file[0])
        }
      }
    },
    selectConfig (item) {
      if (this.addcaseForm.configIdList.indexOf(item) === -1) {
        if (item === '') {
          this.addcaseForm.configIdList = ['']
        }
      } else {
        if (item === '') {
          this.addcaseForm.configIdList = ['']
        } else {
          let pos = this.addcaseForm.configIdList.indexOf('')
          if (pos !== -1) {
            this.addcaseForm.configIdList.splice(pos, 1)
          }
        }
      }
    },
    editCase (row) {
      this.resetForm()
      if (!row.hasOwnProperty('configIdList')) {
        row.configIdList = ['']
      }
      this.editid = row.id
      this.confirmBtnApi = 'edit'
      this.dialogTitle = this.$t('testCase.editCase')
      this.cannotEdit = true
      this.addCaseVisible = true
      this.addcaseForm = JSON.parse(JSON.stringify(row))
      this.addcaseForm.file = []
    },
    deleteVisibleClose () {
      this.deleteVisible = false
    },
    deleteCase (row) {
      this.deleteVisible = true
      this.deleteId = row.id
    },
    confirmdeleteCase () {
      this.deleteVisible = false
      let id = this.deleteId
      Atp.deleteCaseApi(id).then(res => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.deleteSuccess'),
          type: 'success'
        })
        this.getAllcase()
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.deleteFail'),
          type: 'warning'
        })
      })
    },
    handleExceed (file, fileList) {
      if (fileList.length === 1) {
        this.$message.warning(this.$t('promptMessage.onlyOneFile'))
      }
    },
    handleChange (file, fileList) {
      this.addcaseForm.file.push(file.raw)
      this.$refs.addcaseForm.clearValidate(['file'])
    },
    handleDelte (file, fileList) {
      this.addcaseForm.file = fileList
      this.batchForm.batchFile = fileList
    },
    excelChange (file, fileList) {
      this.batchForm.batchFile.push(file.raw)
    },
    excelDelte (file, fileList) {
      this.batchForm.batchFile = fileList
    },
    languageChange (value) {
      this.editfile = true
      if (value === 'java') {
        this.DemoDownload = './javaExample.java'
      } else if (value === 'python') {
        this.DemoDownload = './pythonExample.py'
      } else if (value === 'jar') {
        this.DemoDownload = './JarExample.zip'
      }
    }
  },
  watch: {
    '$i18n.locale': function () {
      let language = localStorage.getItem('language')
      this.language = language
    },
    offsetPage (val, oldVal) {
      this.offsetPage = val
      this.getAllcase()
    },
    limitSize (val, oldVal) {
      this.limitSize = val
      this.getAllcase()
    }
  }
}
</script>

<style lang='less'>
  .padding100{
    padding: 0 100px;
  }
.testcase {
  .testcase-main {
    .enter-search{
      justify-content: space-between;
      .right-space{
        margin-right: 20px;
      }
      .questionIcon {
        margin-left: 10px;
          img{
            padding-top: 5px;
          }
      }
    }
    .testcase-content{
      padding: 20px 0;
      .el-button--text{
        color: #380879;
        font-size: 16px;
      }
      .el-button.configBtn{
        color: #7a6e8a;
        border: none;
        background-color: #efefef;
        padding: 5px 9px;
      }
    }
  }
  .addtestdialog{
    .el-form{
      width: 90%;
      .el-form-item {
         margin-bottom: 15px;
      }
      .el-form-item__label{
        line-height: 30px;
        padding-bottom: 10px;
      }
      .el-form-item__content{
        line-height: 15px;
      }
      .el-textarea__inner{
        height: 15px;
      }
      .el-select__tags-text{
        display: inline-block;
        max-width: 175px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .form-button{
        background-color: #f7f2ff !important;
        border: 1px solid #380879 !important;
        color: #380879;
        border-radius: 5px;
        box-shadow: 0 5px 5px #deccf9 !important;
      }
    }
  }
}
</style>

  function newFunction(item, configList) {
    if(item.hasOwnProperty('configIdList')) {
      item.configIdList.forEach(Id => {
        if(this.language==='cn') {
          configList.push(this.configCh.get(Id))
        } else {
          configList.push(this.configEh.get(Id))
        }
      })
      item.configNameList=configList.toString()
    } else {
      item.configNameList='/'
    }
  }
