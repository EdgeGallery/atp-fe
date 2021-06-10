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
      <div style="margin:20px 0;font-size:14px;color: #1C1C1C;">
        <span>{{ $t('testCase.applicationTestPlatform') }}</span>
        <span>></span>
        <span>{{ $t('atp.testCaseManagement') }}</span>
      </div>
      <div
        class="testcase-main"
      >
        <div class="flex enter-search">
          <div class="flex">
            <el-input
              v-model="form.name"
              prefix-icon="el-icon-search"
              :placeholder="$t('testCase.provideNameSearch')"
              size="small"
            />
            <el-select
              size="small"
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
              size="small"
              v-model="form.testSuiteIdList"
              class="statusSelect"
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
              class="light-button"
              size="small"
              @click="resetForm"
            >
              {{ $t('myApp.reset') }}
            </el-button>
            <el-button
              class="dark-button"
              size="small"
              @click="getAllcase()"
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
          <div>
            <el-button
              v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1"
              class="light-button"
              size="small"
              @click="excelBringBtn"
            >
              {{ this.$t('modelmgmt.import') }}
            </el-button>
            <el-button
              v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1"
              class="dark-button"
              size="small"
              @click="addTestBtn"
            >
              {{ $t('testCase.add') }}
            </el-button>
          </div>
        </div>
        <div class="testcase-content">
          <el-table
            :data="currentData"
            header-cell-class-name="headerStyle"
          >
            <el-table-column
              prop="nameCh"
              :label="$t('testCase.caseName')"
            >
              <template slot-scope="scope">
                <el-tooltip
                  effect="light"
                  :content="$t('userpage.clickDownloadCase')"
                  placement="right"
                  v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1"
                >
                  <el-button
                    type="text"
                    @click="downLoadCase(scope.row)"
                  >
                    {{ language==='cn'?scope.row.nameCh :scope.row.nameEn }}
                  </el-button>
                </el-tooltip>
                <span v-else>{{ language==='cn'?scope.row.nameCh :scope.row.nameEn }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="testSuiteNameList"
              :label="$t('testCase.testSuiteList')"
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
              width="180"
              v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1"
            >
              <template slot-scope="scope">
                <el-button
                  class="light-button"
                  size="small"
                  @click="deleteCase(scope.row)"
                >
                  {{ $t('testCase.delete') }}
                </el-button>
                <el-button
                  class="dark-button"
                  size="small"
                  @click="editCase(scope.row)"
                >
                  {{ $t('testCase.edit') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            style="margin-top: 20px"
          >
            <pagination
              :table-data="allcaseData"
              @getCurrentPageData="getCurrentPageData"
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
        class="addtestdialog"
      >
        <el-form
          :model="addcaseForm"
          label-width="150px"
          ref="addcaseForm"
        >
          <el-form-item
            :label="$t('testCase.nameCn')"
            prop="nameCh"
            :rules="confirmBtnApi === 'add'?rules.nameCh:kongrules"
          >
            <el-input
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
            :rules="confirmBtnApi === 'add'?rules.type:kongrules"
          >
            <el-select
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
            :rules="confirmBtnApi === 'add'?rules.descriptionCh:kongrules"
          >
            <el-input
              v-model="addcaseForm.descriptionCh"
              type="textarea"
              autosize
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.descriptionEn')"
            prop="descriptionEn"
          >
            <el-input
              v-model="addcaseForm.descriptionEn"
              type="textarea"
              autosize
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.expecteCn')"
            prop="expectResultCh"
            :rules="confirmBtnApi === 'add'?rules.expectResultCh:kongrules"
          >
            <el-input
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
              size="small"
              type="textarea"
              v-model="addcaseForm.expectResultEn"
              maxlength="255"
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.language')"
            prop="codeLanguage"
            :rules="confirmBtnApi === 'add'?rules.codeLanguage:kongrules"
          >
            <el-select
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
            :rules="confirmBtnApi === 'add'?rules.testSuiteIdList:kongrules.testSuiteIdList"
          >
            <el-select
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
            :rules="confirmBtnApi === 'add'?rules.testStepCh:kongrules"
          >
            <el-input
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
                class="form-button"
              >
                {{ $t('testCase.import') }}
              </el-button>
              <a
                :href="DemoDownload"
                download
                style="padding-left:10px;"
              >
                <el-button
                  class="form-button"
                  slot="trigger"
                  size="small"
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
            style="margin-right:40px;"
            class="light-button"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            id="upload_package_ipload"
            class="dark-button"
            @click="confirmAddCase"
          >
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="addExcelVisible"
        :close-on-click-modal="false"
        width="30%"
        title="导入测试用例"
        class="addtestdialog"
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
                class="form-button"
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
                  class="form-button"
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
            class="light-button"
            size="small"
            style="margin-right:40px;"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            id="upload_package_ipload"
            size="small"
            @click="BatchImport"
            class="dark-button"
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
        class="prompt-dialog"
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
            class="light-button"
            @click="deleteVisibleClose"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            class="dark-button"
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
import { Atp, ModelMgmt } from '../../tools/api.js'
import pagination from '../../components/common/Pagination.vue'
import Navcomp from '../../components/layout/Nav.vue'
export default {
  components: { pagination, Navcomp },
  name: 'TestCase',
  data () {
    return {
      language: localStorage.getItem('language'),
      userName: sessionStorage.getItem('userName'),
      authorities: sessionStorage.getItem('authorities'),
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
      allcaseData: [],
      currentData: [],
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
        file: []
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
      kongrules: {
        testSuiteIdList: [
          { required: false }
        ]
      },
      rules: {
        nameCh: [
          { required: true, message: this.$t('testCase.pleaseInput'), trigger: 'blur' }
        ],
        descriptionCh: [
          { required: true, message: this.$t('testCase.pleaseInput'), trigger: 'blur' }
        ],
        codeLanguage: [
          { required: true, message: this.$t('userpage.choose'), trigger: 'blur' }
        ],
        expectResultCh: [
          { required: true, message: this.$t('testCase.pleaseInput'), trigger: 'blur' }
        ],
        testSuiteIdList: [
          { required: true, message: this.$t('userpage.choose') }
        ],
        testStepCh: [
          { required: true, message: this.$t('testCase.pleaseInput'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: this.$t('userpage.choose'), trigger: 'blur' }
        ],
        file: [
          { required: true, message: this.$t('userpage.choose'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getAllcase()
  },
  methods: {
    getCurrentPageData (val) {
      this.currentData = val
    },
    resetForm () {
      this.form = {
        testSuiteList: [],
        name: '',
        type: '',
        locale: ''
      }
      this.getAllcase()
    },
    async getAllcase () {
      await this.getALlSuites()
      this.allcaseData = []
      this.form.locale = this.language === 'cn' ? 'ch' : 'en'
      Atp.getAllCaseApi(this.form).then(res => {
        this.allcaseData = res.data
        this.allcaseData.forEach(item => {
          let testSuiteList = []
          item.testSuiteIdList.forEach(Id => {
            if (this.language === 'cn') {
              testSuiteList.push(this.mapCh.get(Id))
            } else {
              testSuiteList.push(this.mapEn.get(Id))
            }
          })
          item.testSuiteNameList = testSuiteList.toString()
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.gettestcaseFail'),
          type: 'warning'
        })
      })
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
        file: []
      }
    },
    confirmAddCase () {
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
      if (this.confirmBtnApi === 'add') {
        fd.append('file', addcaseForm.file[0])
        if (!addcaseForm.nameCh) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.nameEmpty')
          })
        } else if (!addcaseForm.type) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.typeEmpty')
          })
        } else if (!addcaseForm.descriptionCh) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.descriptionEmpty')
          })
        } else if (!addcaseForm.expectResultCh) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.expectResultEmpty')
          })
        } else if (!addcaseForm.testStepCh) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.testStepEmpty')
          })
        } else if (addcaseForm.file.length === 0) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.fileEmpty')
          })
        } else if (addcaseForm.testSuiteIdList.length === 0) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.testSuiteEmpty')
          })
        } else {
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
        }
      } else if (this.confirmBtnApi === 'edit') {
        if (!addcaseForm.descriptionCh || !addcaseForm.descriptionEn) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.descriptionEmpty')
          })
        } else if (!addcaseForm.expectResultCh || !addcaseForm.expectResultEn) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.expectResultEmpty')
          })
        } else if (!addcaseForm.testStepCh || !addcaseForm.testStepEn) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.testStepEmpty')
          })
        } else if (addcaseForm.testSuiteIdList.length === 0) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: this.$t('promptMessage.testSuiteEmpty')
          })
        } else {
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
      }
      this.editfile = false
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
    editCase (row) {
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
    background: #fff;
    padding: 15px 15px 35px;
    .enter-search{
      justify-content: space-between;
      height: 34px;
      .el-select{
        width: auto!important;
      }
      .el-input{
        margin-right: 20px;
        width: auto!important;
      }
      .el-input__inner{
        border: 1px solid #380879;
      }
      .el-input__inner:focus {
        outline: none;
        border-color: #380879;
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
      .form-button{
        background-color: #f7f2ff;
        border: 1px solid #380879;
        color: #380879;
        border-radius: 5px;
        box-shadow: 0 5px 5px #deccf9;
      }
    }
  }
}
</style>
