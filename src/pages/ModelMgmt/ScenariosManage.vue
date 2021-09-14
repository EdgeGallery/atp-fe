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
    <div class="padding_deafult">
      <breadcrumb />
      <div class="testscenarios-main padding20">
        <div class="flex enter-search">
          <div class="flex">
            <el-input
              v-model="form.name"
              prefix-icon="el-icon-search"
              :placeholder="$t('testCase.provideNameSearch')"
              size="small"
              @change="getAllScene"
            />
            <el-button
              class="dark-button"
              size="small"
              @click="getAllScene"
            >
              {{ $t('common.search') }}
            </el-button>
            <el-tooltip
              :content="this.$t('testCase.testScenarioIntro')"
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
          <div v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1">
            <el-button
              class="light-button"
              size="small"
              @click="excelBringBtn"
            >
              {{ this.$t('modelmgmt.import') }}
            </el-button>
            <el-button
              class="dark-button"
              size="small"
              @click="onclickAdd"
            >
              {{ $t('testCase.add') }}
            </el-button>
          </div>
        </div>
        <div class="allscene">
          <div
            class="list"
            v-for="(item,index) in scenarios"
            :key="item.id"
            @mouseenter="hoverList(index)"
            @mouseleave="activeInfo=-1"
          >
            <div class="content">
              <img
                :src="getAppIcon(item)"
                alt=""
              >
              <div class="content-info">
                <p class="name">
                  {{ language === 'cn' ? item.nameCh :item.nameEn }}
                </p>
                <span
                  class="description"
                  :class="{'showall':activeInfo===index}"
                >{{ language === 'cn' ? item.descriptionCh :item.descriptionEn }}</span>
                <div
                  class="operation-btn"
                  :class="{'btnNone':activeInfo===index}"
                  v-if="authorities.indexOf('ROLE_ATP_ADMIN')!==-1"
                >
                  <el-button
                    size="small"
                    class="light-button"
                    @click="deleteTestScenario(item.id)"
                    style="margin-right:30px;"
                  >
                    <em class="el-icon-delete" />
                  </el-button>
                  <el-button
                    size="small"
                    class="dark-button"
                    @click="editScenario(item)"
                  >
                    <em class="el-icon-edit " />
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- add -->
        <el-dialog
          :visible.sync="addTestScenarioVisible"
          :close-on-click-modal="false"
          :title=" $t('testCase.addTestScenario')"
          width="30%"
        >
          <el-form
            :model="addTestScenarioForm"
            ref="addTestScenarioForm"
            label-width="auto"
            :rules="rules"
          >
            <el-form-item
              :label=" $t('testCase.testScenarioCn')"
              prop="nameCh"
            >
              <el-input
                size="small"
                v-model="addTestScenarioForm.nameCh"
                maxlength="64"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioEn')"
            >
              <el-input
                size="small"
                v-model="addTestScenarioForm.nameEn"
                maxlength="64"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioDescriptionCn')"
              prop="descriptionCh"
            >
              <el-input
                size="small"
                v-model="addTestScenarioForm.descriptionCh"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioDescriptionEn')"
            >
              <el-input
                size="small"
                v-model="addTestScenarioForm.descriptionEn"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioIcon')"
              prop="logoFileList"
              class="icon"
            >
              <div class="default-icon">
                <div
                  class="box"
                  v-for="(item, index) in defaultIcon"
                  @click="chooseDefaultIcon(item, index)"
                  :key="item"
                >
                  <img
                    :src="item"
                    alt=""
                  >
                  <em
                    class="el-icon-success"
                    :class="{ active: addTestScenarioForm.defaultActive === index }"
                  />
                </div>
              </div>
              <em
                class="upIcon el-icon-success"
                :class="{ active: uploadIcon }"
                v-if="uploadIcon"
              />
              <el-upload
                id="projectLogo"
                class="upload-demo clear"
                ref="upload"
                action=""
                :limit="1"
                list-type="picture-card"
                :file-list="logoFileList"
                :on-change="handleChangeLogo"
                :on-exceed="handleExceed"
                :auto-upload="false"
                :on-remove="removeUploadLogo"
                accept=".jpg,.png"
                name="file"
              >
                <em class="el-icon-plus" />
              </el-upload>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              style="margin-right:40px;"
              @click="handleClose"
              size="small"
              class="light-button"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              class="dark-button"
              size="small"
              @click="confirmAddTestScenario"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </el-dialog>
        <!-- modify -->
        <el-dialog
          :visible.sync="editTestScenarioVisible"
          :title="$t('testCase.editTestScenario')"
          :close-on-click-modal="false"
          width="30%"
        >
          <el-form
            :model="editTestScenarioForm"
            label-width="auto"
            :rules="rules"
            ref="editTestScenarioForm"
          >
            <el-form-item
              :label=" $t('testCase.testScenarioCn')"
              prop="nameCh"
            >
              <el-input
                size="small"
                v-model="editTestScenarioForm.nameCh"
                maxlength="64"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioEn')"
              prop="nameEn"
            >
              <el-input
                size="small"
                v-model="editTestScenarioForm.nameEn"
                maxlength="64"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioDescriptionCn')"
              prop="descriptionCh"
            >
              <el-input
                size="small"
                v-model="editTestScenarioForm.descriptionCh"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioDescriptionEn')"
              prop="descriptionEn"
            >
              <el-input
                size="small"
                v-model="editTestScenarioForm.descriptionEn"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioIcon')"
              prop="logoFileList"
              class="icon"
            >
              <div class="default-icon">
                <div
                  class="box"
                  v-for="(item, index) in scenarioIcon"
                  @click="chooseScenarioIcon(item, index)"
                  :key="item"
                >
                  <img
                    :src="item"
                    alt=""
                  >
                  <em
                    class="el-icon-success"
                    :class="{ active: editTestScenarioForm.defaultActive === index }"
                  />
                </div>
              </div>
              <em
                class="upIcon el-icon-success"
                :class="{ active: uploadIcon }"
                v-if="uploadIcon"
              />
              <el-upload
                id="projectLogo"
                class="upload-demo clear"
                ref="upload"
                action=""
                :limit="1"
                list-type="picture-card"
                :file-list="logoFileList"
                :on-change="handleChangeLogo"
                :on-exceed="handleExceed"
                :auto-upload="false"
                :on-remove="removeUploadLogo"
                accept=".jpg,.png"
                name="file"
              >
                <em class="el-icon-plus" />
              </el-upload>
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
              @click="confirmEditTestScenario()"
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
            {{ this.$t('promptMessage.deleteSenarioPrompt') }}
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
            @click="onDelete"
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
          label-width="auto"
        >
          <el-form-item :label="this.$t('modelmgmt.import')">
            <el-upload
              action=""
              :limit="1"
              :on-exceed="handleExceed"
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
import { Userpage, ModelMgmt, URL_PREFIX } from '../../tools/api.js'

