// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
// const db = uniCloud.database();
// const shopSearchTable = db.collection('st-shop-search');

module.exports = {
	_before: function(state, event) { // 通用预处理器
		console.log('_before--', state, event)
	},
	add: async function(keyword = '') {
		console.log('add--', keyword)
		if (!keyword) {
			return {
				errCode: 'INVALID_TODO',
				errMsg: 'TODO标题或内容不可为空'
			}
		}
		
		//客户端信息
		const clientInfo = this.getClientInfo()
		console.log("clientInfo-", clientInfo)
		//云服务信息
		const cloudInfo = this.getCloudInfo()
		console.log("cloudInfo-", cloudInfo)
		const token = this.getUniIdToken()
		let uid
		if(token) {
			const tokenRes  = await uniID.createInstance({
				clientInfo
			}).checkToken(token)
			console.log("cloudInfo-", cloudInfo)
			if(tokenRes.uid) {
				uid = tokenRes.uid
			}
		}
		
		return {
			errCode: 0,
			errMsg: '创建成功'
		}
	}
}