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
      <div class="testCasetitle">
        <div class="title">
          {{ $t('atp.testCase') }}
        </div>
        <div class="case-main">
          <div class="test-tree">
            <el-tree
              :data="testCaseList"
              :props="defaultProps"
              node-key="id"
              ref="treeList"
              @node-click="handleNodeClick"
              default-expand-all
              highlight-current
            />
          </div>
          <div
            class="case-detail"
            v-for="(item, index) in caseDataTable"
            :key="index"
          >
            <el-row :gutter="20">
              <el-col :span="22">
                <h3>{{ $t('atp.caseName') }}</h3>
                <p>{{ item.name }}</p>
                <h3>{{ $t('atp.caseDetail') }}</h3>
                <p>{{ item.description }}</p>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="test-image">
        <img
          src="../../assets/images/test.png"
          alt
        >
      </div>
      <div>
        <div class="title">
          上传应用
        </div>
        <div style="width:500px,margin-left:30px">
          <el-form
            :model="packageForm"
            label-width="150px"
            :rules="rules"
          >
            <el-form-item
              :label="$t('atp.appPackage')"
              prop="fileList"
            >
              <el-upload
                ref="upload"
                action=""
                :limit="3"
                :on-exceed="handleExceed"
                :on-change="handleChange"
                :on-remove="handleDelte"
                :file-list="packageForm.fileList"
                :auto-upload="false"
                accept=".csar"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  type="primary"
                  plain
                >
                  {{ $t('atp.uploadApp') }}
                </el-button>
                <em
                  class="el-icon-warning"
                  style="margin-left:20px"
                />
                {{ $t('atp.onlyCsar') }}
                {{ $t('atp.packageSizeLimit') }}
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
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
    <!-- 依赖弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="$t('atp.dependencyDetail')"
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
      packageForm: {
        fileList: []
      },
      dialogVisible: false,
      testCaseList: [
        {
          label: '病毒扫描',
          // label: '安全性测试',
          children: []
        },
        {
          label: '遵从性测试',
          children: []
        },
        {
          label: '沙箱测试',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      caseDataDetail: [],
      caseDataTable: [],
      dependencyData: [],
      TestNumber: [
        {
          name: '病毒扫描',
          // name: '安全性测试',
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
      countvirus: 0,
      countcomp: 0,
      countsand: 0,
      rules: {
        fileList: [
          { required: true }
        ]
      }
    }
  },
  mounted () {
    this.getTestCase()
  },
  methods: {
    // 获取测试用例
    getTestCase () {
      Atp.getTestCaseApi().then(res => {
        this.caseDataDetail = res.data
        this.caseDataDetail.forEach(item => {
          let obj = {
            label: ''
          }
          obj.label = item.name
          if (item.type === 'virusScanningTest') {
            this.testCaseList[0].children.push(obj)
            this.countvirus++
          } else if (item.type === 'complianceTest') {
            this.testCaseList[1].children.push(obj)
            this.countcomp++
          } else {
            this.testCaseList[2].children.push(obj)
            this.countsand++
          }
        })
        this.$nextTick().then(() => {
          let arr = document.getElementsByClassName('el-tree-node')
          arr[1].click()
        })
        this.TestNumber[0].number = this.countvirus
        this.TestNumber[1].number = this.countcomp
        this.TestNumber[2].number = this.countsand
        this.caseDataTable.push(this.caseDataDetail[0])
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: this.$t('promptMessage.gettestcaseFail'),
          type: 'warning'
        })
      })
    },
    handleNodeClick (val) {
      this.caseDataTable = []
      this.caseDataDetail.forEach(item => {
        if (val.label === item.name) {
          this.caseDataTable.push(item)
        }
      })
    },
    startTest () {
      let fd = new FormData()
      let packageForm = this.packageForm
      fd.append('file', packageForm.fileList[0])
      this.dialogVisible = true
      Atp.getDependencyApi(fd).then(res => {
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
            message: this.$t('promptMessage.resolveFail'),
            type: 'warning'
          })
          this.dialogVisible = false
        }
      })
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
    },
    // 弹框页面
    ConfirmTest () {
      let fd = new FormData()
      let packageForm = this.packageForm
      // fd.append('file', packageForm.fileList[0])
      packageForm.fileList.forEach(function (item) {
        fd.append('file', item)
      })
      Atp.creatTaskApi(fd).then(res => {
        let taskId = res.data[0].id
        sessionStorage.setItem('taskId', taskId)
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
    handleExceed (file, fileList) {
      if (fileList.length === 1) {
        this.$message.warning(this.$t('promptMessage.onlyOneFile'))
      }
    },
    handleChange (file, fileList) {
      this.checkFileType(file, 'fileList', 'csar')
    },
    handleDelte (file, fileList) {
      this.packageForm.fileList = fileList
    },
    checkFileType (file, packageFormKey, fileType) {
      let type = file.raw.name.split('.')
      let fileSize = file.size / 1024 / 1024
      type = type[type.length - 1]
      if (type === fileType) {
        this.packageForm[packageFormKey].push(file.raw)
      } else {
        this.packageForm[packageFormKey] = []
        this.$message({
          duration: 2000,
          type: 'warning',
          message: this.$t('promptMessage.canOnlyUpload') + fileType + this.$t('promptMessage.files')
        })
      }
      if (fileSize > 10) {
        this.packageForm[packageFormKey] = []
        this.$message({
          duration: 2000,
          type: 'warning',
          message: this.$t('store.packageSizeLimit')
        })
      }
    }
  },
  watch: {
    '$i18n.locale': function () {
      let language = localStorage.getItem('language')
      this.language = language
      this.changeName()
    }
  }
}
</script>

<style lang='less'>
.testcase {
  .testcase-content {
    background: white;
    .testCasetitle{
      // padding-top: 20px;
      .case-main{
        display: flex;
        .test-tree{
          width: 300px;
          padding-top: 16px;
          margin-left: 30px;
          background-color: #e4efef;
          .el-tree{
            background-color: #e4efef;
            .el-tree-node__content{
              height: 30px;
              line-height: 30px;
              padding-left: 10px !important;
            }
            .el-tree-node.is-current>.el-tree-node__content{
              background-color: #a4c6ca;
              border-left: 2px solid #4b8c8c;
            }
            .el-tree-node__children{
              margin: 0 25px;
            }
          }
        }
        .case-detail{
          margin-left: 50px;
          width: 100%;
          p{
            font-size: 18px;
            padding: 15px 0;
            margin-bottom: 5px;
            border-bottom: solid 1px #eaecef;
          }
        }
      }
    }
    .test-image{
      text-align: center;
      margin-top: 10px;
      // img{
      //   width: 90%
      // }
    }
    .start-button{
        text-align: center;
        margin: 30px 0;
        #start_test_button{
          transform:translateX(-49px);
          // color: #fff;
          // background-color: #5abdc7;
          // border-color: #5abdc7;
          // margin: auto;
        }
      }
    .title {
      margin: 15px 0;
      font-size: 18px;
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
