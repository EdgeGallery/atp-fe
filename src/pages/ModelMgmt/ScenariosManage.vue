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
    <div class="padding56 h100">
      <div style="margin:20px 0">
        <span>{{ $t('testCase.applicationTestPlatform') }}</span>
        <span>></span>
        <span>{{ $t('testCase.testScenarioManagement') }}</span>
      </div>
      <div class="testscenarios padding20 h100">
        <div class="scenarioTop">
          <div class="searchBar">
            <el-form
              ref="form"
              :model="form"
            >
              <div>
                <el-form-item :label="$t('modelmgmt.name')">
                  <el-input
                    class="searchInput"
                    size="small"
                    id="name"
                    v-model="form.name"
                  />
                  <el-button
                    style="text-align:center;"
                    type="primary"
                    size="small"
                    class="searchButton"
                    @click="getAllScene"
                  >
                    {{ $t('common.search') }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="addBtn">
            <el-button
              type="primary"
              size="small"
              v-if="userName==='admin'"
              @click="onclickAdd"
            >
              {{ $t('testCase.add') }}
            </el-button>
          </div>
        </div>
        <div class="allscene">
          <div
            class="list"
            v-for="item in scenarios"
            :key="item.id"
          >
            <el-form label-width="auto">
              <el-form-item :label="$t('modelmgmt.name')">
                {{ language === 'cn' ? item.nameCh :item.nameEn }}
              </el-form-item>
              <el-form-item :label="$t('modelmgmt.description')">
                {{ language === 'cn' ? item.descriptionCh :item.descriptionEn }}
              </el-form-item>
              <el-form-item
                class="rt"
                v-if="userName==='admin'"
              >
                <el-button
                  type="warning"
                  size="small"
                  class="button"
                  @click="onDelete(item.id)"
                >
                  {{ $t('common.delete') }}
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="button"
                  @click="editScenario(item)"
                >
                  {{ $t('common.edit') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 新增弹框 -->
        <el-dialog
          :visible.sync="addTestScenarioVisible"
          :close-on-click-modal="false"
          :title=" $t('testCase.addTestScenario')"
          width="30%"
        >
          <el-form
            :model="addTestScenarioForm"
            label-width="130px"
          >
            <el-form-item
              :label=" $t('testCase.testScenarioCn')"
              prop="nameCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestScenarioForm.nameCh"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioEn')"
              prop="nameEn"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestScenarioForm.nameEn"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioDescriptionCn')"
              prop="descriptionCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestScenarioForm.descriptionCh"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioDescriptionEn')"
              prop="descriptionEn"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestScenarioForm.descriptionEn"
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
            <el-form-item :label=" $t('testCase.testScenarioLabel')">
              <el-select
                v-model="addTestScenarioForm.label"
                :placeholder="$t('testCase.selectTestScenario')"
              >
                <el-option
                  v-for="item in label"
                  :key="item.labelEn"
                  :label="language == 'cn' ? item.label : item.labelEn"
                  :value="item.labelEn"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              @click="handleClose"
              size="small"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="confirmAddTestScenario"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </el-dialog>
        <!-- 编辑弹框 -->
        <el-dialog
          :visible.sync="editTestScenarioVisible"
          :title="$t('testCase.editTestScenario')"
          :close-on-click-modal="false"
          width="30%"
        >
          <el-form
            :model="editTestScenarioForm"
            label-width="130px"
          >
            <el-form-item
              :label=" $t('testCase.testScenarioCn')"
              prop="nameCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestScenarioForm.nameCh"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioEn')"
              prop="nameEn"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestScenarioForm.nameEn"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioDescriptionCn')"
              prop="descriptionCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestScenarioForm.descriptionCh"
              />
            </el-form-item>
            <el-form-item
              :label=" $t('testCase.testScenarioDescriptionEn')"
              prop="descriptionEn"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestScenarioForm.descriptionEn"
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
            <el-form-item :label=" $t('testCase.testScenarioLabel')">
              <el-select
                v-model="editTestScenarioForm.label"
                :placeholder="$t('testCase.selectTestScenario')"
              >
                <el-option
                  v-for="item in label"
                  :key="item.labelEn"
                  :label="language == 'cn' ? item.label : item.labelEn"
                  :value="item.labelEn"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              @click="handleClose"
              size="small"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="confirmEditTestScenario()"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import Navcomp from '../../components/layout/Nav'
import { Userpage, ModelMgmt } from '../../tools/api.js'

// import pagination from '../../components/common/Pagination.vue'
export default {
  components: { Navcomp },
  data () {
    return {
      editId: '',
      // icon: [require('../../assets/images/logo.png')],
      defaultIcon: [
        require('../../assets/images/logo.png')
      ],
      uploadIcon: false,
      showErr: false,
      logoFileList: [],
      addTestScenarioVisible: false,
      editTestScenarioVisible: false,
      addTestScenarioForm: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        label: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      },
      editTestScenarioForm: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        label: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      },
      userName: sessionStorage.getItem('userName'),
      language: localStorage.getItem('language'),
      form: {
        name: '',
        locale: ''
      },
      defaultIconFile: [],
      scenarios: [],
      label: [
        {
          value: 'EdgeGallery',
          label: 'EdgeGallery',
          labelEn: 'EdgeGallery'
        },
        {
          value: '中国联通',
          label: '中国联通',
          labelEn: 'China Union'
        },
        {
          value: '中国电信',
          label: '中国电信',
          labelEn: 'China Telecom'
        },
        {
          value: '中国移动',
          label: '中国移动',
          labelEn: 'China Mobile'
        }
      ]
    }
  },
  methods: {
    getAllScene () {
      this.form.locale = this.language === 'cn' ? 'ch' : 'en'
      Userpage.getAllSceneApi(this.form).then(res => {
        this.scenarios = res.data
      }).catch(() => {})
    },
    handleClose () {
      this.addTestScenarioVisible = false
      this.editTestScenarioVisible = false
      this.addTestScenarioForm = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        label: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      }
      this.editTestScenarioForm = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        label: '',
        icon: [],
        base64Session: false,
        defaultActive: ''
      }
    },
    onclickAdd () {
      this.addTestScenarioVisible = true
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
          this.logoFileList = []
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
      this.editTestScenarioForm.base64Session = true
      this.defaultIconFile = []
      if (this.addTestScenarioForm.defaultActive === index || this.editTestScenarioForm.defaultActive === index) {
        this.addTestScenarioForm.defaultActive = ''
        this.editTestScenarioForm.defaultActive = ''
        this.addTestScenarioForm.icon = []
        this.editTestScenarioForm.icon = []
        this.showErr = !this.defaultIconFile.length
      } else {
        this.addTestScenarioForm.defaultActive = index
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
    },
    editScenario (item) {
      this.editTestScenarioForm = item
      this.editId = item.id
      this.editTestScenarioVisible = true
      this.showErr = this.logoFileList
      this.chooseDefaultIcon(this.defaultIcon[0], 0)
    },
    conversionIcon (file) {
      let image = new Image()
      image.src = file
      image.onload = () => {
        // 将静态图片转化为base64
        let base64 = this.getBase64Image(image)
        // base64转化为文件流
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
      let dataURL = canvas.toDataURL('image/' + ext)
      return dataURL
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
      let fd = new FormData()
      fd.append('nameCh', this.addTestScenarioForm.nameCh)
      fd.append('nameEn', this.addTestScenarioForm.nameEn)
      fd.append('descriptionCh', this.addTestScenarioForm.descriptionCh)
      fd.append('descriptionEn', this.addTestScenarioForm.descriptionEn)
      fd.append('label', this.addTestScenarioForm.label)
      // this.conversionIcon(this.icon[0])
      // fd.append('icon', this.icon[0])
      fd.append('icon', this.addTestScenarioForm.icon.length > 0 ? this.addTestScenarioForm.icon[0] : this.defaultIconFile)
      ModelMgmt.createTestScenarioApi(fd).then(res => {
        this.getAllScene()
        this.addTestScenarioVisible = false
        this.clearFormData(this.addTestScenarioForm)
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: '创建失败',
          type: 'warning'
        })
        this.addCaseVisible = false
        this.addTestScenarioVisible = false
      })
    },
    confirmEditTestScenario () {
      let fd = new FormData()
      fd.append('nameCh', this.editTestScenarioForm.nameCh)
      fd.append('nameEn', this.editTestScenarioForm.nameEn)
      fd.append('descriptionCh', this.editTestScenarioForm.descriptionCh)
      fd.append('descriptionEn', this.editTestScenarioForm.descriptionEn)
      fd.append('label', this.editTestScenarioForm.label)
      // this.conversionIcon(this.icon[0])
      // fd.append('icon', this.icon[0])
      fd.append('icon', this.addTestScenarioForm.icon.length > 0 ? this.editTestScenarioForm.icon[0] : this.defaultIconFile)
      ModelMgmt.editTestScenarioApi(fd, this.editId).then(res => {
        this.getAllScene()
        this.addTestScenarioVisible = false
        this.clearFormData(this.editTestScenarioForm)
        this.editTestScenarioVisible = false
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: '修改失败',
          type: 'warning'
        })
        this.addCaseVisible = false
        this.editTestScenarioVisible = false
      })
    },
    clearFormData (form) {
      form.nameCh = ''
      form.nameEn = ''
      form.descriptionCh = ''
      form.descriptionEn = ''
      form.label = ''
    },
    onDelete (id) {
      this.$confirm(this.$t('promptMessage.deletePrompt'), this.$t('promptMessage.prompt'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        ModelMgmt.deleteTestScenarioApi(id).then(res => {
          this.getAllScene()
          this.$message({
            duration: 2000,
            message: '删除成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            duration: 2000,
            message: '删除失败',
            type: 'warning'
          })
        })
      }).catch(() => {
      })
    }
  },
  mounted () {
    this.getAllScene()
    this.showErr = this.logoFileList
    this.chooseDefaultIcon(this.defaultIcon[0], 0)
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
.testscenarios{
  .scenarioTop {
    // height: 300px;
    display: flex;
    .searchBar {
      width: 90%;
    }
    .addBtn{
      padding: 5px 55px;
    }
    .searchInput{
      width: 200px;
      margin-right: 15px;
    }

  }
  background-color: white;
  .allscene{
    display: flex;
    flex-wrap: wrap;
    .list {
      width: 23%;
      margin: 0 10px 10px;
      padding:15px 0 15px 15px;
      border: 3px solid#1ececa;
      border-left: 10px solid #1ececa;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: transform 0.3s ease-in;
      background-color: #f8f8f8;
      .el-form{
      width:100%;
      .el-form-item{
        margin-bottom: 8px;
          .button:nth-child(2){
            margin-right:15px;
          }
        }
      }
    }
    .list:hover{
      transform: translate3d(0,-10px,0);
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      background-color: #fff;
      border: 3px solid#9163cc;
      border-left: 10px solid #9163cc;
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
</style>
