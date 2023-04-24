// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "update_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "更新时间",
    "label": "更新时间"
  },
  "title": {
    "rules": [
      {
        "format": "string"
      },
      {
        "maxLength": 50
      }
    ],
    "title": "标题",
    "label": "标题"
  },
  "content": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "内容",
    "label": "内容"
  },
  "protocol_type": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
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
      }
    ],
    "title": "协议类型",
    "defaultValue": 0,
    "label": "协议类型"
  }
}

const enumConverter = {
  "protocol_type_valuetotext": {
    "0": "注册协议",
    "1": "隐私协议",
    "2": "店铺协议",
    "3": "会员协议"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
