<template>
  <div class="addConfigDig">
    <el-dialog
      :visible.sync="addConfigVisible"
      :title="this.operate==='add'? $t('home.addConfig'):$t('home.modifyConfig')"
      :close-on-click-modal="false"
      class="addConfig"
    >
      <el-form
        label-width="auto"
        :model="form"
        ref="configForm"
        :rules="rules"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item
              :label="$t('testCase.nameCn')"
              prop="nameCh"
            >
              <el-input
                v-model="form.nameCh"
                placeholder="请输入"
                maxlength="64"
              />
            </el-form-item>
          </el-col>
          <el-col
            :offset="2"
            :span="10"
          >
            <el-form-item
              :label="$t('testCase.nameEn')"
              prop="nameEn"
            >
              <el-input
                v-model="form.nameEn"
                placeholder="请输入"
                maxlength="64"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              :label="$t('testCase.descriptionCn')"
              prop="descriptionCh"
            >
              <el-input
                v-model="form.descriptionCh"
                placeholder="请输入"
                maxlength="255"
              />
            </el-form-item>
          </el-col>
          <el-col
            :offset="2"
            :span="10"
          >
            <el-form-item
              :label="$t('testCase.descriptionEn')"
              prop="descriptionEn"
            >
              <el-input
                v-model="form.descriptionEn"
                placeholder="请输入"
                maxlength="255"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item
              :label="$t('home.configParam')"
              prop="configuration"
            >
              <el-input
                v-model="form.configuration"
                placeholder="请输入"
                @focus="configParameter"
                maxlength="2000"
              >
                <em
                  slot="suffix"
                  class="search_icon"
                  @click="configParameter"
                />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          class="light-button"
          size="small"
          @click="closeAddDig"
        >
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          class="dark-button"
          size="small"
          @click="confirmData"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="configParameterVis"
      width="45%"
      :title="$t('home.configParam')"
      :close-on-click-modal="false"
      class="innerSelectConfig"
    >
      <div class="innerVisible_div">
        <p class="operation_btn">
          <em
            class="el-icon-circle-plus-outline curp"
            @click="addListData"
          />
        </p>
        <p
          v-for="(item,index) in otherData"
          :key="index"
          class="container clear"
        >
          <el-input
            type="text"
            size="small"
            v-model="item.name"
          />
          <span class="equal">=</span>
          <el-input
            type="text"
            size="small"
            v-model="item.value"
          />
          <em
            class="el-icon-delete curp"
            @click="deleteListData(index)"
          />
        </p>
      </div>
      <div slot="footer">
        <el-button
          class="light-button"
          size="small"
          @click="configParameterVis=false"
        >
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          class="dark-button"
          size="small"
          @click="confirmParameterData"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
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
          {{ $t('promptMessage.deleteContrubuteCase') }}
        </p>
      </div>
      <div
        slot="footer"
      >
        <el-button
          class="light-button"
          @click="closedeletedig"
          size="small"
        >
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          class="dark-button"
          @click="confirmDelete"
          size="small"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Taskmgmt } from '../../tools/api.js'
