<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="contact_name" label="联系人姓名">
        <uni-easyinput placeholder="请填写联系人姓名" v-model="formData.contact_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="contact_tel" label="联系电话">
        <uni-easyinput placeholder="请填写联系电话" v-model="formData.contact_tel" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="province_code" label="省">
        <uni-easyinput placeholder="省级编码" v-model="formData.province_code"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="city_code" label="市">
        <uni-easyinput placeholder="地级编码" v-model="formData.city_code"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="area_code" label="省市区">
        <uni-data-picker self-field="code" parent-field="parent_code" v-model="formData.area_code" collection="opendb-city-china" orderby="value asc" field="code as value, name as text, eq(type, 2) as isleaf"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="zip_code" label="邮编">
        <uni-easyinput placeholder="邮编" v-model="formData.zip_code" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="address" label="详细住址">
        <uni-easyinput placeholder="省市区后面的详细住址，包含街道小区房间号" v-model="formData.address" trim="both"></uni-easyinput>
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
  import { validator } from '@/js_sdk/validator/lk-mall-aftersaleaddress.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'lk-mall-aftersaleaddress';

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
        "contact_name": "",
        "contact_tel": "",
        "province_code": "",
        "city_code": "",
        "area_code": "",
        "zip_code": "",
        "address": ""
      }
      return {
        formData,
        formOptions: {},
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
