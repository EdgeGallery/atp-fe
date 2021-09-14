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
  <div class="insideScene">
    <div
      class="selectscene"
      id="selectscene"
    >
      <div class="toptitle">
        <div class="left flex">
          <div class="left-text">
            <img
              src="../../assets/images/selectsceneIcon.png"
              alt=""
              style="margin-right:20px;"
            >
            {{ $t('userpage.selectScene') }}
          </div>
        </div>
        <div
          class="right"
          @click="contribution()"
        >
          <el-button
            class="dark-button"
            size="small"
          >
            {{ $t('userpage.contribution') }}
          </el-button>
        </div>
      </div>
      <div class="scene-main">
        <div
          class="contednt"
          v-for="(item,index) in sceneData"
          :key="index"
        >
          <div
            class="scene"
            @click="chooseScene(item)"
          >
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
              <p>{{ language==='cn'?item.nameCh:item.nameEn }}</p>
              <span>{{ language==='cn'?item.descriptionCh:item.descriptionEn }}</span>
            </div>
            <div class="choose-detail">
              <span
                @click="getDetail(item)"
                @click.stop="getDetail()"
                class="curp"
              >{{ $t('userpage.seeDetail') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="start-button curp"
        @click="startTest()"
      >
        <span>{{ $t('atp.startTest') }}</span>
      </div>
    </div>
    <!-- case detail -->
    <el-dialog
      :visible.sync="CaseVisible"
      :title="$t('userpage.caseDetail')"
      width="85%"
    >
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
            header-cell-class-name="caseHearder"
          >
            <el-table-column
              :label="$t('userpage.name')"
              width="210"
            >
              <template scope="scope">
                {{ language==='cn'?scope.row.nameCh:scope.row.nameEn }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('userpage.type')"
              width="120"
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
      width="45%"
      class="addCasedialog"
    >
      <el-form
        :model="addcaseForm"
        label-width="auto"
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
            size="small"
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
    const NameEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.nameEmpty')))
      } else {
        callback()
      }
    }
    const objectiveEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.objectiveEmpty')))
      } else {
        callback()
      }
    }
    const ResultEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.expectResultEmpty')))
      } else {
        callback()
      }
    }
    const typeEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.typeEmpty')))
      } else {
        callback()
      }
    }
    const StepEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.testStepEmpty')))
      } else {
        callback()
      }
    }
    const fileEmpty = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(this.$t('promptMessage.fileEmpty')))
      } else {
        callback()
      }
    }
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
      rules: {
        name: [
          { required: true, validator: NameEmpty, trigger: 'blur' }
        ],
        objective: [
          { required: true, validator: objectiveEmpty, trigger: 'blur' }
        ],
        step: [
          { required: true, validator: StepEmpty, trigger: 'blur' }
        ],
        expectResult: [
          { required: true, validator: ResultEmpty, trigger: 'blur' }
        ],
        type: [
          { required: true, validator: typeEmpty, trigger: 'change' }
        ],
        file: [
          { required: true, validator: fileEmpty, trigger: 'change' }
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
    contribution () {
      if (this.$refs['addcaseForm']) {
        this.$refs['addcaseForm'].resetFields()
      }
      this.addCaseVisible = true
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
        selectsceneDiv.style.minHeight = appDiv.clientHeight - 230 + 'px'
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
.insideScene{
  .selectscene{
    position: relative;
    background-color: #fbf5f8;
    padding: 50px 20px 0;
    border-radius: 16px;
    display: block;
    box-shadow: inset 4px 4px 25px 5px rgba(36, 20, 119, 0.11);
    .toptitle{
      color: #380879;
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      position: relative;
      .left{
        font-family: 'Harmony-Light';
        width: 70%;
        .left-text{
          position: relative;
          z-index: 2;
          padding: 10px 15px;
          border-radius: 12px;
          height: 47px;
          width: 100%;
          font-size: 20px;
          background-image: linear-gradient(to right, rgba(251,251,251) , rgba(246,245,248));
        }
      }
    .left::after{
        content: '';
        border-radius: 12px;
        width: 60%;
        height: 47px;
        position: absolute;
        bottom: -4px;
        background-image: linear-gradient(to right, #aa9ec1, #f0eef4);
        filter: blur(0.65rem);
        opacity: 0.7;
        z-index: 1;
    }
      .right{
        font-size: 20px;
        cursor: pointer;
        padding-top: 8px;
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
          border-radius: 10px;
          position: relative;
          background-color: #fff;
          .scenariosLogo{
            .sceneimage{
              display: block;
              // width: calc(100% - 24px);
              width: 100%;
              text-align: center;
              border-radius: 20px 20px 0 0;
              padding: 60px 0 20px;
            }
            .select-button{
                position: absolute;
                display: block;
                right: 12px;
                top: 0px;
            }
          }
          .choose{
            padding: 0px 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            p{
              font-size: 16px;
              color: #380879;
              font-family: 'Harmony-Light';

            }
            span{
              font-size: 14px;
              color: #380879;
              font-family: 'Harmony-UltraLight';
            }
          }
          .choose-detail{
            padding: 15px;
            span{
              font-family: 'Harmony-Thin';
              color: #fff;
              font-size: 12px;
              padding: 5px 12px;
              background-color: #cfc8e6;
              border-radius: 10px;
            }
          }
        }
        .cannotclick{
          pointer-events: none;
        }
      }
      @media screen and (max-width: 900px) {
        .contednt{
            width: 33%;
        }
      }
    }
    .start-button{
      position: absolute;
      right: 5%;
      top: 70%;
      background-image: linear-gradient(122deg, rgba(68,68,208), rgba(103,36,203) 64%,rgba(103,36,203));
      width: 80px;
      height: 80px;
      border-radius: 50%;
      text-align: center;
        span{
          display: inline-block;
          font-size: 20px;
          color: #fff;
          margin: 26px 0;
          position: relative;
          z-index: 2;
        }
    }
    .start-button::after{
        content: '';
        border-radius: 50%;
        width: 86%;
        height: 100%;
        position: absolute;
        right: 7%;
        bottom: -10px;
        background: inherit;
        filter: blur(0.65rem);
        opacity: 0.7;
        z-index: 1;
    }
  }

  .el-dialog{
    border-radius: 10px;
    background-color: #efefef;
      .el-dialog__header{
        border: none;
        padding: 40px 40px 0;
        border-radius: 10px 10px 0 0;
        .el-dialog__headerbtn{
          display: none;
        }
      }
      .el-dialog__title{
          font-family: 'Harmony-Light';
          font-size: 20px !important;
          color: #380879 !important;
      }
      .el-dialog__title::before{
        content: '';
        display:inline-block;
        width:17px;
        height:17px;
        margin-right:20px;
        background-image: url('../../assets/images/casedetail.png');
        position: relative;
        top: 2px;
      }
    .el-dialog__body{
      padding: 20px 40px 0 !important;
      .el-collapse {
        padding: 0;
        .el-collapse-item {
          margin-bottom: 15px;
          .el-collapse-item__content{
            padding: 0;
          }
          .el-collapse-item__header{
            font-family: 'Harmony-Light';
            border-radius: 10px 10px 0 0;
            height: 35px;
            padding-left: 15px;
            font-size: 18px;
            color: #fff;
            background-color: #9d95c9!important;
          }
          .el-collapse-item__wrap{
            border-radius: 0 0 10px 10px;
          }
          .caseHearder{
            background: #dedae9;
            color: #6d5d83;
            padding: 0 10px;
            height: 35px;
            line-height: 35px;
            font-size: 16px;
            font-weight: normal;
          }
          .has-gutter th{
            border-radius: 0;
          }
          .el-table tr {
            background-color: #f1f2f6;
            height: 37px;
          }
          .el-table td{
            padding: 0 10px;
            color: #6f6084;
            vertical-align: top;
          }
          .el-table__body{
            .cell{
              padding-top: 5px;
            }
          }
        }
      }
        .el-icon-arrow-right:before {
          color: #fff;
        }
        .el-table::before {
            width: 0;
        }
        table th,table td{
          border-bottom: none !important;
          height: 20px;
        }
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
}

</style>
