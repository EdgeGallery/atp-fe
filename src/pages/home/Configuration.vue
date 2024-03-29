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
    <div class="config-main padding_deafult">
      <div class="title_top title_left defaultFontBlod">
        {{ $t('home.configMgmt') }}
        <span class="line_bot" />
        <el-button
          v-if="isAdmin"
          type="button"
          class="el-button newproject_btn linearGradient"
          id="newproject_btn"
          @click="addConfig"
        >
          <span><em class="new_icon" /> {{ $t('home.addConfig') }} </span>
        </el-button>
      </div>
      <div class="project-list  common-div">
        <div class="search">
          <el-input
            v-model="enterQuery"
            :placeholder="$t('testCase.provideNameSearch')"
            id="inputProjectName"
            prefix-icon="el-icon-search"
            class="common-input enterinput"
            @clear="selectConfigList"
            @change="selectConfigList"
          />
        </div>
        <div class="content">
          <el-table
            v-loading="dataLoading"
            :data="pageData"
            class="common-table"
          >
            <el-table-column
              prop="id"
              :label="$t('home.configId')"
            />
            <el-table-column
              :label="$t('home.configName')"
            >
              <template scope="scope">
                {{ language==='cn'?scope.row.nameCh:scope.row.nameEn }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('testCase.description')"
            >
              <template scope="scope">
                {{ language==='cn'?scope.row.descriptionCh:scope.row.descriptionEn }}
              </template>
            </el-table-column>
            <el-table-column
              prop="configuration"
              :label="$t('home.configParam')"
              :show-overflow-tooltip="false"
            >
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  trigger="hover"
                  v-if="scope.row.configuration.length>50"
                >
                  <span>{{ scope.row.configuration }}</span>
                  <div slot="reference">
                    {{ scope.row.configuration | ellipsis }}
                  </div>
                </el-popover>
                <span v-else>{{ scope.row.configuration | ellipsis }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('myApp.operation')"
              width="180"
              v-if="isAdmin"
            >
              <template slot-scope="scope">
                <el-button
                  class="configBtn"
                  @click="deleteConfig(scope.row.id)"
                >
                  {{ $t('common.delete') }}
                </el-button>
                <el-button
                  class="configBtn"
                  @click="modifyConfig(scope.row)"
                >
                  {{ $t('common.modify') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="pagebar"
            style="margin-top: 20px"
          >
            <pagination
              :table-data="pageData"
              @getCurrentPageData="getCurrentPageData"
              :list-total="listTotal"
            />
          </div>
        </div>
      </div>
    </div>
    <addConfigDig
      :modify-data="modifyData"
      :deleteid="deleteid"
      :operate="operate"
      :add-config-visible="addConfigVisible"
      :delete-visible="deleteVisible"
      @closedig="closedig"
      @closedeletedig="closedeletedig"
    />
  </div>
</template>
<script>
import Navcomp from '../../components/layout/Nav.vue'
import Pagination from '../../components/common/Pagination.vue'
import { Taskmgmt } from '../../tools/api.js'
import addConfigDig from './addConfigDig.vue'
export default {
  name: 'Configuration',
  components: { Navcomp, Pagination, addConfigDig },
  data () {
    return {
      pageData: [],
      dataLoading: false,
      ids: [],
      language: localStorage.getItem('language'),
      enterQuery: '',
      limitSize: 5,
      offsetPage: 0,
      locale: '',
      listTotal: 0,
      addConfigVisible: false,
      deleteVisible: false,
      operate: '',
      modifyData: {},
      deleteid: '',
      currentPage: 1,
      isAdmin: false
    }
  },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 50) {
        return value.slice(0, 50) + '...'
      }
      return value
    }
  },
  mounted () {
    let _timer = setTimeout(() => {
      clearTimeout(_timer)
      this.initUser()
    }, 500)
    this.getConfigList()
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
    },
    offsetPage (val, oldVal) {
      this.offsetPage = val
      this.getConfigList()
    },
    limitSize (val, oldVal) {
      this.limitSize = val
      this.getConfigList()
    }
  },
  methods: {
    initUser () {
      let _authorities = sessionStorage.getItem('authorities')
      if (_authorities && _authorities.length > 0) {
        this.isAdmin = _authorities.includes('ROLE_ATP_ADMIN')
      }
    },
    getCurrentPageData (val, pageSize, start) {
      this.limitSize = pageSize
      this.offsetPage = start
    },
    selectConfigList () {
      sessionStorage.setItem('currentPage', 1)
      this.getConfigList()
    },
    getConfigList () {
      this.locale = this.language === 'cn' ? 'ch' : 'en'
      const params = { name: this.enterQuery, locale: this.locale, limit: this.limitSize, offset: this.offsetPage }
      Taskmgmt.getConfigApi(params).then(res => {
        this.pageData = res.data.results
        this.listTotal = res.data.total
        this.dataLoading = false
      }).catch(() => {
        this.dataLoading = false
      })
    },
    closedig () {
      this.addConfigVisible = false
    },
    addConfig () {
      this.operate = 'add'
      this.addConfigVisible = true
    },
    modifyConfig (row) {
      this.modifyData = row
      this.operate = 'modify'
      this.addConfigVisible = true
    },
    deleteConfig (Id) {
      this.deleteVisible = true
      this.deleteid = Id
    },
    closedeletedig () {
      this.deleteVisible = false
    }
  },
  beforeRouteEnter (to, from, next) {
    sessionStorage.removeItem('currentPage')
    next()
  }
}
</script>
<style lang="less">
.config-main{
  position: relative;
  .newproject_btn{
    position: absolute;
    right: 0;
    bottom: 30px;
    height: 50px;
    color: #fff;
    font-size: 20px;
    border-radius: 25px;
    padding: 0 35px;
    .new_icon{
      display: inline-block;
      width: 19px;
      height: 19px;
      background: url('../../assets/images/work_new_project.png');
      margin-right: 3px;
      position: relative;
      top: 2px;
    }
  }
    .el-button.linearGradient{
      background-image: linear-gradient(127deg, #4444d0, #6724cb);
      border: none;
    }
    .el-button.linearGradient span{
      position: relative;
      z-index: 2;
    }
    .el-button.linearGradient::after {
      content: '';
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
    .el-button.linearGradient:active{
      background-image: linear-gradient(127deg,#4a4aac,#6724cb);
      border: none;
    }
  .project-list{
    margin-bottom: 100px;
    .content{
      padding: 20px 0;
      .el-button.configBtn{
        color: #7a6e8a;
        border: none;
        background-color: #efefef;
        padding: 5px 9px;
      }
    }
  }
}
</style>
