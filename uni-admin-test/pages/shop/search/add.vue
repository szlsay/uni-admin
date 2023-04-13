<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-forms-item name="keyword" label="关键词">
				<uni-easyinput placeholder="请输入关键词" v-model="formData.keyword"></uni-easyinput>
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
	} from '@/js_sdk/validator/st-shop-search.js';

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
				"keyword": "",
				"search_cnt": 1
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
			submit() {
				const shopSearch = uniCloud.importObject('st-shop-search')
				shopSearch.add("b").then((res) => {
					console.log('submit-', res)
				}).catch((err) => {
					console.log('submit-err-', err)
				})
				// uni.showLoading({
				// 	mask: true
				// })
				// this.$refs.form.validate().then((res) => {
				// 	console.log('res-', res)
				// 	return this.submitForm(res)
				// }).catch(() => {}).finally(() => {
				// 	uni.hideLoading()
				// })
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