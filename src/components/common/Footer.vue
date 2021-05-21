<!--
  -  Copyright 2020-2021 Huawei Technologies Co., Ltd.
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
  <div class="footerBar">
    <div class="footer_list">
      <div class="list_div padding_default clear">
        <ul>
          <li>
            <p class="tit">
              {{ $t('footer.about') }} EdgeGallery
            </p>
            <p>
              <el-link
                :href="egUrl"
                target="_blank"
              >
                EdgeGallery {{ $t('footer.website') }}
              </el-link>
            </p>
            <p>
              <el-link
                :href="appStoreUrl"
                target="_blank"
              >
                AppStore
              </el-link>
            </p>
            <p>
              <el-link
                :href="developerUrl"
                target="_blank"
              >
                Developer
              </el-link>
            </p>
            <p>
              <el-link
                :href="mecmUrl"
                target="_blank"
              >
                MECM
              </el-link>
            </p>
          </li>
          <li>
            <p class="tit">
              {{ $t('footer.containerResource') }}
            </p>
            <p>
              <el-link
                :href="videoUrl"
                target="_blank"
              >
                {{ $t('footer.videoResource') }}
              </el-link>
            </p>
            <p>
              <el-link
                :href="trainUrl"
                target="_blank"
              >
                {{ $t('footer.trainingMaterials') }}
              </el-link>
            </p>
          </li>
          <li>
            <p class="tit">
              {{ $t('footer.developer') }}
            </p>
            <p>
              <el-link
                :href="docUrl"
                target="_blank"
              >
                {{ $t('footer.docs') }}
              </el-link>
            </p>
            <p>
              <el-link
                :href="communicationUrl"
                target="_blank"
              >
                {{ $t('footer.communication') }}
              </el-link>
            </p>
            <p>
              <el-link
                :href="downloadUrl"
                target="_blank"
              >
                {{ $t('footer.softwareDownload') }}
              </el-link>
            </p>
          </li>
          <li>
            <p class="tit">
              {{ $t('footer.community') }}
            </p>
            <p>
              <el-link
                :href="projectUrl"
                target="_blank"
              >
                {{ $t('footer.project') }}
              </el-link>
            </p>
            <p>
              <el-link
                :href="membershipUrl"
                target="_blank"
              >
                {{ $t('footer.membership') }}
              </el-link>
            </p>
            <p>
              <el-link
                :href="contactUrl"
                target="_blank"
              >
                {{ $t('footer.contactUs') }}
              </el-link>
            </p>
          </li>
          <li>
            <p class="tit">
              {{ $t('footer.followUs') }}
            </p>
            <div class="icon_div">
              <div
                class="img_div"
                @mouseenter="showWechat=true"
                @mouseleave="showWechat=false"
              >
                <img
                  src="../../assets/images/footer_wechat.png"
                  alt=""
                  class="imgIcon"
                >
              </div>
              <el-collapse-transition>
                <div
                  class="showDiv footer_wechat"
                  v-show="showWechat"
                  @mouseenter="showWechat=true"
                  @mouseleave="showWechat=false"
                >
                  <img
                    src="../../assets/images/home_footer_wechat_eg.png"
                    alt=""
                  >
                </div>
              </el-collapse-transition>
              <el-collapse-transition>
                <div
                  class="showDiv footer_text"
                  v-show="showWechat"
                  @mouseenter="showWechat=true"
                  @mouseleave="showWechat=false"
                >
                  <el-link
                    :underline="false"
                    class="defaultLink"
                  >
                    {{ $t('footer.WeChatPublic') }}
                  </el-link>
                </div>
              </el-collapse-transition>
            </div>
            <div class="icon_div">
              <div
                class="img_div"
                @mouseenter="showGitee=true"
                @mouseleave="showGitee=false"
              >
                <img
                  src="../../assets/images/footer_gitee.png"
                  alt=""
                  class="imgIcon"
                >
              </div>
              <el-collapse-transition>
                <div
                  class="showDiv footer_text"
                  v-show="showGitee"
                  @mouseenter="showGitee=true"
                  @mouseleave="showGitee=false"
                >
                  <el-link
                    :href="giteeUrl"
                    target="_blank"
                  >
                    {{ $t('footer.codeWarehouse') }}
                  </el-link>
                </div>
              </el-collapse-transition>
            </div>
            <div class="icon_div">
              <div
                class="img_div"
                @mouseenter="showWeibo=true"
                @mouseleave="showWeibo=false"
              >
                <img
                  src="../../assets/images/footer_weibo.png"
                  alt=""
                  class="imgIcon"
                >
              </div>
              <el-collapse-transition>
                <div
                  class="showDiv footer_text"
                  v-show="showWeibo"
                  @mouseenter="showWeibo=true"
                  @mouseleave="showWeibo=false"
                >
                  <el-link
                    :href="weiboUrl"
                    target="_blank"
                  >
                    {{ $t('footer.followWeibo') }}
                  </el-link>
                </div>
              </el-collapse-transition>
            </div>
            <div class="icon_div">
              <div
                class="img_div"
                @mouseenter="showEmail=true"
                @mouseleave="showEmail=false"
              >
                <img
                  src="../../assets/images/footer_email.png"
                  alt=""
                  class="imgIcon"
                >
              </div>
              <el-collapse-transition>
                <div
                  class="showDiv footer_text"
                  v-show="showEmail"
                  @mouseenter="showEmail=true"
                  @mouseleave="showEmail=false"
                >
                  <el-link
                    :href="emailUrl"
                    target="_blank"
                  >
                    {{ $t('footer.mailingList') }}
                  </el-link>
                </div>
              </el-collapse-transition>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer_bot padding_default">
      <p>
        {{ $t('footer.copyright') }}
      </p>
      <p class="right">
        <el-link
          :href="legalNoticeUrl"
          target="_blank"
        >
          {{ $t('footer.legalNotice') }}
        </el-link>
        <span>|</span>
        <el-link
          :href="privacyPolicyUrl"
          target="_blank"
        >
          {{ $t('footer.privacyPolicy') }}
        </el-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterBar',
  data () {
    return {
      language: localStorage.getItem('language'),
      appStoreUrl: '',
      developerUrl: '',
      mecmUrl: '',
      videoUrl: 'https://www.edgegallery.org/video/',
      trainUrl: 'https://www.edgegallery.org/training-material/',
      docUrl: 'http://docs.edgegallery.org/zh_CN/latest/',
      communicationUrl: 'https://www.edgegallery.org/communication/',
      downloadUrl: 'https://www.edgegallery.org/software-download/',
      projectUrl: 'https://www.edgegallery.org/project/',
      membershipUrl: 'https://www.edgegallery.org/membership/',
      contactUrl: 'https://www.edgegallery.org/contact-us/',
      legalNoticeUrl: 'https://www.edgegallery.org/%e6%b3%95%e5%be%8b%e5%a3%b0%e6%98%8e/',
      privacyPolicyUrl: 'https://www.edgegallery.org/%e9%9a%90%e7%a7%81%e6%94%bf%e7%ad%96/',
      egUrl: 'https://www.edgegallery.org/',
      giteeUrl: 'https://gitee.com/edgegallery',
      weiboUrl: 'https://weibo.com/u/7575392977?is_all=1',
      emailUrl: 'https://edgegallery.groups.io/g/main',
      showWechat: false,
      showGitee: false,
      showWeibo: false,
      showEmail: false
    }
  },
  mounted () {
    this.getPlatformUrl()
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
      if (this.language === 'cn') {
        this.egUrl = 'https://www.edgegallery.org/'
        this.videoUrl = 'https://www.edgegallery.org/video/'
        this.trainUrl = 'https://www.edgegallery.org/training-material/'
        this.communicationUrl = 'https://www.edgegallery.org/communication/'
        this.downloadUrl = 'https://www.edgegallery.org/software-download/'
        this.projectUrl = 'https://www.edgegallery.org/project/'
        this.membershipUrl = 'https://www.edgegallery.org/membership/'
        this.contactUrl = 'https://www.edgegallery.org/contact-us/'
        this.legalNoticeUrl = 'https://www.edgegallery.org/%e6%b3%95%e5%be%8b%e5%a3%b0%e6%98%8e/'
        this.privacyPolicyUrl = 'https://www.edgegallery.org/%e9%9a%90%e7%a7%81%e6%94%bf%e7%ad%96/'
      } else {
        this.egUrl = 'https://www.edgegallery.org/en/'
        this.videoUrl = 'https://www.edgegallery.org/en/video/'
        this.trainUrl = 'https://www.edgegallery.org/en/training-material/'
        this.communicationUrl = 'https://www.edgegallery.org/en/communication/'
        this.downloadUrl = 'https://www.edgegallery.org/en/software-download/'
        this.projectUrl = 'https://www.edgegallery.org/en/project/'
        this.membershipUrl = 'https://www.edgegallery.org/en/membership/'
        this.contactUrl = 'https://www.edgegallery.org/en/contact-us/'
        this.legalNoticeUrl = 'https://www.edgegallery.org/en/legal-notice/'
        this.privacyPolicyUrl = 'https://www.edgegallery.org/en/privacy-policy/'
      }
    }
  },
  methods: {
    getPlatformUrl () {
      let currUrl = window.location.origin
      if (currUrl.indexOf('30092') !== -1) {
        this.appStoreUrl = currUrl.replace('30094', '30091')
        this.developerUrl = currUrl.replace('30094', '30092')
        this.mecmUrl = currUrl.replace('30094', '30093')
      } else {
        this.appStoreUrl = currUrl.replace('atp', 'appstore')
        this.developerUrl = currUrl.replace('atp', 'developer')
        this.mecmUrl = currUrl.replace('atp', 'mecm')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.footerBar{
  width: 100%;
  z-index: 99;
  .footer_list{
    background: #380879;
    padding: 50px 0;
    color: #fff;
    ul{
      li{
        float: left;
        margin-right: 100px;
        p{
          margin-bottom: 18px;
        }
      }
      li:last-child{
        float: right;
        margin-right: 0;
        position: relative;
        .tit{
          text-align: right;
        }
        .icon_div{
          float: left;
          position: relative;
          margin-left: 30px;
          .defaultLink{
            cursor: default;
          }
        }
        .img_div{
          width: 41px;
          height: 41px;
          background: url('../../assets/images/footer_right_picbg.png');
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .imgIcon{
          transition: all 0.5s;
          cursor: pointer;
        }
        .imgIcon:hover{
          transform:rotate(360deg);
        }
        .showDiv{
          width: 160px;
          text-align: center;
          img{
            float: right;
            width: 130px;
          }
        }
      }
      .footer_wechat{
        position: absolute;
        left: -160px;
        bottom: 0;
        padding-right: 10px;
      }
      .footer_text{
        position: absolute;
        left: 50%;
        top: 40px;
        margin-left: -80px;
        .el-link{
          padding-top: 10px;
        }
      }
    }
    .tit{
      font-size: 16px;
      margin-bottom: 25px;
    }
    .el-link{
      color: #fff;
    }
    .el-link.el-link--default:after{
      border-color: #fff;
    }
  }
  .footer_bot{
    background: #e4e4e4;
    padding-bottom: 30px;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .record{
      font-size: 12px;
      display: inline-block;
      margin-top: 10px;
    }
    .right{
      .el-link{
        color: #000;
      }
      .el-link.el-link--default:after{
        border-color: #000;
      }
      span{
        margin: 0 13px;
        color: #000;
      }
    }
  }
}
</style>
