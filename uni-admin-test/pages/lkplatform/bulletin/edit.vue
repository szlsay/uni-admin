<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="title" label="公告标题">
        <uni-easyinput placeholder="请输入公告标题" v-model="formData.title"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="content" label="公告内容">
        <uni-easyinput placeholder="请输入公告内容" v-model="formData.content"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="start_date" label="开始时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.start_date" placeholder="请选择开始时间"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="end_date" label="结束时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.end_date" placeholder="请选择结束时间"></uni-datetime-picker>
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
  import { validator } from '@/js_sdk/validator/lk-platform-bulletin.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'lk-platform-bulletin';

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
        "title": "",
        "content": "",
        "start_date": null,
        "end_date": null,
        "create_date": null
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
        db.collection(dbCollectionName).doc(id).field("title,content,start_date,end_date,create_date").get().then((res) => {
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