export default {
  components: { Navcomp, breadcrumb },
  data () {
    const NameEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('testCase.provideNameCn')))
      } else {
        callback()
      }
    }
    const DescEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('testCase.provideDescriptionCn')))
      } else {
        callback()
      }
    }
    return {
      editId: '',
      defaultIcon: [
        require('../../assets/images/defaulticon.png')
      ],
      scenarioIcon: [],
      uploadIcon: false,
      showErr: false,
      logoFileList: [],
      addTestScenarioVisible: false,
      editTestScenarioVisible: false,
      deleteVisible: false,
      addExcelVisible: false,
      defaultIconFile: [],
      batchForm: {
        batchFile: []
      },
      batchDemo: './batch_import.zip',
      addTestScenarioForm: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      },
      editTestScenarioForm: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      },
      userName: sessionStorage.getItem('userName'),
      language: localStorage.getItem('language'),
      authorities: sessionStorage.getItem('authorities'),
      form: {
        name: '',
        locale: ''
      },
      scenarios: [],
      deleteId: '',
      rules: {
        nameCh: [
          { required: true, validator: NameEmpty, trigger: 'blur' }
        ],
        descriptionCh: [
          { required: true, validator: DescEmpty, trigger: 'blur' }
        ]
      },
      activeInfo: -1
    }
  },
  methods: {
    getAppIcon (item) {
      return URL_PREFIX + 'files/' + item.id + '?t=' + this.getDate()
    },
    getDate () {
      let date = new Date()
      return date.getSeconds()
    },
    hoverList (index) {
      this.activeInfo = index
    },
    getAllScene () {
      this.form.locale = this.language === 'cn' ? 'ch' : 'en'
      Userpage.getAllSceneApi(this.form).then(res => {
        this.scenarios = res.data
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.getSceneFail'),
          type: 'warning'
        })
      })
    },
    handleClose () {
      this.addTestScenarioVisible = false
      this.editTestScenarioVisible = false
      this.addTestScenarioForm = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      }
      this.editTestScenarioForm = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      }
      this.scenarioIcon = []
    },
    onclickAdd () {
      this.addTestScenarioForm = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      }
      if (this.$refs['addTestScenarioForm']) {
        this.$refs['addTestScenarioForm'].resetFields()
      }
      this.addTestScenarioVisible = true
      this.chooseDefaultIcon(this.defaultIcon[0], 0)
    },
    handleChangeLogo (file) {
      let listTemp = []
      this.addTestScenarioForm.base64Session = true
      this.editTestScenarioForm.base64Session = true
      this.addTestScenarioForm.icon = []
      this.editTestScenarioForm.icon = []
      this.defaultIconFile = []
      this.addTestScenarioForm.defaultActive = ''
      this.editTestScenarioForm.defaultActive = ''
      if (file) {
        if (file.raw.name.indexOf(' ') !== -1) {
          this.$message.warning('名称不能为空')
          this.logoFileList = []
        } else {
          this.logoFileList.push(file)
          listTemp.push(file.raw)
          this.addTestScenarioForm.icon = listTemp
          this.editTestScenarioForm.icon = listTemp
          this.uploadIcon = true
        }
        if (file.size / 1024 / 1024 > 2) {
          this.$message.warning(this.$t('promptMessage.moreThan2'))
          // this.logoFileList = []
          if (this.scenarioIcon.length > 0) {
            this.chooseScenarioIcon(this.scenarioIcon[0], 0)
          } else {
            this.chooseDefaultIcon(this.defaultIcon[0], 0)
          }
        }
        let fileTypeArr = ['jpg', 'png']
        this.fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (fileTypeArr.indexOf(this.fileType.toLowerCase()) === -1) {
          this.$message.warning(this.$t('promptMessage.checkFileType'))
          this.logoFileList = []
        }
      }
      this.showErr = !this.logoFileList
    },
    chooseDefaultIcon (file, index) {
      this.logoFileList = []
      this.uploadIcon = false
      this.addTestScenarioForm.base64Session = true
      this.defaultIconFile = []
      if (this.addTestScenarioForm.defaultActive === index) {
        this.addTestScenarioForm.defaultActive = ''
        this.addTestScenarioForm.icon = []
        this.showErr = !this.defaultIconFile.length
      } else {
        this.addTestScenarioForm.defaultActive = index
        this.conversionIcon(file)
      }
    },
    chooseScenarioIcon (file, index) {
      this.logoFileList = []
      this.uploadIcon = false
      this.editTestScenarioForm.base64Session = true
      this.defaultIconFile = []
      if (this.editTestScenarioForm.defaultActive === index) {
        this.editTestScenarioForm.defaultActive = ''
        this.editTestScenarioForm.icon = []
        this.showErr = !this.defaultIconFile.length
      } else {
        this.editTestScenarioForm.defaultActive = index
        this.conversionIcon(file)
      }
    },
    handleExceed (file, fileList) {
      if (fileList.length === 1) {
        this.$message.warning(this.$t('promptMessage.onlyOneFile'))
      }
    },
    removeUploadLogo (file) {
      this.uploadIcon = false
      this.logoFileList = []
      this.showErr = this.logoFileList
      this.chooseDefaultIcon(this.defaultIcon[0], 0)
      this.chooseScenarioIcon(this.scenarioIcon[0], 0)
    },
    editScenario (item) {
      if (this.$refs['editTestScenarioForm']) {
        this.$refs['editTestScenarioForm'].resetFields()
      }
      this.scenarioIcon = []
      this.editTestScenarioForm = JSON.parse(JSON.stringify(item))
      this.editId = item.id
      this.editTestScenarioVisible = true
      this.showErr = this.logoFileList
      this.scenarioIcon.push(URL_PREFIX + 'files/' + item.id)
      this.chooseScenarioIcon(this.scenarioIcon[0], 0)
    },
    conversionIcon (file) {
      let image = new Image()
      image.src = file
      image.onload = () => {
        // Convert static images to base64
        let base64 = this.getBase64Image(image)
        // Convert base64 to file stream
        this.defaultIconFile.push(this.base64toFile(base64))
        this.addTestScenarioForm.icon = this.defaultIconFile
        this.editTestScenarioForm.icon = this.defaultIconFile
        this.showErr = !this.defaultIconFile
      }
    },
    getBase64Image (img) {
      let canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      return canvas.toDataURL('image/' + ext)
    },
    base64toFile (dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename + '.' + suffix, {
        type: mime
      })
    },
    confirmAddTestScenario () {
      this.$refs['addTestScenarioForm'].validate((valid) => {
        if (valid) {
          let addTestScenarioForm = this.addTestScenarioForm
          addTestScenarioForm.icon = this.addTestScenarioForm.icon.length > 0 ? this.addTestScenarioForm.icon[0] : this.defaultIconFile
          let fd = new FormData()
          fd.append('nameCh', addTestScenarioForm.nameCh)
          fd.append('nameEn', addTestScenarioForm.nameEn)
          fd.append('descriptionCh', addTestScenarioForm.descriptionCh)
          fd.append('descriptionEn', addTestScenarioForm.descriptionEn)
          fd.append('icon', addTestScenarioForm.icon)
          if (addTestScenarioForm.icon.length === 0) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'warning',
              message: this.$t('promptMessage.selectIcon')
            })
          } else {
            ModelMgmt.createTestScenarioApi(fd).then(res => {
              this.getAllScene()
              this.addTestScenarioVisible = false
              this.clearFormData(this.addTestScenarioForm)
            }).catch(() => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: this.$t('promptMessage.addFail'),
                type: 'warning'
              })
              this.addTestScenarioVisible = false
            })
          }
          this.chooseDefaultIcon(this.defaultIcon[0], 0)
        } else {
          return false
        }
      })
    },
    confirmEditTestScenario () {
      let editTestScenarioForm = this.editTestScenarioForm
      editTestScenarioForm.icon = this.editTestScenarioForm.icon.length > 0 ? this.editTestScenarioForm.icon[0] : this.defaultIconFile
      let fd = new FormData()
      fd.append('nameCh', editTestScenarioForm.nameCh)
      fd.append('nameEn', editTestScenarioForm.nameEn)
      fd.append('descriptionCh', editTestScenarioForm.descriptionCh)
      fd.append('descriptionEn', editTestScenarioForm.descriptionEn)
      fd.append('icon', editTestScenarioForm.icon)
      if (editTestScenarioForm.icon.length === 0) {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'warning',
          message: this.$t('promptMessage.selectIcon')
        })
      } else {
        ModelMgmt.editTestScenarioApi(fd, this.editId).then(res => {
          this.getAllScene()
          this.clearFormData(this.editTestScenarioForm)
          this.editTestScenarioVisible = false
          this.scenarioIcon = []
        }).catch(() => {
          this.$message({
            duration: 2000,
            message: this.$t('promptMessage.modifyFail'),
            type: 'warning'
          })
          this.editTestScenarioVisible = false
        })
      }
    },
    clearFormData (form) {
      form.nameCh = ''
      form.nameEn = ''
      form.descriptionCh = ''
      form.descriptionEn = ''
    },
    deleteVisibleClose () {
      this.deleteVisible = false
    },
    deleteTestScenario (id) {
      this.deleteVisible = true
      this.deleteId = id
    },
    onDelete () {
      this.deleteVisible = false
      let id = this.deleteId
      ModelMgmt.deleteTestScenarioApi(id).then(res => {
        this.$message({
          duration: 2000,
          message: this.$t('promptMessage.deleteSuccess'),
          type: 'success'
        })
        this.getAllScene()
      }).catch(error => {
        if (error.response.data.message === 'this scenario is used by some test suites, so can not be delete.') {
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$t('promptMessage.cannotDeleteScenario'),
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
        this.getAllScene()
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
    }
  },
  mounted () {
    this.getAllScene()
    this.showErr = this.logoFileList
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
      this.getAllScene()
    }
  }
}
</script>
<style lang="less">
.testscenarios-main{
    background-color: #fff;
    padding: 30px 60px 60px;
    border-radius: 20px;
  .enter-search{
    justify-content: space-between;
    height: 34px;
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
  .allscene{
    padding-top: 15px;
    display: flex;
    flex-wrap: wrap;
    .list {
      background-color: #fff;
      box-sizing: border-box;
      width: 25%;
      padding: 0 10px;
      margin-bottom: 20px;
      .content{
        box-shadow: 0 0 20px rgba(27, 7, 118, 0.1);
        border-radius: 12px;
        position: relative;
        padding-bottom: 90px;
        img{
          width: 100%;
          display: block;
          height: 160px;
          border-radius: 12px 12px 0 0;
        }
        .content-info{
          background: #fff;
          border-radius: 12px;
          position: absolute;
          width: 100%;
          bottom: 0px;
          z-index: 2;
          padding: 20px 20px 10px;
          .name{
            font-size: 20px;
            color: #111;
            margin-bottom: 7px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .description{
            display: block;
            font-size: 16px;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .description.showall{
             white-space: normal;
          }
          .operation-btn{
            width: 100%;
            max-height: 0px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 10px;
            transition: all 0.6s ease-in-out;
            .el-button--small {
              padding: 5px 25px;
            }
          }
          .operation-btn.btnNone{
            max-height: 40px;
            transition: all 0.6s ease-in-out;
          }
        }
      }
      .content:hover{
        box-shadow: 0 0 35px rgba(27, 7, 118, 0.23);
      }
      .content:hover .name{
        white-space: normal;
      }
    }
    @media screen and (max-width: 1180px) {
      .list{
          width: 33%;
      }
    }
  }
  .default-icon{
    float: left;
    display: flex;
    flex-wrap: wrap;
    .box{
      position: relative;
      width: 44px;
      height: 44px;
      margin: 0 15px 0 0;
      img{
        width: 40px;
        height: 40px;
      }
      em{
        display: inline-block;
        position: absolute;
        bottom: 0;
        right: 0;
      }
      .active{
        color: #409EFF;
      }
    }
  }
  .upload-demo{
    float: left;
    .el-button--primary{
      background-color: #fff;
      border-color: #688ef3;
      color: #688ef3;
      padding: 6px 20px;
      margin-top: 8px;
    }
    .el-icon-warning{
      color: #688ef3;
      margin-right: 5px;
      font-size: 14px;
    }
    .el-upload{
      width: 34px;
      height: 34px;
      line-height: 34px;
      margin: 3px 15px 0 0;
      text-align: center;
    }
    .el-upload-list__item-preview{
      opacity: 0;
    }
    .el-icon-plus:before {
        content: "\e6d9";
    }
  }
    .el-upload-list{
    width: auto;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width: 40px;
    height: 40px;
    min-width: 40px;
    border: none;
    margin: 0 15px 0 0;
  }
  .upIcon.el-icon-success{
    position: absolute;
    top: 30px;
    left: 88px;
    z-index: 99;
  }
  .upIcon.active{
    color: #409EFF;
  }
  .el-form-item.icon{
    content: '';
    display: block;
    clear: both;
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
