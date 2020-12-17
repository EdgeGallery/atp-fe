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
  <div class="testcase padding56">
    <div class="testcase-content padding20">
      <div class="title">
        {{ $t('testCase.management') }}
      </div>
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
                <el-input
                  size="small"
                  id="type"
                  v-model="form.type"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              :offset="2"
            >
              <el-form-item
                id="verificationModel"
                :label="$t('testCase.model')"
              >
                <el-select
                  size="small"
                  v-model="form.verificationModel"
                  class="statusSelect"
                >
                  <el-option
                    v-for="item in models"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
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
              @click="getAllcase"
            >
              {{ $t('myApp.inquire') }}
            </el-button>
          </div>
        </el-form>
      </div>
      <div
        class="addbtn"
        style="text-align:right;margin-right:20px,margin-bottom:5px"
      >
        <el-button
          type="primary"
          size="small"
          @click="addTestBtn"
        >
          {{ $t('testCase.add') }}
        </el-button>
      </div>
      <div>
        <el-table
          :data="allcaseData"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="$t('testCase.caseName')"
          />
          <el-table-column
            prop="type"
            :label="$t('testCase.caseType')"
          />
          <el-table-column
            prop="description"
            :label="$t('testCase.casePurpose')"
          />
          <el-table-column
            prop="expectResult"
            :label="$t('testCase.expectedResult')"
          />
          <el-table-column
            prop="codeLanguage"
            :label="$t('testCase.language')"
          />
          <el-table-column
            prop="verificationModel"
            :label="$t('testCase.verificationModel')"
          />
          <el-table-column
            :label="$t('testCase.operation')"
            width="160px"
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
      </div>
      <div class="start-button">
        <el-button
          id="start_test_button"
          type="primary"
          size="large"
          @click="startTest"
        >
          {{ $t('atp.startTest') }}
        </el-button>
      </div>
    </div>
    <!-- 新增用例弹框 -->
    <el-dialog
      :visible.sync="addCaseVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
      width="30%"
      class="addtestdialog"
    >
      <el-form
        :model="addcaseForm"
        label-width="110px"
      >
        <el-form-item
          :label="$t('testCase.caseName')"
          prop="name"
        >
          <el-input
            width="100px"
            size="small"
            v-model="addcaseForm.name"
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
          >
            <el-option
              v-for="item in testType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('testCase.casePurpose')"
          prop="description"
        >
          <el-input
            v-model="addcaseForm.description"
            type="textarea"
            autosize
          />
        </el-form-item>
        <el-form-item
          :label="$t('testCase.expectedResult')"
          prop="expectResult"
        >
          <el-input
            size="small"
            v-model="addcaseForm.expectResult"
          />
        </el-form-item>
        <el-form-item
          :label="$t('testCase.language')"
          prop="codeLanguage"
        >
          <el-select
            size="small"
            v-model="addcaseForm.codeLanguage"
            @change="languageChang"
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
          :label="$t('testCase.verificationModel')"
          prop="verificationModel"
        >
          <el-select
            size="small"
            v-model="addcaseForm.verificationModel"
            multiple
          >
            <el-option
              v-for="item in models"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
            accept=".java,.py"
          >
            <el-button
              slot="trigger"
              size="small"
              plain
            >
              {{ $t('testCase.import') }}
            </el-button>
            <a
              :href="addcaseForm.codeLanguage==='java' ? './javaExample.java' : './pythonExample.py'"
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
    <!-- 依赖弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="$t('atp.dependencyDetail')"
      :close-on-click-modal="false"
      class="dependency-detail"
    >
      <div>
        <h3>{{ $t('atp.versionDependency') }}：</h3>
        <el-table
          :data="dependencyData"
        >
          <el-table-column
            prop="name"
            :label="$t('atp.packageName')"
          />
          <el-table-column
            prop="version"
            :label="$t('atp.version')"
          />
        </el-table>
      </div>
      <div>
        <h3>{{ $t('atp.testTask') }}</h3>
        <el-table
          :data="TestNumber"
        >
          <el-table-column
            prop="name"
            :label="$t('atp.testItems')"
          />
          <el-table-column
            prop="number"
            :label="$t('atp.caseNumber')"
          />
        </el-table>
      </div>
      <div
        class="button-center"
      >
        <el-button
          type="primary"
          @click="cancel()"
          plain
        >
          {{ $t('atp.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="ConfirmTest()"
        >
          {{ $t('atp.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Atp } from '../../tools/api.js'
import { TESTNAME } from '../../tools/testdataname.js'
export default {
  name: 'TestCase',
  data () {
    return {
      // // del
      // packageForm: {
      //   fileList: []
      // },

      currUrl: window.location.href,
      taskId: '',
      dialogVisible: false,
      // testCaseList: [
      //   {
      //     label: '安全测试',
      //     // label: '安全性测试',
      //     children: []
      //   },
      //   {
      //     label: '遵从性测试',
      //     children: []
      //   },
      //   {
      //     label: '沙箱测试',
      //     children: []
      //   }
      // ],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      // caseDataDetail: [],
      caseDataTable: [],
      dependencyData: [],
      TestNumber: [
        {
          name: '安全测试',
          number: ''
        },
        {
          name: '遵从性测试',
          number: ''
        },
        {
          name: '沙箱测试',
          number: ''
        }
      ],
      // countvirus: 0,
      // countcomp: 0,
      // countsand: 0,
      form: {
        name: '',
        type: '',
        verificationModel: ''
      },
      models: [
        {
          value: 'Edgegallery',
          label: '社区标准'
        },
        {
          value: 'Mobile',
          label: '移动企标'
        },
        {
          value: 'Unicom',
          label: '联通企标'
        },
        {
          value: 'Telecom',
          label: '电信企标'
        },
        {
          value: 'Definition',
          label: '自定义标准'
        }
      ],
      codeLanguages: [
        {
          value: 1,
          label: 'java'
        }, {
          value: 2,
          label: 'python'
        }
      ],
      testType: [
        {
          value: 'securityTest',
          label: '安全测试'
        }, {
          value: 'complianceTest',
          label: '遵从性测试'
        }, {
          value: 'sandboxTest',
          label: '沙箱测试'
        }
      ],
      allcaseData: [],
      addCaseVisible: false,
      confirmBtnApi: '',
      dialogTitle: '',
      editid: '',
      cannotEdit: false,
      addcaseForm: {
        name: '',
        type: '',
        description: '',
        expectResult: '',
        codeLanguage: '',
        verificationModel: [],
        file: []
      },
      editfile: false,
      addrules: {
        name: [
          { required: true, message: '用例名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '用例类型不能为空', trigger: 'change' }
        ],
        description: [
          { required: true, message: '用例目的不能为空', trigger: 'blur' }
        ],
        expectResult: [
          { required: true, message: '预期结果不能为空', trigger: 'blur' }
        ],
        codeLanguage: [
          { required: true, message: '语言不能为空', trigger: 'change' }
        ],
        verificationModel: [
          { required: true, message: '描述不能为空', trigger: 'change' }
        ],
        file: [
          { required: true }
        ]
      },
      editrules: {
        name: [
          { required: true, message: '用例名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '用例类型不能为空', trigger: 'change' }
        ],
        description: [
          { required: true, message: '用例目的不能为空', trigger: 'blur' }
        ],
        expectResult: [
          { required: true, message: '预期结果不能为空', trigger: 'blur' }
        ],
        codeLanguage: [
          { required: true, message: '语言不能为空', trigger: 'change' }
        ],
        verificationModel: [
          { required: true, message: '描述不能为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getTaskId()
    this.getAllcase()
    // this.linshiceshi()
  },
  methods: {
    resetForm () {
      this.form = {
        name: '',
        type: '',
        verificationModel: ''
      }
      this.getAllcase()
    },
    // 获取所有测试用例
    // 临时测试
    // linshiceshi () {
    //   let data = this.allcaseData
    //   data.forEach(item => {
    //     console.log(item.type)
    //   })
    // },
    getAllcase () {
      this.allcaseData = []
      Atp.getAllCaseApi(this.form).then(res => {
        this.allcaseData = res.data
        this.allcaseData.forEach(item => {
          if (item.type === 'securityTest') {
            this.TestNumber[0].number++
          } else if (item.type === 'complianceTest') {
            this.TestNumber[1].number++
          } else {
            this.TestNumber[2].number++
          }
        })
      }).catch(() => {
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
        name: '',
        type: '',
        description: '',
        expectResult: '',
        codeLanguage: '',
        verificationModel: [],
        file: []
      }
    },
    confirmAddCase () {
      let fd = new FormData()
      let addcaseForm = this.addcaseForm
      fd.append('name', addcaseForm.name)
      fd.append('type', addcaseForm.type)
      fd.append('description', addcaseForm.description)
      fd.append('codeLanguage', addcaseForm.codeLanguage)
      fd.append('expectResult', addcaseForm.expectResult)
      fd.append('verificationModel', addcaseForm.verificationModel)
      if (this.confirmBtnApi === 'add') {
        fd.append('file', addcaseForm.file[0])
        Atp.createCaseApi(fd).then(res => {
          this.addCaseVisible = false
          this.getAllcase()
        }).catch(() => {
          this.$message({
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
          fd.append('file', addcaseForm.file)
        }
        Atp.editCaseApi(fd).then(res => {
          this.addCaseVisible = false
          this.getAllcase()
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
      this.addcaseForm.verificationModel = row.verificationModel.split(',')
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
    // 获取iframe的taskid
    getTaskId () {
      if (this.currUrl.indexOf('?') !== -1) {
        this.taskId = this.currUrl.split('?')[1].split('=')[1]
        sessionStorage.setItem('taskId', this.taskId)
      } else {
        let params = sessionStorage.getItem('taskId')
        this.taskId = params
      }
    },
    // old 获取测试用例
    // getTestCase () {
    //   Atp.getTestCaseApi().then(res => {
    //     this.caseDataDetail = res.data
    //     this.caseDataDetail.forEach(item => {
    //       let obj = {
    //         label: ''
    //       }
    //       obj.label = item.name
    //       if (item.type === 'securityTest') {
    //         this.testCaseList[0].children.push(obj)
    //         this.countvirus++
    //       } else if (item.type === 'complianceTest') {
    //         this.testCaseList[1].children.push(obj)
    //         this.countcomp++
    //       } else {
    //         this.testCaseList[2].children.push(obj)
    //         this.countsand++
    //       }
    //     })
    //     this.$nextTick().then(() => {
    //       let arr = document.getElementsByClassName('el-tree-node')
    //       arr[1].click()
    //     })
    //     this.TestNumber[0].number = this.countvirus
    //     this.TestNumber[1].number = this.countcomp
    //     this.TestNumber[2].number = this.countsand
    //     this.caseDataTable.push(this.caseDataDetail[0])
    //   }).catch(() => {
    //     this.$message({
    //       duration: 2000,
    //       message: this.$t('promptMessage.gettestcaseFail'),
    //       type: 'warning'
    //     })
    //   })
    // },
    // del tree
    // handleNodeClick (val) {
    //   this.caseDataTable = []
    //   this.caseDataDetail.forEach(item => {
    //     if (val.label === item.name) {
    //       this.caseDataTable.push(item)
    //     }
    //   })
    // },
    // 联调暂时注释del
    startTest () {
      this.getDependency()
    },
    getDependency () {
      Atp.getDependencyApi(this.taskId).then(res => {
        this.dialogVisible = true
        let data = res.data.dependency
        this.dependencyData = []
        for (const key in data) {
          let obj = {
            name: '',
            version: ''
          }
          obj.name = key
          obj.version = data[key]
          this.dependencyData.push(obj)
        }
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: this.$t('promptMessage.resolveFail'),
          type: 'warning'
        })
        this.dialogVisible = false
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
    languageChang (value) {
      this.editfile = true
    },
    // 创建测试任务，联调使用，后续删除;
    // startTest () {
    //   let fd = new FormData()
    //   let packageForm = this.packageForm
    //   fd.append('file', packageForm.fileList[0])
    //   fd.append('isRun', false)
    //   this.dialogVisible = true
    //   Atp.creatTaskApi(fd).then(res => {
    //     this.dialogVisible = true
    //     this.taskId = res.data.id
    //     this.getDependency()
    //     // let data = res.data.dependency
    //     // this.dependencyData = []
    //     // for (const key in data) {
    //     //   let obj = {
    //     //     name: '',
    //     //     version: ''
    //     //   }
    //     //   obj.name = key
    //     //   obj.version = data[key]
    //     //   this.dependencyData.push(obj)
    //     // }
    //   })
    // },
    // 依赖弹框
    ConfirmTest () {
      Atp.runTaskApi(this.taskId).then(res => {
        // let taskId = res.data.id
        // sessionStorage.setItem('taskId', taskId)
        this.dialogVisible = false
        this.$router.push('/atpprocess')
      }).catch(error => {
        if (error.response.data.code === 403) {
          this.$message({
            duration: 2000,
            message: this.$t('promptMessage.guestUser'),
            type: 'warning'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            duration: 2000,
            message: this.$t('promptMessage.creattaskFail'),
            type: 'warning'
          })
          this.dialogVisible = false
        }
      })
    },
    cancel () {
      this.dialogVisible = false
    },
    changeName () {
      if (this.language === 'en') {
        this.testCaseList[0].label = this.TestNumber[0].name = TESTNAME[0].label[1]
        this.testCaseList[1].label = this.TestNumber[1].name = TESTNAME[1].label[1]
        this.testCaseList[2].label = this.TestNumber[2].name = TESTNAME[2].label[1]
      } else if (this.language === 'cn') {
        this.testCaseList[0].label = this.TestNumber[0].name = TESTNAME[0].label[0]
        this.testCaseList[1].label = this.TestNumber[1].name = TESTNAME[1].label[0]
        this.testCaseList[2].label = this.TestNumber[2].name = TESTNAME[2].label[0]
      }
    }
    // 联调后 del
    // handleDelteAPP (file, fileList) {
    //   this.packageForm.file = fileList
    // },
    // handleChangeAPP (file, fileList) {
    //   this.checkFileType(file, 'fileList', 'csar')
    // },
    // // del
    // checkFileType (file, packageFormKey, fileType) {
    //   let type = file.raw.name.split('.')
    //   let fileSize = file.size / 1024 / 1024
    //   type = type[type.length - 1]
    //   if (type === fileType) {
    //     this.packageForm[packageFormKey].push(file.raw)
    //   } else {
    //     this.packageForm[packageFormKey] = []
    //     this.$message({
    //       duration: 2000,
    //       type: 'warning',
    //       message: this.$t('promptMessage.canOnlyUpload') + fileType + this.$t('promptMessage.files')
    //     })
    //   }
    //   if (fileSize > 10) {
    //     this.packageForm[packageFormKey] = []
    //     this.$message({
    //       duration: 2000,
    //       type: 'warning',
    //       message: this.$t('store.packageSizeLimit')
    //     })
    //   }
    // }
  },
  watch: {
    '$i18n.locale': function () {
      let language = localStorage.getItem('language')
      this.language = language
      // this.changeName()
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
        margin: 30px 0;
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
