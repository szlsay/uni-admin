<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-forms-item name="company" label="">
				<uni-easyinput placeholder="公司名称" v-model="formData.company"></uni-easyinput>
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
	import {
		validator
	} from '@/js_sdk/validator/lk-platform-merchants.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'lk-platform-merchants';

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
				"company": ""
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
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},

			/**
			 * 提交表单
			 */
			async submitForm(value) {
				const obj = uniCloud.importObject('lkplatform')
				const res = await obj.editMerchants(this.formDataId, value)
				if (res.errCode === 0) {
					uni.showToast({
						title: res.errMsg
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				} else {
					uni.showModal({
						content: res.errMsg,
						showCancel: false
					})
				}
			},

			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			// async getDetail(id) {
			// 	uni.showLoading({
			// 		mask: true
			// 	})
			// 	const obj = uniCloud.importObject('lkplatform')
			// 	const res = await obj.getMerchants(id, "company")

			// 	// if (res.errCode === 0) {
			// 	// 	this.formData = res.data
			// 	// } else {
			// 	// 	uni.showModal({
			// 	// 		content: res.errMsg,
			// 	// 		showCancel: false
			// 	// 	})
			// 	// }
			// 	uni.hideLoading()
			// },
			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(id).field("company").get().then((res) => {
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