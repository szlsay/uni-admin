<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="img" label="图片">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png" return-type="object" v-model="formData.img"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="name" label="名称">
        <uni-easyinput placeholder="请输入名称" v-model="formData.name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="remark" label="备注">
        <uni-easyinput placeholder="请输入备注" v-model="formData.remark"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sort" label="排序">
        <uni-easyinput placeholder="请输入排序" type="number" v-model="formData.sort"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="type" label="类型">
        <uni-easyinput placeholder="请输入类型" v-model="formData.type"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="url" label="地址">
        <uni-easyinput placeholder="请输入地址" v-model="formData.url"></uni-easyinput>
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
  import { validator } from '@/js_sdk/validator/st-shop-navigation.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'st-shop-navigation';

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
        "img": null,
        "name": "",
        "remark": "",
        "sort": null,
        "type": "",
        "url": ""
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
