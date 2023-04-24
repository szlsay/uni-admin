<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-forms-item name="title" label="标题" required>
				<uni-easyinput placeholder="请填写标题" v-model="formData.title" trim="both" maxlength="50"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="protocol_type" label="协议类型" required>
				<uni-data-checkbox v-model="formData.protocol_type"
					:localdata="formOptions.protocol_type_localdata"></uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item name="content" label="内容" required>
				<!-- <uni-easyinput placeholder="请填写内容" v-model="formData.content" trim="both"></uni-easyinput> -->
				<view id="div1">
				</view>
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
	} from '@/js_sdk/validator/lk-mall-agreement.js';

	import E from 'wangeditor'
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'lk-mall-agreement';
	let editor = null

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
					"protocol_type_localdata": [{
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
			this.initEditor()
		},
		methods: {
			/**
			 * 初始化富文本编辑器
			 */
			initEditor() {
				editor = new E('#div1')
				editor.config.zIndex = 0
				// 取消自动 focus
				editor.config.focus = false
				editor.config.placeholder = '请填写内容'
				editor.config.onblur = function(newHtml) {
					console.log('onblur', newHtml) // 获取最新的 html 内容
				}
				editor.config.onfocus = function(newHtml) {
					console.log('onfocus', newHtml) // 获取最新的 html 内容
				}
				// 配置 onchange 回调函数
				const that = this
				editor.config.onchange = function(newHtml) {
					console.log("change 之后最新的 html", newHtml);
					that.formData.content = newHtml
				};
				// 配置触发 onchange 的时间频率，默认为 200ms
				editor.config.onchangeTimeout = 500; // 修改为 500ms


				// 本地上传图片
				editor.config.customUploadImg = function(resultFiles, insertImgFn) {
					// resultFiles 是 input 中选中的文件列表
					// insertImgFn 是获取图片 url 后，插入到编辑器的方法
					resultFiles.forEach(async file => {
						let filePath = URL.createObjectURL(file)
						let cloudPath = file.name
						const result = await uniCloud.uploadFile({
							filePath,
							cloudPath
						});
						// 上传图片，返回结果，将图片插入到编辑器中
						insertImgFn(result.fileID)
					})
				}

				editor.create()
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
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},

			/**
			 * 提交表单
			 */
			submitForm(value) {
				value.update_time = new Date().valueOf()
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