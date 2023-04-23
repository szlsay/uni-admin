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
  "image": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "图片",
    "label": "图片"
  },
  "url": {
    "rules": [
      {
        "format": "string"
      },
      {
        "format": "url"
      }
    ],
    "title": "链接",
    "label": "链接"
  },
  "device_type": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "未知",
            "value": 0
          },
          {
            "text": "ios",
            "value": 1
          },
          {
            "text": "android",
            "value": 2
          },
          {
            "text": "app",
            "value": 3
          },
          {
            "text": "windows",
            "value": 4
          },
          {
            "text": "mac",
            "value": 5
          },
          {
            "text": "linux",
            "value": 6
          },
          {
            "text": "pc",
            "value": 7
          }
        ]
      }
    ],
    "title": "设备类型",
    "defaultValue": 0,
    "label": "设备类型"
  }
}

const enumConverter = {
  "device_type_valuetotext": {
    "0": "未知",
    "1": "ios",
    "2": "android",
    "3": "app",
    "4": "windows",
    "5": "mac",
    "6": "linux",
    "7": "pc"
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
