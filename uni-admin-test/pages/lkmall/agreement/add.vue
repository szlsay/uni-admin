<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="update_time" label="更新时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.update_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="title" label="标题">
        <uni-easyinput placeholder="请填写标题" v-model="formData.title" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="content" label="内容">
        <uni-easyinput placeholder="请填写内容" v-model="formData.content" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="protocol_type" label="协议类型">
        <uni-data-checkbox v-model="formData.protocol_type" :localdata="formOptions.protocol_type_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '@/js_sdk/validator/lk-mall-agreement.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'lk-mall-agreement';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "update_time": null,
        "title": "",
        "content": "",
        "protocol_type": 0
      }
      return {
        formData,
        formOptions: {
          "protocol_type_localdata": [
            {
              "text": "注册协议",
              "value": 0
            },
            {
              "text": "隐私协议",
              "value": 1
            },
            {
              "text": "店铺协议",
              "value": 2
            },
            {
              "text": "会员协议",
              "value": 3
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
