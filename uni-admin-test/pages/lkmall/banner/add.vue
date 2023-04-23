<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="update_time" label="更新时间">
				<uni-datetime-picker return-type="timestamp" v-model="formData.update_time" placeholder="请选择更新时间"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="image" label="图片">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object" v-model="formData.image"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="url" label="链接">
        <uni-easyinput placeholder="请填写链接" v-model="formData.url"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="device_type" label="设备类型">
        <uni-data-checkbox v-model="formData.device_type" :localdata="formOptions.device_type_localdata"></uni-data-checkbox>
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
  import { validator } from '@/js_sdk/validator/lk-mall-banner.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'lk-mall-banner';

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
        "image": null,
        "url": "",
        "device_type": 0
      }
      return {
        formData,
        formOptions: {
          "device_type_localdata": [
            {
              "text": "未知",
              "value": 0
            },
            {
              "text": "ios",
              "value": 1
            },
            {
              "text": "android",
              "value": 2
            },
            {
              "text": "app",
              "value": 3
            },
            {
              "text": "windows",
              "value": 4
            },
            {
              "text": "mac",
              "value": 5
            },
            {
              "text": "linux",
              "value": 6
            },
            {
              "text": "pc",
              "value": 7
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
