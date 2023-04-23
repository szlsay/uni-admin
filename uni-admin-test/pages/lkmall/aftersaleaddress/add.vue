<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="contact_name" label="联系人姓名" required>
        <uni-easyinput placeholder="请填写联系人姓名" v-model="formData.contact_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="contact_tel" label="联系电话" required>
        <uni-easyinput placeholder="请填写联系电话" v-model="formData.contact_tel" trim="both" maxlength="11"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="area_code" label="省市区" required>
        <uni-data-picker self-field="code" parent-field="parent_code" v-model="formData.area_code" collection="opendb-city-china" orderby="value asc" field="code as value, name as text, eq(type, 2) as isleaf" @change="onChange"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="zip_code" label="邮编">
        <uni-easyinput placeholder="邮编" v-model="formData.zip_code" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="address" label="详细住址" required>
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
				"province_code": "",
				"city_code": "",
				"area_code": "",
				"province_name": "",
				"city_name": "",
				"area_name": "",
        "contact_name": "",
        "contact_tel": "",
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
			onChange(e) {
				console.log(e)
				if (e.detail && e.detail.value && e.detail.value.length === 3) {
					 const value = e.detail.value
					 this.formData.province_name = value[0].text
					 this.formData.province_code = value[0].value
					 this.formData.city_name = value[1].text
					 this.formData.city_code = value[1].value
					 this.formData.area_name = value[2].text
				}
			},
      
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
				value.province_name = this.formData.province_name
				value.province_code = this.formData.province_code
				value.city_name = this.formData.city_name
				value.city_code = this.formData.city_code
				value.area_name = this.formData.area_name
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