export default {
  props: {
    addConfigVisible: {
      type: Boolean,
      default: false
    },
    operate: {
      type: String,
      default: ''
    },
    deleteid: {
      type: String,
      default: ''
    },
    modifyData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    deleteVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var validateNameEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.nameEmpty')))
      } else {
        callback()
      }
    }
    var validateDescEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.descriptionEmpty')))
      } else {
        callback()
      }
    }
    var validateConfigEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('promptMessage.configEmpty')))
      } else {
        callback()
      }
    }
    return {
      configParameterVis: false,
      otherData: [],
      form: {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        configuration: ''
      },
      modifyId: '',
      rules: {
        nameCh: [
          { required: true, validator: validateNameEmpty, trigger: 'blur' }
        ],
        descriptionCh: [
          { required: true, validator: validateDescEmpty, trigger: 'blur' }
        ],
        configuration: [
          { required: true, validator: validateConfigEmpty, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    addConfigVisible: function () {
      if (this.addConfigVisible) {
        this.init()
      }
    }
  },
  methods: {
    resetForm () {
      if (this.$refs['configForm']) {
        this.$refs['configForm'].resetFields()
      }
    },
    init () {
      this.resetForm()
      if (this.operate === 'modify') {
        if (this.modifyData) {
          this.form = JSON.parse(JSON.stringify(this.modifyData))
          this.modifyId = this.modifyData.id
        }
      } else {
        this.form = {
          nameCh: '',
          nameEn: '',
          descriptionCh: '',
          descriptionEn: '',
          configuration: ''
        }
      }
    },
    closeAddDig () {
      this.$emit('closedig')
      this.form = {
        nameCh: '',
        nameEn: '',
        descriptionCh: '',
        descriptionEn: '',
        configuration: ''
      }
    },
    configParameter () {
      this.configParameterVis = true
      this.otherData = []
      let str = this.form.configuration
      if (str) {
        let arrTemp = str.split(';')
        arrTemp.forEach(item => {
          let obj = {
            name: '',
            value: ''
          }
          obj.name = item.split('=')[0]
          obj.value = item.split('=')[1]
          this.otherData.push(obj)
        })
      } else {
        this.otherData = [
          {
            name: '',
            value: ''
          }
        ]
      }
    },
    addListData () {
      let obj = {
        name: '',
        value: ''
      }
      this.otherData.unshift(obj)
    },
    deleteListData (index) {
      this.otherData.splice(index, 1)
    },
    confirmParameterData () {
      let nullMum = 0
      this.otherData.forEach(item => {
        if (item.name === '' || item.value === '') {
          nullMum++
        }
      })
      if (nullMum === 0) {
        let str = ''
        this.otherData.forEach(item => {
          str += item.name + '=' + item.value + ';'
        })
        this.form.configuration = str
        this.configParameterVis = false
      } else {
        this.$message.warning('请填写完整的信息')
      }
    },
    confirmData () {
      this.$refs['configForm'].validate((valid) => {
        if (valid) {
          let params = {}
          params.nameCh = this.form.nameCh
          params.nameEn = this.form.nameEn
          params.descriptionCh = this.form.descriptionCh
          params.descriptionEn = this.form.descriptionEn
          params.configuration = this.form.configuration
          if (this.operate === 'add') {
            Taskmgmt.createConfigApi(params).then(res => {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'success',
                message: this.$t('promptMessage.addSuccess')
              })
              this.$parent.getConfigList()
            })
          } else {
            Taskmgmt.modifyConfigApi(this.modifyId, params).then(res => {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'success',
                message: this.$t('promptMessage.modifySuccess')
              })
              this.$parent.getConfigList()
            })
          }
          this.$nextTick(() => {
            this.$refs['configForm'].resetFields()
          })
          this.$emit('closedig')
        } else {
          return false
        }
      })
    },
    closedeletedig () {
      this.$emit('closedeletedig')
    },
    confirmDelete () {
      Taskmgmt.deleteConfigApi(this.deleteid).then(res => {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'success',
          message: this.$t('promptMessage.deleteSuccess')
        })
        this.closedeletedig()
        this.$parent.getConfigList()
      }).catch(error => {
        this.closedeletedig()
        if (error.response.data.message.indexOf('canfig is used by test case') !== -1) {
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$t('promptMessage.configUsed'),
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
    }
  }
}
</script>
<style lang="less">
.addConfigDig{
    .el-dialog{
      border-radius: 10px;
    }
    .el-dialog__header{
      border: none;
      padding: 28px 60px;
      background-color: #e5e5e5;
      border-radius: 10px 10px 0 0;
      .el-dialog__headerbtn{
        display: none;
      }
    }
    .el-dialog__title{
        font-size: 20px !important;
        color: #5e40c8 !important;
    }
    .el-dialog__title::before{
      content: '';
      display:inline-block;
      width:10px;
      height:10px;
      margin-right:10px;
      background: #5633cd;
      position: relative;
      border-radius: 2px;
    }
    .el-dialog__body{
      padding: 3%  7% !important;
      text-align: center;
    }
    .el-dialog__footer{
      border-radius: 0 0 10px 10px;
    }
    .el-dialog__body,.el-dialog__footer{
      background-color: #efefef;
    }
      .el-input__inner{
        border-radius: 8px;
        border: none;
        height: 36px;
        line-height: 36px;
      }
  .addConfig{
    .el-form-item{
      .el-form-item__label{
        color: #5844be;
        height: 36px;
        line-height: 36px;
      }
      .search_icon{
          display: inline-block;
          width: 17px;
          height: 16px;
          background: url('../../assets/images/configparams.png');
          position: relative;
          top: 5px;
          cursor: pointer;
          margin-right: 5px;
      }
    }
  }
  .innerSelectConfig{
    .innerVisible_div{
      .operation_btn{
        text-align: right;
        padding-bottom: 5px;
        .el-icon-circle-plus-outline{
          font-size: 20px;
          color: #a9a2c3;
        }
      }
      .container{
        padding-top: 15px;
        .el-input{
          float: left;
          width: calc((100% - 65px)/2);
        }
        .equal{
          float: left;
          width: 15px;
          height: 32px;
          line-height: 32px;
          margin: 0 10px;
          font-size: 28px;
        }
        .el-icon-delete{
          color: #a9a2c3;
          width: 30px;
          height: 32px;
          line-height: 32px;
          font-size: 18px;
          text-align: right;
        }
      }
    }
  }
}
</style>
