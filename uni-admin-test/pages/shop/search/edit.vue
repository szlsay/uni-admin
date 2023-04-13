<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="create_time" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="create_uid" label="">
        <uni-easyinput placeholder="请输入创建人id" v-model="formData.create_uid"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="keyword" label="关键词">
        <uni-easyinput placeholder="请输入关键词" v-model="formData.keyword"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="last_modify_time" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.last_modify_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="last_modify_uid" label="">
        <uni-easyinput placeholder="修改人id" v-model="formData.last_modify_uid"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="search_cnt" label="搜索次数">
        <uni-easyinput placeholder="请输入搜索次数" type="number" v-model="formData.search_cnt"></uni-easyinput>
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
  import { validator } from '@/js_sdk/validator/st-shop-search.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'st-shop-search';

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
        "create_time": null,
        "create_uid": "",
        "keyword": "",
        "last_modify_time": null,
        "last_modify_uid": "",
        "search_cnt": null
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
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
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("create_time,create_uid,keyword,last_modify_time,last_modify_uid,search_cnt").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
