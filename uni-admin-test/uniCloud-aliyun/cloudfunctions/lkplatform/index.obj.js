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
		return result
	},
	getMerchants: async function(id, fieldValue) {
		const dbCollectionName = 'lk-platform-merchants';
		const result = await db.collection(dbCollectionName).doc(id).field(fieldValue).get()
		return result		
	},
	editMerchants: async function(id, value) {
		const dbCollectionName = 'lk-platform-merchants';
		const result = await db.collection(dbCollectionName).doc(id).update(value)
		return result
	},
}