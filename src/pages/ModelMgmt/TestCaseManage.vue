<!--
  -  Copyright 2020 Huawei Technologies Co., Ltd.
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
    <div class="testcase padding56">
      <div style="margin:20px 0">
        <span>应用测试平台</span>
        <span>></span>
        <span>测试用例管理</span>
      </div>
      <div
        class="testcase-content padding20"
        style="margin-top: 10px;"
      >
        <div style="text-align:center">
          <el-form
            ref="form"
            :model="form"
            label-width="150px"
          >
            <el-row>
              <el-col
                :span="6"
              >
                <el-form-item :label="$t('testCase.caseName')">
                  <el-input
                    size="small"
                    id="name"
                    v-model="form.name"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                :offset="2"
              >
                <el-form-item
                  :label="$t('testCase.caseType')"
                >
                  <el-select
                    size="small"
                    v-model="form.type"
                    class="statusSelect"
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
              </el-col>
              <el-col
                :span="6"
                :offset="2"
              >
                <el-form-item
                  :label="$t('testCase.testSuiteList')"
                >
                  <el-select
                    size="small"
                    v-model="form.testSuiteIdList"
                    class="statusSelect"
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
              </el-col>
            </el-row>
            <div class="search-btn">
              <el-button
                id="resetBtn"
                size="small"
                @click="resetForm"
              >
                {{ $t('myApp.reset') }}
              </el-button>
              <el-button
                id="inquireBtn"
                type="primary"
                size="small"
                @click="getAllcase()"
              >
                {{ $t('myApp.inquire') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <div
          class="addbtn"
        >
          <el-button
            v-if="userName==='admin'"
            type="primary"
            size="small"
            @click="addTestBtn"
          >
            {{ $t('testCase.add') }}
          </el-button>
        </div>
        <div>
          <el-table
            :data="currentData"
            style="width: 100%"
          >
            <el-table-column
              prop="nameCh"
              :label="$t('testCase.caseName')"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="downLoadCase(scope.row)"
                >
                  {{ language==='cn'?scope.row.nameCh :scope.row.nameEn }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="testSuiteIdList"
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
            >
              <template slot-scope="scope">
                {{ language==='en'?scope.row.type:scope.row.type==='automatic'?'自动化类型':'手动类型' }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('testCase.operation')"
              v-if="userName==='admin'"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="text"
                  class="deleteBtn"
                  @click="deleteCase(scope.row)"
                >
                  {{ $t('testCase.delete') }}
                </el-button>
                <el-button
                  size="medium"
                  type="text"
                  class="editBtn"
                  @click="editCase(scope.row)"
                >
                  {{ $t('testCase.edit') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            style="padding: 55px 0;"
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
        width="40%"
        class="addtestdialog"
      >
        <el-form
          :model="addcaseForm"
          label-width="150px"
        >
          <el-form-item
            :label="$t('testCase.nameCn')"
            prop="nameCh"
          >
            <el-input
              width="100px"
              size="small"
              v-model="addcaseForm.nameCh"
              :disabled="cannotEdit"
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
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.caseType')"
            prop="type"
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
          >
            <el-input
              v-model="addcaseForm.descriptionCh"
              type="textarea"
              autosize
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
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.expecteCn')"
            prop="expectResultCh"
          >
            <el-input
              size="small"
              type="textarea"
              v-model="addcaseForm.expectResultCh"
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
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.language')"
            prop="codeLanguage"
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
          >
            <el-input
              size="small"
              type="textarea"
              v-model="addcaseForm.testStepCh"
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
            />
          </el-form-item>
          <el-form-item
            :label="$t('testCase.import')"
            prop="file"
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
                plain
              >
                {{ $t('testCase.import') }}
              </el-button>
              <a
                :href="DemoDownload"
                download
                style="padding-left:10px;"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  type="primary"
                  plain
                >
                  {{ $t('testCase.sample') }}
                </el-button>
              </a>
            </el-upload>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            id="upload_package_close"
            @click="handleClose"
            size="small"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            id="upload_package_ipload"
            type="primary"
            size="small"
            @click="confirmAddCase"
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
      editfile: false,
      DemoDownload: './javaExample.java'
    }
  },
  mounted () {
    this.getAllcase()
    this.getALlSuites()
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
    // 获取所有测试用例
    getAllcase () {
      this.allcaseData = []
      this.form.locale = this.language === 'cn' ? 'ch' : 'en'
      Atp.getAllCaseApi(this.form).then(res => {
        this.allcaseData = res.data
        this.allcaseData.forEach(item => {
        // 测试套
          let testSuiteListCh = []
          let testSuiteListEn = []
          item.testSuiteIdList.forEach(testSuiteId => {
            ModelMgmt.getOneSuite(testSuiteId).then(testSuite => {
              let data = testSuite.data
              testSuiteListCh.push(data.nameCh)
              testSuiteListEn.push(data.nameEn)
            })
          })
          item.testSuiteId = item.testSuiteIdList
          if (this.language === 'cn') {
            item.testSuiteIdList = testSuiteListCh.toString()
          } else {
            item.testSuiteIdList = testSuiteListEn.toString()
          }
        })
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: this.$t('promptMessage.gettestcaseFail'),
          type: 'warning'
        })
      })
    },
    getALlSuites () {
      ModelMgmt.getTestSuite().then(res => {
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
        })
      }).catch(() => {})
    },
    downLoadCase (row) {
      Atp.downLoadCaseApi(row.id).then(res => {
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
    // 新增用例弹框
    handleClose () {
      this.addCaseVisible = false
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
        Atp.createCaseApi(fd).then(res => {
          this.addCaseVisible = false
          this.getAllcase()
          this.$message({
            duration: 2000,
            showClose: true,
            message: '创建成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: '创建失败',
            type: 'warning'
          })
          this.addCaseVisible = false
        })
      } else if (this.confirmBtnApi === 'edit') {
        fd.append('id', this.editid)
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
        Atp.editCaseApi(fd).then(res => {
          this.addCaseVisible = false
          this.getAllcase()
          this.$message({
            showClose: true,
            duration: 2000,
            message: '修改成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            duration: 2000,
            message: '修改失败',
            type: 'warning'
          })
          this.addCaseVisible = false
        })
      }
      this.editfile = false
    },
    editCase (row) {
      this.editid = row.id
      this.confirmBtnApi = 'edit'
      this.dialogTitle = this.$t('testCase.editCase')
      this.cannotEdit = true
      this.addCaseVisible = true
      this.addcaseForm = JSON.parse(JSON.stringify(row))
      this.addcaseForm.file = []
      this.addcaseForm.testSuiteIdList = row.testSuiteId
    },
    deleteCase (row) {
      this.$confirm(this.$t('promptMessage.deletePrompt'), this.$t('promptMessage.prompt'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        Atp.deleteCaseApi(row.id).then(res => {
          this.$message({
            duration: 2000,
            message: '删除成功',
            type: 'success'
          })
          this.getAllcase()
        }).catch(() => {
          this.$message({
            duration: 2000,
            message: '删除失败',
            type: 'warning'
          })
        })
      }).catch(() => {
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
.testcase {
  .testcase-content {
    background: white;
    .el-table thead {
      color: #686a6f;
      font-weight: 800;
      th{
        background: #d6e3f1;
      }
    }
    .addbtn{
      text-align:right;
      margin-right:20px;
      margin-bottom:5px;
    }
    .deleteBtn{
      color: #fff;
      background-color: #e4905e;
      padding: 5px 10px;
    }
    .editBtn{
      background-color: #4d9aea;
      padding: 5px 10px;
      color: #fff;
      // color: #7597f4;
    }
    .start-button{
        text-align: center;
        margin: 55px 0;
        #start_test_button{
          transform:translateX(-49px);
        }
      }
    .title {
      margin: 15px 0;
      font-size: 16px;
      color: #616367e3;
    }
    .title::before {
      content: "";
      display: inline-block;
      width: 3px;
      background: #3399ff;
      height: 20px;
      position: relative;
      top: 5px;
    }
  }
  .el-dialog__header{
    background-color: #688ef3 ;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
  .addtestdialog{
    .el-form{
      width: 80%;
    }
  .dialog-footer{
      text-align: center;
    }
  }

  .dependency-detail{
    .button-center{
      text-align:center;
      margin-top: 10px;
    }
    h3{
      margin-bottom: 15px;
    }
  }
}
</style>
