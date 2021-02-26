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
        <span>测试场景管理</span>
      </div>
      <div class="testscenarios padding20">
        <div class="scenarioTop">
          <div class="searchBar">
            <el-form
              ref="form"
              :model="form"
              label-width="100px"
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
                  >
                    {{ $t('common.search') }}
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="rt">
            <el-button
              type="primary"
              size="small"
            >
              {{ $t('testCase.add') }}
            </el-button>
          </div>
        </div>
        <div class="allscene">
          <div class="list">
            <el-form label-width="auto">
              <el-form-item :label="$t('modelmgmt.name')">
                联通场景
              </el-form-item>
              <el-form-item :label="$t('modelmgmt.description')">
                适用于联通测试场景
              </el-form-item>
              <el-form-item class="rt">
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
          <div class="list">
            <el-form label-width="auto">
              <el-form-item :label="$t('modelmgmt.name')">
                移动场景
              </el-form-item>
              <el-form-item :label="$t('modelmgmt.description')">
                适用于移动测试场景
              </el-form-item>
              <el-form-item class="rt">
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
          <div class="list">
            <el-form label-width="auto">
              <el-form-item :label="$t('modelmgmt.name')">
                社区场景
              </el-form-item>
              <el-form-item :label="$t('modelmgmt.description')">
                适用于社区测试场景
              </el-form-item>
              <el-form-item class="rt">
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
      </div>
    </div>
  </div>
</template>
<script>
import Navcomp from '../../components/layout/Nav'
// import pagination from '../../components/common/Pagination.vue'
export default {
  components: { Navcomp },
  data () {
    return {
      form: {
        name: ''
      }
    }
  }
}
</script>
<style lang="less">
.testscenarios{
  .scenarioTop {
    height: 300px;
    .searchBar {
      padding-top: 100px;
    margin-left: 600px;
    }
    .searchInput{
      width: 200px;
      margin-right: 15px;
    }

  }
  background-color: white;
  .allscene{
    display: flex;
    .list {
      width: 33%;
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
