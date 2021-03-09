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
    <div class="padding56">
      <div style="margin:20px 0">
        <span>应用测试平台</span>
        <span>></span>
        <span>测试套管理</span>
      </div>
      <div class="testsuites padding20">
        <div class="searchBtn">
          <el-form
            ref="form"
            :model="form"
            label-width="100px"
          >
            <el-row>
              <el-col :span="4">
                <el-form-item :label="$t('modelmgmt.name')">
                  <el-input
                    class="searchInput"
                    size="small"
                    id="name"
                    v-model="form.name"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :label="$t('modelmgmt.scene')">
                  <el-select
                    v-model="value"
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
              </el-col>
              <el-col :span="6">
                <el-button
                  style="text-align:center;margin:5px 15px 0"
                  type="primary"
                  size="small"
                  @click="getAllSuites"
                >
                  {{ $t('common.search') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form>
          <div class="addBtn">
            <el-button
              v-if="userName==='admin'"
              type="primary"
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
            <el-form label-width="auto">
              <el-form-item :label="$t('modelmgmt.name')">
                {{ language === 'cn' ? item.nameCh :item.nameEn }}
              </el-form-item>
              <el-form-item :label="$t('modelmgmt.description')">
                {{ language === 'cn' ? item.descriptionCh :item.descriptionEn }}
              </el-form-item>
              <el-form-item :label="$t('modelmgmt.scene')">
                {{ item.scenarioIdList }}
              </el-form-item>
              <el-form-item
                class="rt"
                v-if="userName==='admin'"
              >
                <el-button
                  type="warning"
                  size="small"
                  class="button"
                  @click="deleteTestSuite(item.id)"
                >
                  {{ $t('common.delete') }}
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  class="button"
                  @click="editCase(item.id)"
                >
                  {{ $t('common.edit') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-dialog
          :visible.sync="addTestSuiteVisible"
          :title="dialogTitle"
          :close-on-click-modal="false"
          width="30%"
        >
          <el-form
            :model="addTestSuiteForm"
            label-width="110px"
          >
            <el-form-item
              label="测试套中文名"
              prop="nameCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestSuiteForm.nameCh"
                :disabled="cannotEdit"
              />
            </el-form-item>
            <el-form-item
              label="测试套英文名"
              prop="name"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestSuiteForm.nameEn"
              />
            </el-form-item>
            <el-form-item
              label="测试套描述中文"
              prop="name"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestSuiteForm.descriptionCh"
              />
            </el-form-item>
            <el-form-item
              label="测试套描述英文"
              prop="name"
            >
              <el-input
                width="100px"
                size="small"
                v-model="addTestSuiteForm.descriptionEn"
              />
            </el-form-item>
            <el-form-item :label="$t('modelmgmt.scene')">
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
              @click="handleClose"
              size="small"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="confirmAddTestSuite"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="editTestSuiteVisible"
          title="编辑测试套"
          :close-on-click-modal="false"
          width="30%"
        >
          <el-form
            :model="editTestSuiteForm"
            label-width="110px"
          >
            <el-form-item
              label="测试套中文名"
              prop="nameCh"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestSuiteForm.nameCh"
              />
            </el-form-item>
            <el-form-item
              label="测试套英文名"
              prop="name"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestSuiteForm.nameEn"
              />
            </el-form-item>
            <el-form-item
              label="测试套描述中文"
              prop="name"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestSuiteForm.descriptionCh"
              />
            </el-form-item>
            <el-form-item
              label="测试套描述英文"
              prop="name"
            >
              <el-input
                width="100px"
                size="small"
                v-model="editTestSuiteForm.descriptionEn"
              />
            </el-form-item>
            <el-form-item :label="$t('modelmgmt.scene')">
              <el-select
                v-model="editTestSuiteForm.scenarioList"
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
              @click="handleClose"
              size="small"
            >
              {{ $t('common.cancel') }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="editAddTestSuite"
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

export default {
  components: { Navcomp },
  data () {
    return {
      userName: sessionStorage.getItem('userName'),
      addTestSuiteVisible: false,
      editTestSuiteVisible: false,
      confirmBtnApi: '',
      dialogTitle: '',
      editid: '',
      cannotEdit: false,
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
        scenarioList: []
      },
      mapCh: new Map(),
      mapEn: new Map(),
      language: localStorage.getItem('language'),
      form: {
        locale: '',
        name: '',
        scenarioList: []
      },
      options: [],
      testScenes: [],
      testSuites: [],
      value: '',
      editId: ''
    }
  },
  methods: {
    async getAllSuites () {
      await this.fillOptions()
      this.form.locale = this.language === 'cn' ? 'ch' : 'en'
      if (this.value !== '') {
        this.form.scenarioList.push(this.value)
      } else {
        this.form.scenarioList = []
      }
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
          suite.scenarioIdList = scenarioList
        })
      }).catch(() => {})
    },
    handleClose () {
      this.addTestSuiteVisible = false
      this.editTestSuiteVisible = false
    },
    addTestSuiteBtn () {
      this.dialogTitle = '新增测试套'
      this.addTestSuiteVisible = true
    },
    editTestSuiteBtn () {
      this.editTestSuiteVisible = true
    },
    async fillOptions () {
      let cacheArray = []
      let para = { locale: '' }
      para.locale = this.language === 'cn' ? 'ch' : 'en'
      await Userpage.getAllSceneApi(para).then(res => {
        this.testScenes = res.data // 获取所有测试场景
      }).catch(() => {})
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
      let fd = new FormData()
      fd.append('nameCh', this.addTestSuiteForm.nameCh)
      fd.append('nameEn', this.addTestSuiteForm.nameEn)
      fd.append('descriptionCh', this.addTestSuiteForm.descriptionCh)
      fd.append('descriptionEn', this.addTestSuiteForm.descriptionEn)
      fd.append('scenarioIdList', this.addTestSuiteForm.scenarioList)
      ModelMgmt.createTestSuiteApi(fd).then(res => {
        this.addTestSuiteVisible = false
        this.getAllSuites()
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: '创建失败',
          type: 'warning'
        })
        this.addCaseVisible = false
      })
    },
    editAddTestSuite () {
      console.log('fortest')
    },
    editCase (id) {
      this.editId = id
      this.editTestSuiteVisible = true
    },
    deleteTestSuite (id) {
      ModelMgmt.deleteTestSuite(id).then(res => {
        console.log('Test suite got deleted')
      }).catch(() => {
        this.$message({
          duration: 2000,
          message: '删除失败',
          type: 'warning'
        })
      })
      this.getAllSuites()
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
.testsuites{
  background-color: white;
  .searchBtn{
    display: flex;
    .el-form{
      width: 90%;
    }
    .addBtn{
      padding: 5px 55px;
    }
  }
  .allsuite{
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
      justify-content: space-around;
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
