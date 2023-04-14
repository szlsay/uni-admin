// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-co')
// const uniID = require('uni-id')
module.exports = {
	_before: function() { // 通用预处理器
		// const clientInfo = this.getClientInfo()
		// this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
		// 	clientInfo
		// })

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
		//token信息
		const token = this.getUniIdToken()
		//当前登录用户id
		let uid
		if (token) {
			const tokenRes = await uniID.createInstance({
				clientInfo
			}).checkToken(token)

			if (tokenRes.uid) {
				uid = tokenRes.uid
			}
		}

		const db = uniCloud.database();
		const dbCollectionName = 'st-shop-search';
		let param = {
			keyword,
			create_time: null,
			create_uid: uid,
			last_modify_uid: uid
		}
		db.collection(dbCollectionName).add(param).then((res) => {
			console.log('res---', res)
		}).catch((error) => {
			console.log('error---', error)
		})

		// //客户端信息
		// const clientInfo = this.getClientInfo()
		// console.log("clientInfo-", clientInfo)
		// //云服务信息
		// const cloudInfo = this.getCloudInfo()
		// console.log("cloudInfo-", cloudInfo)
		// const token = this.getUniIdToken()
		// let uid
		// if(token) {
		// 	const tokenRes  = await uniID.createInstance({
		// 		clientInfo
		// 	}).checkToken(token)
		// 	console.log("cloudInfo-", cloudInfo)
		// 	if(tokenRes.uid) {
		// 		uid = tokenRes.uid
		// 	}
		// }

		return {
			errCode: 0,
			errMsg: '创建成功'
		}
	}
}