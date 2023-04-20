// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129

const db = uniCloud.database();
const dbCmd = db.command;

module.exports = {
	_before: function() { // 通用预处理器

	},
	addMerchants: async function(value) {
		const dbCollectionName = 'lk-platform-merchants';
		const result = await db.collection(dbCollectionName).add(value)
		if (result && result.id) {
			return {
				errCode: 0,
				errMsg: '新增成功'
			}
		} else {
			return {
				errCode: -1,
				errMsg: '请求服务失败'
			}
		}
	},
	editMerchants: async function(id, value) {
		const dbCollectionName = 'lk-platform-merchants';
		const result = await db.collection(dbCollectionName).doc(id).update(value)
		if (result && Object.keys(result).length === 3) {
			return {
				errCode: 0,
				errMsg: '修改成功'
			}
		} else {
			return {
				errCode: -1,
				errMsg: '请求服务失败'
			}
		}
	},
	
	getMerchants: async function(id, value) {
		const dbCollectionName = 'lk-platform-merchants';
		const result = await db.collection(dbCollectionName).doc(id).field(value).get()
		if (result && result.result && result.result.data && result.result.data.length === 1) {
			const data = result.result.data[0]
			return {
				errCode: 0,
				errMsg: '获取成功',
				data: data
			}
		} else {
			return {
				errCode: -1,
				errMsg: '请求服务失败'
			}
		}
	},
}