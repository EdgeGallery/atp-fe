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
    <div class="padding200">
      <breadcrumb />
      <div class="testsuites-main padding20">
        <div class="flex enter-search">
          <div class="flex">
            <el-input
              v-model="form.name"
              prefix-icon="el-icon-search"
              :placeholder="$t('testCase.provideNameSearch')"
              size="small"
              @change="getAllSuites"
            />
            <el-select
              v-model="form.scenarioIdList"
              :placeholder="$t('userpage.selectScene')"
              size="small"
            >
              <el-option
                v-for="item in options"
                :key="item.nameCh"
                :label="language == 'cn' ? item.nameCh : item.nameEn"
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
              @click="getAllSuites"
            >
              {{ $t('common.search') }}
            </el-button>
            <el-tooltip
              :content="this.$t('testCase.testSuiteIntro')"
              placement="right"
              class="questionIcon"
              visible-arrow="false"
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
              @click="addTestSuiteBtn"
            >
              {{ $t('testCase.add') }}
            </el-button>
          </div>
        </div>
        <div
          class="allsuite"
        >
          <div
            class="list"
            v-for="item in testSuites"
            :key="item.id"
          >
            <div class="content">
              <el-form
                label-width="auto"
                :class="language === 'cn' ?'form-content-cn' :'form-content-en'"
              >
                <el-form-item :label="$t('modelmgmt.name')">
                  {{ language === 'cn' ? item.nameCh :item.nameEn }}
                </el-form-item>
                <el-form-item :label="$t('modelmgmt.description')">
                  {{ language === 'cn' ? item.descriptionCh :item.descriptionEn }}
                </el-form-item>
                <el-form-item :label="$t('modelmgmt.scene')">
                  {{ item.scenarioNameList }}
                </el-form-item>
                <el-form-item v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1">
                  <el-button
                    class="light-button"
                    size="small"
                    style="margin-right:10px;"
                    @click="deleteTestSuite(item.id)"
                  >
                    {{ $t('common.delete') }}
                  </el-button>
                  <el-button
                    size="small"
                    class="dark-button"
                    @click="editTestSuite(item)"
                  >
                    {{ $t('common.edit') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <el-dialog
          :visible.sync="addTestSuiteVisible"
          :title="$t('testCase.addTestSuite')"
          :close-on-click-modal="false"
          width="30%"
        >
          <el-form
            :model="addTestSuiteForm"
            ref="addTestSuiteForm"
            label-width="150px"
            :rules="rules"
          >
            <el-form-item
              :label=" $t('testCase.testSuiteCn')"
              prop="nameCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestSuiteForm.nameCh"
                :disabled="cannotEdit"
                maxlength="64"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testSuiteEn')"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestSuiteForm.nameEn"
                maxlength="64"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testSuiteDescriptionCn')"
              prop="descriptionCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestSuiteForm.descriptionCh"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testSuiteDescriptionEn')"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestSuiteForm.descriptionEn"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item
              :label="$t('modelmgmt.scene')"
              prop="scenarioList"
            >
              <el-select
                multiple
                v-model="addTestSuiteForm.scenarioList"
                :placeholder="$t('userpage.selectScene')"
              >
                <el-option
                  v-for="item in options"
                  :key="item.nameCh"
                  :label="language == 'cn' ? item.nameCh : item.nameEn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              class="light-button"
              style="margin-right:40px;"
              @click="handleClose"
              size="small"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              class="dark-button"
              size="small"
              @click="confirmAddTestSuite"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="editTestSuiteVisible"
          :title="$t('testCase.editTestSuite')"
          :close-on-click-modal="false"
          width="30%"
        >
          <el-form
            :model="editTestSuiteForm"
            ref="editTestSuiteForm"
            label-width="150px"
            :rules="modifyrules"
          >
            <el-form-item
              :label="$t('testCase.testSuiteCn')"
              prop="nameCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestSuiteForm.nameCh"
                maxlength="64"
              />
            </el-form-item>
            <el-form-item
              :label="$t('testCase.testSuiteEn')"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestSuiteForm.nameEn"
                maxlength="64"
              />
            </el-form-item>
            <el-form-item
              :label="$t('testCase.testSuiteDescriptionCn')"
              prop="descriptionCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestSuiteForm.descriptionCh"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item
              :label="$t('testCase.testSuiteDescriptionEn')"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestSuiteForm.descriptionEn"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item
              :label="$t('modelmgmt.scene')"
              prop="scenarioIdList"
            >
              <el-select
                v-model="editTestSuiteForm.scenarioIdList"
                :placeholder="$t('userpage.selectScene')"
                multiple
              >
                <el-option
                  v-for="item in options"
                  :key="item.nameCh"
                  :label="language == 'cn' ? item.nameCh : item.nameEn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              style="margin-right:40px;"
              class="light-button"
              @click="handleClose"
              size="small"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              class="dark-button"
              size="small"
              @click="confirmEditTestSuite"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </el-dialog>
      </div>
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
            {{ this.$t('promptMessage.deleteSuitePrompt') }}
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
            @click="confirmdeleteTestSuite"
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
                size="small"
                slot="trigger"
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
                  size="small"
                  slot="trigger"
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
            @click="BatchImportClose"
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
    </div>
  </div>
</template>
<script>
import Navcomp from '../../components/layout/Nav'
import breadcrumb from '../../components/common/Breadcrumb.vue'
import { Userpage, ModelMgmt } from '../../tools/api.js'

export default {
  components: { Navcomp, breadcrumb },
  data () {
    return {
      userName: sessionStorage.getItem('userName'),
      authorities: sessionStorage.getItem('authorities'),
      addTestSuiteVisible: false,
      editTestSuiteVisible: false,
      deleteVisible: false,
      addExcelVisible: false,
      confirmBtnApi: '',
      editid: '',
      cannotEdit: false,
      batchForm: {
        batchFile: []
      },
      batchDemo: './batch_import.zip',
      addTestSuiteForm: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        scenarioList: []
      },
      editTestSuiteForm: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        scenarioIdList: []
      },
      mapCh: new Map(),
      mapEn: new Map(),
      language: localStorage.getItem('language'),
      form: {
        locale: '',
        name: '',
        scenarioIdList: []
      },
      options: [],
      testScenes: [],
      testSuites: [],
      deleteId: '',
      rules: {
        nameCh: [
          { required: true, message: this.$t('testCase.provideNameCn'), trigger: 'blur' },
          { pattern: /^[\da-zA-Z_\u4e00-\u9f5a]{1,16}$/, message: this.$t('promptMessage.nameLength') }
        ],
        descriptionCh: [
          { required: true, message: this.$t('testCase.provideDescriptionCn'), trigger: 'blur' }
        ],
        scenarioList: [
          { required: true, message: this.$t('testCase.provideTestScenario'), trigger: 'change' }
        ]
      },
      modifyrules: {
        nameCh: [
          { required: true, message: this.$t('testCase.provideNameCn'), trigger: 'blur' },
          { pattern: /^[\da-zA-Z_\u4e00-\u9f5a]{1,16}$/, message: this.$t('promptMessage.nameLength') }
        ],
        descriptionCh: [
          { required: true, message: this.$t('testCase.provideDescriptionCn'), trigger: 'blur' }
        ],
        scenarioIdList: [
          { required: true, message: this.$t('testCase.provideTestScenario'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async getAllSuites () {
      await this.fillOptions()
      this.form.locale = this.language === 'cn' ? 'ch' : 'en'
      ModelMgmt.getTestSuite(this.form).then(res => {
        this.testSuites = res.data
        this.testSuites.forEach(suite => {
          let scenarioList = []
          suite.scenarioIdList.forEach(id => {
            if (this.language === 'cn') {
              scenarioList.push(this.mapCh.get(id))
            } else {
              scenarioList.push(this.mapEn.get(id))
            }
          })
          suite.scenarioNameList = scenarioList.toString()
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
    resetForm () {
      this.form = {
        locale: '',
        name: '',
        scenarioIdList: []
      }
      this.getAllSuites()
    },
    handleClose () {
      this.addTestSuiteVisible = false
      this.editTestSuiteVisible = false
    },
    addTestSuiteBtn () {
      this.addTestSuiteVisible = true
      this.addTestSuiteForm = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        scenarioList: []
      }
    },
    async fillOptions () {
      let cacheArray = []
      let para = { locale: '' }
      para.locale = this.language === 'cn' ? 'ch' : 'en'
      await Userpage.getAllSceneApi(para).then(res => {
        this.testScenes = res.data
      })
      this.testScenes.forEach(item => {
        let obj = {
          id: '',
          nameCh: '',
          nameEn: ''
        }
        obj.id = item.id
        obj.nameCh = item.nameCh
        obj.nameEn = item.nameEn
        cacheArray.push(obj)
        this.mapCh.set(obj.id, obj.nameCh)
        this.mapEn.set(obj.id, obj.nameEn)
      })
      this.options = cacheArray
    },
    confirmAddTestSuite () {
      this.$refs['addTestSuiteForm'].validate((valid) => {
        if (valid) {
          let fd = new FormData()
          fd.append('nameCh', this.addTestSuiteForm.nameCh)
          fd.append('nameEn', this.addTestSuiteForm.nameEn)
          fd.append('descriptionCh', this.addTestSuiteForm.descriptionCh)
          fd.append('descriptionEn', this.addTestSuiteForm.descriptionEn)
          fd.append('scenarioIdList', this.addTestSuiteForm.scenarioList)
          ModelMgmt.createTestSuiteApi(fd).then(res => {
            this.addTestSuiteVisible = false
            this.getAllSuites()
            this.clearFormData(this.editTestSuiteForm)
          }).catch(() => {
            this.$message({
              duration: 2000,
              message: this.$t('promptMessage.addFail'),
              type: 'warning'
            })
            this.addTestSuiteVisible = false
          })
        } else {
          return false
        }
      })
    },
    confirmEditTestSuite () {
      this.$refs['editTestSuiteForm'].validate((valid) => {
        if (valid) {
          let fd = new FormData()
          fd.append('nameCh', this.editTestSuiteForm.nameCh)
          fd.append('nameEn', this.editTestSuiteForm.nameEn)
          fd.append('descriptionCh', this.editTestSuiteForm.descriptionCh)
          fd.append('descriptionEn', this.editTestSuiteForm.descriptionEn)
          fd.append('scenarioIdList', this.editTestSuiteForm.scenarioIdList)
          ModelMgmt.editTestSuiteApi(fd, this.editId).then(res => {
            this.editTestSuiteVisible = false
            this.getAllSuites()
            this.clearFormData(this.editTestSuiteForm)
          }).catch(() => {
            this.$message({
              showClose: true,
              duration: 2000,
              message: this.$t('promptMessage.modifyFail'),
              type: 'warning'
            })
            this.editTestSuiteVisible = false
          })
        } else {
          return false
        }
      })
    },
    editTestSuite (item) {
      this.editTestSuiteForm.nameCh = item.nameCh
      this.editTestSuiteForm.nameEn = item.nameEn
      this.editTestSuiteForm.descriptionCh = item.descriptionCh
      this.editTestSuiteForm.descriptionEn = item.descriptionEn
      this.editTestSuiteForm.scenarioIdList = item.scenarioIdList
      this.editId = item.id
      this.editTestSuiteVisible = true
    },
    deleteVisibleClose () {
      this.deleteVisible = false
    },
    deleteTestSuite (id) {
      this.deleteVisible = true
      this.deleteId = id
    },
    confirmdeleteTestSuite () {
      this.deleteVisible = false
      let id = this.deleteId
      ModelMgmt.deleteTestSuite(id).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('promptMessage.deleteSuccess')
        })
        this.getAllSuites()
      }).catch(error => {
        if (error.response.data.message === 'this test suite is used by some test cases, can not be deleted..') {
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$t('promptMessage.cannotDeleteSuite'),
            type: 'warning'
          })
        } else {
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$t('promptMessage.deleteFail'),
            type: 'warning'
          })
        }
      })
    },
    BatchImportClose () {
      this.addExcelVisible = false
    },
    excelBringBtn () {
      this.addExcelVisible = true
    },
    excelChange (file, fileList) {
      console.log('ee')
      this.batchForm.batchFile.push(file.raw)
    },
    excelDelte (file, fileList) {
      this.batchForm.batchFile = fileList
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
        this.getAllSuites()
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
    clearFormData (form) {
      form.nameCh = ''
      form.nameEn = ''
      form.descriptionCh = ''
      form.descriptionEn = ''
      form.scenarioIdList = []
    }
  },
  mounted () {
    this.getAllSuites()
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
      this.getAllSuites()
    }
  }
}
</script>
<style lang="less">
.testsuites-main{
  background-color: #fff;
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
  .allsuite{
    padding-top: 15px;
    display: flex;
    flex-wrap: wrap;
    .list {
      box-sizing: border-box;
      width: 25%;
      padding: 0 10px;
      margin-bottom: 20px;
      .content{
        box-shadow: 0 0 10px 2px #e8e6f1;
        background-image: linear-gradient(to right,#fff7fe,#f7f6fb);
        border-radius: 8px;
        border-bottom-right-radius: 30px;
        padding: 10px;
        border-right: 2px solid #aa7ded;
        border-bottom: 2px solid #aa7ded;
        .el-form{
          .el-form-item{
            margin-bottom: 8px;
          }
          .el-form-item__label{
            color:#666666;
          }
          .el-form-item:first-child{
              .el-form-item__content{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
          }
          .el-form-item:nth-child(2),.el-form-item:nth-child(3){
            .el-form-item__label{
              line-height: 20px;
            }
            .el-form-item__content{
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 20px;
              height: 40px;
            }
          }
        }
          .form-content-cn{
            .el-form-item:first-child{
              .el-form-item__content{
                font-size: 22px;
                color: #333333;
              }
            }
            .el-form-item:nth-child(2),.el-form-item:nth-child(3){
              .el-form-item__content{
                font-size: 18px;
                color: #666666;
              }
            }
            .el-form-item:nth-child(4){
              .el-form-item__content{
                padding-left: 5%;
              }
            }
          }
          .form-content-en{
            .el-form-item:first-child{
              .el-form-item__content{
                font-size: 16px;
                color: #333333;
              }
            }
            .el-form-item:nth-child(2),.el-form-item:nth-child(3){
              .el-form-item__content{
                font-size: 14px;
                color: #666666;
              }
            }
            .el-form-item:nth-child(4){
              .el-form-item__content{
                padding-left: 5%;
              }
            }
          }
      }
    }
    @media screen and (max-width: 1180px) {
      .list{
          width: 33%;
      }
    }
  }
}
.addtestdialog{
  .form-button{
        background-color: #f7f2ff;
        border: 1px solid #380879;
        color: #380879;
        border-radius: 5px;
        box-shadow: 0 5px 5px #deccf9;
      }
}

</style>
