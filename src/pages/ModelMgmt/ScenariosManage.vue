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
        <span>应用测试平台</span>
        <span>></span>
        <span>测试场景管理</span>
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
                >
                  {{ $t('common.delete') }}
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="button"
                >
                  {{ $t('common.edit') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-dialog
          :visible.sync="addTestScenarioVisible"
          title="创建测试场景"
          :close-on-click-modal="false"
          width="30%"
        >
          <el-form
            :model="addTestScenarioForm"
            label-width="110px"
          >
            <el-form-item
              label="测试场景中文名"
              prop="nameCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestScenarioForm.nameCh"
              />
            </el-form-item>
            <el-form-item
              label="测试场景英文名"
              prop="nameEn"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestScenarioForm.nameEn"
              />
            </el-form-item>
            <el-form-item
              label="测试场景描述中文"
              prop="descriptionCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestScenarioForm.descriptionCh"
              />
            </el-form-item>
            <el-form-item
              label="测试场景描述英文"
              prop="descriptionEn"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestScenarioForm.descriptionEn"
              />
            </el-form-item>
            <el-form-item label="测试场景标签">
              <el-select
                v-model="addTestScenarioForm.label"
                placeholder="选择标签"
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
      icon: [require('../../assets/images/logo.png')],
      addTestScenarioVisible: false,
      addTestScenarioForm: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        label: '',
        icon: ''
      },
      userName: sessionStorage.getItem('userName'),
      language: localStorage.getItem('language'),
      form: {
        name: '',
        locale: ''
      },
      defaultIconFile: [],
      scenarios: [{ 'id': '4d203111-1111-4f62-aabb-8ebcec357f87', 'nameCh': '社区场景', 'nameEn': 'EdgeGallery Community Scenario', 'descriptionCh': '适用于社区场景的测试', 'descriptionEn': 'suite for EdgeGallery community test', 'label': 'EdgeGallery' }, { 'id': 'e71718a5-864a-49e5-855a-5805a5e9f97d', 'nameCh': '中国联通', 'nameEn': 'China Unicom Scenario', 'descriptionCh': '适用于中国联通场景的测试', 'descriptionEn': 'suite for China Unicom test', 'label': 'China Unicom' }, { 'id': '6fe8581c-b83f-40c2-8f5b-505478f9e30b', 'nameCh': '中国移动', 'nameEn': 'China Mobile Scenario', 'descriptionCh': '适用于中国移动场景的测试', 'descriptionEn': 'suite for China Mobile test', 'label': 'China Mobile' }, { 'id': '96a82e85-d40d-4ce5-beec-2dd1c9a3d41d', 'nameCh': '中国电信', 'nameEn': 'China Telecom Scenario', 'descriptionCh': '适用于中国电信场景的测试', 'descriptionEn': 'suite for China Telecom test', 'label': 'China Telecom' }],
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
      this.addTestScenarioForm = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        label: '',
        icon: ''
      }
    },
    onclickAdd () {
      this.addTestScenarioVisible = true
    },
    conversionIcon (file) {
      let image = new Image()
      image.src = file
      image.onload = () => {
        // 将静态图片转化为base64
        let base64 = this.getBase64Image(image)
        // base64转化为文件流
        this.defaultIconFile.push(this.base64toFile(base64))
        this.icon = this.defaultIconFile
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
      this.conversionIcon(this.icon[0])
      fd.append('icon', this.icon[0])
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
      })
    },
    clearFormData (form) {
      form.nameCh = ''
      form.nameEn = ''
      form.descriptionCh = ''
      form.descriptionEn = ''
      form.label = ''
    }
  },
  mounted () {
    this.getAllScene()
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
}
</style>
