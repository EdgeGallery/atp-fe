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
  <div class="padding56">
    <div class="selectscene padding20">
      <div class="toptitle">
        <div class="left">
          {{ $t('userpage.selectScene') }}
        </div>
        <el-tooltip
          effect="light"
          content="点击贡献用例"
          placement="left"
        >
          <div
            class="right"
            @click="jumpToGitee()"
          >
            <img
              src="../../assets/images/gongxian.png"
              alt=""
            >
            <span> {{ $t('userpage.contribution') }}</span>
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
            <div style="text-align:center;background-color: #fff;">
              <img
                :src="getAppIcon(item)"
                alt=""
                class="sceneimage"
              >
            </div>
            <div class="choose">
              <el-form label-width="auto">
                <el-form-item :label="$t('modelmgmt.name')">
                  {{ language==='cn'?item.nameCh:item.nameEn }}
                </el-form-item>
                <el-form-item :label="$t('modelmgmt.description')">
                  {{ language==='cn'?item.descriptionCh:item.descriptionEn }}
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="text"
                    size="small"
                    class="button"
                    @click="getDetail(item)"
                  >
                    {{ $t('userpage.seeDetail') }}
                  </el-button>
                </el-form-item>
              </el-form>
              <img
                src="../../assets/images/selected.png"
                alt=""
                v-if="item.selected"
                @click="chooseScene(item)"
              >
              <img
                v-else
                src="../../assets/images/notselected.png"
                alt=""
                @click="chooseScene(item)"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="start-button">
        <el-button
          type="primary"
          size="large"
          @click="startTest()"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </div>
    <!-- 用例详情弹框 -->
    <el-dialog
      :visible.sync="CaseVisible"
      :title="$t('userpage.caseDetail')"
    >
      <div class="detailtitle">
        <span>{{ this.sceneTitle }}</span>
      </div>
      <el-collapse
        :value="opened"
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
      <div style="text-align:right;margin-top:15px;">
        <el-button
          type="primary"
          size="small"
          @click="handleClose()"
        >
          {{ $t('common.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Userpage, URL_PREFIX } from '../../tools/api.js'

export default {
  data () {
    return {
      currUrl: window.location.href,
      sceneData: [],
      datacn: [],
      dataen: [],
      scenarioIdList: [],
      CaseVisible: false,
      taskId: '',
      sceneTitle: '',
      testSuiteData: [],
      language: ''
    }
  },
  computed: {
    opened () {
      return this.testSuiteData.map((i) => {
        return i.nameEn
      })
    }
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
          item.selected = true
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
    },
    chooseScene (item) {
      this.scenarioIdList.push(item.id)
      item.selected = !item.selected
    },
    getAppIcon (item) {
      return URL_PREFIX + 'file/' + item.id
    },
    handleClose () {
      this.CaseVisible = false
    },
    getDetail (item) {
      if (this.language === 'cn') {
        this.sceneTitle = item.nameCh
      } else {
        this.sceneTitle = item.nameEn
      }
      let scenarioIds = []
      scenarioIds.push(item.id)
      this.CaseVisible = true
      let fd = new FormData()
      fd.append('scenarioIds', scenarioIds)
      Userpage.getSceneCaseApi(fd).then(res => {
        let data = res.data
        this.testSuiteData = data[0].testSuites
      }).catch(() => {})
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
        this.$router.push({ name: 'atpprocess', params: { taskId: this.taskId } })
      }).catch(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('promptMessage.runFailed'),
          type: 'error'
        })
      })
    },
    jumpToGitee () {
      window.open('https://gitee.com/edgegallery/community/tree/master/Integration%20WG/ATP%20Test%20Case%20Contribution', '_blank')
    }
  }
}
</script>
<style lang="less">
.selectscene{
  background-color: white;
  .toptitle{
    color: #688ef3;
    // background-color: #e1e7f5;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .left{
      line-height: 50px;
      font-weight: 600;
    }
    .right{
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      img{
        width: 30px;
        height: 30px;
        margin-left: 30px;
      }
      span{
        font-size: 16px;
      }
    }
  }
  .scene-main{
    display: flex;
    padding: 10px;
    flex-wrap: wrap;
    .contednt{
      width: 25%;
      padding: 0 15px 25px;
      // .scene:hover{
      //   transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      // }
      // .scene::after {
      //   position: absolute;
      //   top: 100%;
      //   left: 0;
      //   z-index: -1;
      //   display: block;
      //   content: '';
      //   height: 22px;
      //   width: 100%;
      //   background: url(/images/hotel/hotel_index/floating-card-shadow.png?a=1) no-repeat;
      //   background-size: 100%;
      // }
      .scene{
        // transform-style: preserve-3d;
        // will-change: transform;
        // width: 33%;
        height: 260px;
        border: 1px solid #d7dce6;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
        border-radius: 8px;
        position: relative;
        background-color: #fafafa;
        .sceneimage{
          margin: 0 auto;
          // width: 80%;
          height: 100px;
        }
        .choose{
          display: flex;
          justify-content: space-between;
          .el-form{
            // width:100%;
            .el-form-item__label{
              padding-left: 8px;
            }
            .el-form-item{
              margin-bottom: 0;
            }
            .el-form-item:nth-child(3){
              .el-form-item__content{
                margin-left: 0 !important;
              }
            }
          }
          .el-button--text{
            font-size: 14px;
            padding: 3px 8px;
            color: #688ef3;
          }
          .el-button--text:hover{
            color: #86a5f5;
            border-bottom: 1px solid #688ef3;
          }
          img{
            width: 30px;
            height: 30px;
            position: absolute;
            right: 10px;
            bottom: 15px;
          }
        }
      }
    }
    // .contednt:hover{
    //   transform: translate3d(0,-10px,0);
    // }
    @media screen and (max-width: 1320px) {
      .contednt{
          width: 33%;
      }
    }
  }
  .start-button{
    text-align: right;
  }
}
.el-dialog__body{
  padding: 0 20px 30px;
  .el-collapse{
    margin-left: 8px;
  }
  .el-collapse-item__header{
    padding-left: 8px;
    font-size: 15px;
    color: #fff;
    height: 30px;
    background-image: linear-gradient(to right, #688ef3 , #fff);
  }
  .el-icon-arrow-right:before {
    color: #000;
  }
  .detailtitle{
    height: 50px;
    line-height: 50px;
    padding-left: 8px;
    span{
      font-size: 18px;
      font-weight: 600;
      color: #688ef3;
    }
  }
  .el-table::before {
      width: 0;
  }
  table th,table td{
    border-bottom: none !important;
  }
}
</style>
