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
    <div
      class="selectscene padding20"
      id="selectscene"
    >
      <div class="toptitle">
        <div class="left">
          {{ $t('userpage.selectScene') }}
        </div>
        <el-tooltip
          :content="$t('userpage.clickContribution')"
          placement="left"
        >
          <div
            class="right"
            @click="addCaseVisible = true"
          >
            {{ $t('userpage.contribution') }}
          </div>
        </el-tooltip>
      </div>
      <div class="scene-main">
        <div
          class="contednt"
          v-for="(item,index) in sceneData"
          :key="index"
        >
          <div class="scene">
            <div class="scenariosLogo">
              <img
                :src="getAppIcon(item)"
                alt=""
                class="sceneimage"
              >
              <el-button
                class="select-button"
                type="text"
                :disabled="item.nameEn==='EdgeGallery Community Scenario'"
                @click="chooseScene(item)"
              >
                <img
                  src="../../assets/images/selected.png"
                  alt=""
                  v-if="item.selected"
                >
                <img
                  v-else
                  src="../../assets/images/notselected.png"
                  alt=""
                >
              </el-button>
            </div>
            <div class="choose">
              <el-form
                label-width="auto"
              >
                <el-form-item :label="$t('modelmgmt.name')">
                  {{ language==='cn'?item.nameCh:item.nameEn }}
                </el-form-item>
                <el-form-item :label="$t('modelmgmt.description')">
                  {{ language==='cn'?item.descriptionCh:item.descriptionEn }}
                </el-form-item>
              </el-form>
            </div>
            <div class="choose-button">
              <el-button
                type="text"
                class="curp"
                @click="getDetail(item)"
              >
                {{ $t('userpage.seeDetail') }}
              </el-button>
              <span class="middleLine" />
              <el-button
                type="text"
                :disabled="item.nameEn==='EdgeGallery Community Scenario'"
                class="curp"
                @click="chooseScene(item)"
              >
                {{ $t('userpage.selectTestScene') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="start-button">
        <el-button
          v-if="userName!=='guest'"
          class="dark-button"
          size="large"
          @click="startTest()"
        >
          {{ $t('atp.startTest') }}
        </el-button>
      </div>
    </div>
    <!-- case detail -->
    <el-dialog
      :visible.sync="CaseVisible"
      :title="$t('userpage.caseDetail')"
    >
      <p>{{ scenarioName }}</p>
      <el-collapse
        :value="opened"
        v-if="!testSuitesNocase"
      >
        <el-collapse-item
          v-for="(item,index) in testSuiteData"
          :key="index"
          :title="language==='cn'?item.nameCh:item.nameEn"
          :name="item.nameEn"
        >
          <el-table
            :data="item.testCases"
          >
            <el-table-column
              :label="$t('userpage.name')"
            >
              <template scope="scope">
                {{ language==='cn'?scope.row.nameCh:scope.row.nameEn }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('userpage.type')"
            >
              <template scope="scope">
                {{ language==='en'?scope.row.type:scope.row.type==='automatic'?'自动化类型':'手动类型' }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('userpage.description')"
            >
              <template scope="scope">
                {{ language==='cn'?scope.row.descriptionCh:scope.row.descriptionEn }}
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <span
        v-else
        style="font-size:18px; padding-left: 8px;"
      >{{ this.$t('promptMessage.noCase') }}</span>
      <div
        slot="footer"
      >
        <el-button
          class="dark-button"
          @click="handleClose()"
        >
          {{ $t('common.close') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="addCaseVisible"
      :title="$t('userpage.contribution')"
      :close-on-click-modal="false"
      width="30%"
      class="addCasedialog"
    >
      <el-form
        :model="addcaseForm"
        label-width="110px"
        ref="addcaseForm"
        :rules="rules"
      >
        <el-form-item
          :label="$t('testCase.caseName')"
          prop="name"
        >
          <el-input
            width="100px"
            size="small"
            v-model="addcaseForm.name"
            maxlength="64"
          />
        </el-form-item>
        <el-form-item
          :label="$t('testCase.casePurpose')"
          prop="objective"
        >
          <el-input
            v-model="addcaseForm.objective"
            type="textarea"
            autosize
            maxlength="255"
          />
        </el-form-item>
        <el-form-item
          :label="$t('testCase.step')"
          prop="step"
        >
          <el-input
            v-model="addcaseForm.step"
            type="textarea"
            autosize
            maxlength="255"
          />
        </el-form-item>
        <el-form-item
          :label="$t('testCase.expectedResult')"
          prop="expectResult"
        >
          <el-input
            size="small"
            v-model="addcaseForm.expectResult"
            maxlength="255"
          />
        </el-form-item>
        <el-form-item
          :label="$t('testCase.type')"
          prop="type"
        >
          <el-select
            v-model="addcaseForm.type"
            :placeholder="$t('userpage.choose')"
          >
            <el-option
              :label="language==='cn'?'文本':'text'"
              value="text"
            />
            <el-option
              :label="language==='cn'?'脚本':'script'"
              value="script"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="addcaseForm.type==='script'"
          :label="$t('testCase.import')"
          prop="file"
          ref="import"
        >
          <el-upload
            action=""
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :on-remove="handleDelte"
            :file-list="addcaseForm.file"
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
            <el-tooltip
              style="margin-left:10px;"
              :content="$t('userpage.contentTip')"
              placement="right"
            >
              <em class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          id="upload_package_close"
          @click="cancelClose"
          class="light-button"
          style="margin-right:20px;"
        >
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          id="upload_package_ipload"
          class="dark-button"
          @click="confirmAddCase()"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserInfo, Userpage, URL_PREFIX } from '../../tools/api.js'

export default {
  data () {
    return {
      currUrl: window.location.href,
      userName: '',
      sceneData: [],
      datacn: [],
      dataen: [],
      scenarioIdList: [],
      CaseVisible: false,
      taskId: '',
      testSuiteData: [],
      language: '',
      addCaseVisible: false,
      addcaseForm: {
        name: '',
        objective: '',
        step: '',
        expectResult: '',
        type: '',
        file: []
      },
      testSuitesNocase: false,
      scenarioName: '',
      rules: {
        name: [
          { required: true, message: this.$t('testCase.provideNameCn'), trigger: 'blur' }
        ],
        objective: [
          { required: true, message: '请输入测试目的', trigger: 'blur' }
        ],
        step: [
          { required: true, message: '请输入测试步骤', trigger: 'blur' }
        ],
        expectResult: [
          { required: true, message: '请输入测试预期结果', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        file: [
          { required: true, message: '请选择文件', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    opened () {
      return this.testSuiteData.map((i) => {
        return i.nameEn
      })
    }
  },
  beforeMount () {
    getUserInfo().then(res => {
      sessionStorage.setItem('userId', res.data.userId)
      sessionStorage.setItem('userName', res.data.userName)
      sessionStorage.setItem('authorities', res.data.authorities)
      this.userName = res.data.userName
    })
  },
  mounted () {
    this.getLanguage()
    this.getTaskId()
    this.getAllScene()
  },
  methods: {
    getLanguage () {
      if (this.currUrl.indexOf('&') !== -1) {
        let language = this.currUrl.split('&')[1].split('=')[1]
        this.language = language
        localStorage.setItem('language', language)
        this.$i18n.locale = language
        this.$store.commit('changeLaguage', { language: language })
      }
    },
    getTaskId () {
      if (this.currUrl.indexOf('?') !== -1) {
        this.taskId = this.currUrl.split('?')[1].split('=')[1].split('&')[0]
        sessionStorage.setItem('taskId', this.taskId)
      }
    },
    getAllScene () {
      Userpage.getAllSceneApi().then(res => {
        let data = res.data
        data.forEach(item => {
          if (item.nameEn === 'EdgeGallery Community Scenario') {
            item.selected = true
          } else {
            item.selected = false
          }
        })
        this.sceneData = data
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.getSceneFail'),
          type: 'error'
        })
      })
      this.setDivHeight()
    },
    chooseScene (item) {
      let scenarioIds = []
      scenarioIds.push(item.id)
      let fd = new FormData()
      fd.append('scenarioIds', scenarioIds)
      Userpage.getSceneCaseApi(fd).then(res => {
        let data = res.data[0].testSuites
        let IsHaveCase = data.some(function (element) {
          return (element.testCases.length !== 0)
        })
        if (IsHaveCase) {
          this.scenarioIdList.push(item.id)
          item.selected = !item.selected
        } else {
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$t('promptMessage.noCase'),
            type: 'warning'
          })
        }
      })
    },
    getAppIcon (item) {
      return URL_PREFIX + 'files/' + item.id
    },
    handleClose () {
      this.CaseVisible = false
    },
    getDetail (item) {
      this.CaseVisible = true
      this.scenarioName = this.language === 'cn' ? item.nameCh : item.nameEn
      let scenarioIds = []
      scenarioIds.push(item.id)
      let fd = new FormData()
      fd.append('scenarioIds', scenarioIds)
      Userpage.getSceneCaseApi(fd).then(res => {
        this.testSuiteData = res.data[0].testSuites
        this.testSuitesNocase = this.testSuiteData.every(function (element) {
          return (element.testCases.length === 0)
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('home.getFail'),
          type: 'warning'
        })
      })
    },
    startTest () {
      this.scenarioIdList = []
      this.sceneData.forEach(item => {
        if (item.selected) {
          this.scenarioIdList.push(item.id)
        }
      })
      let fd = new FormData()
      fd.append('scenarioIdList', this.scenarioIdList)
      Userpage.runTaskApi(this.taskId, fd).then(res => {
        sessionStorage.setItem('taskId', this.taskId)
        this.$router.push({ name: 'atpprocess', query: { taskId: this.taskId } })
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.runFailed'),
          type: 'error'
        })
      })
    },
    setDivHeight () {
      this.$nextTick(() => {
        const selectsceneDiv = document.getElementById('selectscene')
        const appDiv = document.getElementById('app')
        selectsceneDiv.style.minHeight = appDiv.clientHeight + 'px'
      })
    },
    confirmAddCase () {
      this.$refs['addcaseForm'].validate((valid) => {
        if (valid) {
          let fd = new FormData()
          let addcaseForm = this.addcaseForm
          fd.append('name', addcaseForm.name)
          fd.append('objective', addcaseForm.objective)
          fd.append('step', addcaseForm.step)
          fd.append('expectResult', addcaseForm.expectResult)
          fd.append('type', addcaseForm.type)
          if (addcaseForm.file.length > 0) {
            fd.append('file', addcaseForm.file[0])
          } else {
            let objFile = new File([], 'kong.java')
            addcaseForm.file.push(objFile)
            fd.append('file', addcaseForm.file[0])
          }
          Userpage.contributionApi(fd).then(res => {
            this.$message({
              showClose: true,
              duration: 2000,
              message: this.$t('promptMessage.submitSuccess'),
              type: 'success'
            })
            this.addCaseVisible = false
            this.addcaseForm = {
              name: '',
              objective: '',
              step: '',
              expectResult: '',
              type: '',
              file: []
            }
          }).catch(() => {
            this.cancelClose()
          })
        } else {
          return false
        }
      })
      if (this.addcaseForm.file.length !== 0) {
        this.$refs.import.clearValidate()
      }
    },
    cancelClose () {
      this.addCaseVisible = false
      this.addcaseForm = {
        name: '',
        objective: '',
        step: '',
        expectResult: '',
        type: '',
        file: []
      }
    },
    handleExceed (file, fileList) {
      if (fileList.length === 1) {
        this.$message.warning(this.$t('promptMessage.onlyOneFile'))
      }
    },
    handleChange (file, fileList) {
      this.addcaseForm.file.push(file.raw)
      this.$refs.import.clearValidate()
    },
    handleDelte (file, fileList) {
      this.addcaseForm.file = fileList
    }
  }
}
</script>
<style lang="less">
.selectscene{
  background-color: #fff;
  .toptitle{
    color: #380879;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    .left{
      font-size: 24px;
      font-weight: 600;
    }
    .right{
      font-size: 20px;
      cursor: pointer;
      border-bottom: 1px solid #380879;
    }
  }
  .scene-main{
    display: flex;
    padding: 30px 0;
    flex-wrap: wrap;
    .contednt{
      width: 25%;
      padding: 0 15px 25px;
      .scene{
        border-radius: 20px;
        position: relative;
        background-color: #fcf9ff;
        .scenariosLogo{
          .sceneimage{
            display: block;
            width: 100%;
            height: 160px;
            border-radius: 20px 20px 0 0;
          }
          .select-button{
              position: absolute;
              display: block;
              right: -10px;
              top: -25px;
          }
        }
        .choose{
          display: flex;
          justify-content: space-between;
          .el-form{
            width: 100%;
            .el-form-item__label{
              padding-left: 8px;
              color: #666666;
            }
            .el-form-item{
                margin-bottom: 0;
                .el-form-item__content{
                  max-width: calc(100% - 100px);
                  font-size: 16px;
                  color: #303133;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
            }
          }
          img{
            width: 30px;
            height: 30px;
            position: absolute;
            right: 10px;
            bottom: 15px;
          }
        }
        .choose-button{
          background-color: #c4cdf9;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          .el-button--text {
            font-size: 16px;
            color: #000000;
            padding: 2% 5%;
          }
          .middleLine{
            display: inline-block;
            width: 2px;
            height: 20px;
            background-color: #c9acf6;
            position: relative;
            top: 4px;
          }
        }
      }
    }
    @media screen and (max-width: 1320px) {
      .contednt{
          width: 33%;
      }
    }
  }
  .start-button{
    text-align: right;
    margin: 0px 25px;
  }
}
.el-dialog__body{
  p{
    font-size: 18px;
    padding-bottom: 10px;
    color: #6186f1;
  }
  .el-collapse {
     padding: 0;
      .el-collapse-item__header{
        border-radius: 5px;
        padding-left: 8px;
        font-size: 18px;
        color: #111111;
        height: 30px;
        background-image: linear-gradient(to right, rgba(124,156,250,0.6) , rgba(249,195,255,0.2));
      }
  }
  .el-icon-arrow-right:before {
    color: #000;
  }
  .el-table::before {
      width: 0;
  }
  table th,table td{
    border-bottom: none !important;
    height: 30px;
  }
}
.addCasedialog{
  .form-button{
        background-color: #f7f2ff;
        border: 1px solid #380879;
        color: #380879;
        border-radius: 5px;
        box-shadow: 0 5px 5px #deccf9;
      }
}

</style>
