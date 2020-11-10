const fs = require('fs')

const axios = require('axios')
const FormData = require('form-data')

const Schema = require('./schema')

module.exports = class Client{
  constructor(secret, token) {
    this.secret = secret
    this.token = token
    this.dataUrl = `https://api.wynum.com/data/${token}?secret_key=${secret}`
    this.schemaUrl = `https://api.wynum.com/component/${token}?secret_key=${secret}`
    this.identifier = null
    this.schema = null
  }

  async getSchema() {
    let response = await axios.get(this.schemaUrl)
    let data = response.data
    this.validateResponse(data)
    let schmeJsonArray = data['components']
    this.identifier = data['identifer']
    this.schema = schmeJsonArray.map((json) => new Schema(json))
    return this.schema
  }

  async postData(data) {
    let response
    if (this.hasFile(data)) {
      let form_data = this.prepareFromData(data)
      let config = { headers: form_data.getHeaders() }
      response = await axios.post(this.dataUrl, form_data, config)
    } else {
      let config = { headers: { "Content-Type": "application/json" } }
      response = await axios.post(this.dataUrl, JSON.stringify(data), config)
    }
    this.validateResponse(response.data)
    return response.data
  }

  async updateData(data) {
    let response
    if (this.hasFile(data)) {
      let form_data = this.prepareFromData(data)
      let config = { headers: form_data.getHeaders() }
      response = await axios.put(this.dataUrl, form_data, config)
    } else {
      let config = { headers: { "Content-Type": "application/json" } }
      response = await axios.put(this.dataUrl, JSON.stringify(data), config)
    }
    this.validateResponse(response.data)
    return response.data
  }

  async getData(options) {
    this.validateAndParseOptions(options)
    let response = await axios.get(this.dataUrl, { params: options })
    this.validateResponse(response.data)
    return response.data
  }

  hasFile(data) {
    for (let key in data) {
      if (data[key] instanceof fs.ReadStream) {
        return true
      }
    }
    return false
  }

  isFile(value) {
    return value instanceof fs.ReadStream
  }

  prepareFromData(data) {
    let form_data = new FormData()
    let other_data = {}
    for (let key in data) {
      if (this.isFile(data[key])) {
        form_data.append(key, data[key])
      } else {
        other_data[key] = data[key]
      }
    }
    form_data.append('inputdata', JSON.stringify(other_data))
    return form_data
  }

  validateResponse(response) {
    if (Object.prototype.toString.call(response) == "[object Object]") {
      if (response['_error'] != undefined) {
        if (response['_message'] == 'Secret Key Error' || response['_message'] == 'Process not found.') {
          throw new Error('Secret key error')
        } else if (response['_message'] == 'Not Found') {
          throw new Error('Invalid Token')
        }
      }
    }
  }

  validateAndParseOptions(options) {
    for (let key in options) {
      switch (key) {
        case 'ids':
          if (!Array.isArray(options['ids'])) {
            throw new TypeError('ids should be an Array of string')
          }
          options['ids'] = options['ids'].join()
          break
        case 'limit':
          if (!Number.isInteger(options[key])) {
            throw new TypeError('limit must be a non-negative integer')
          }
          if (options[key] <= 0) {
            throw new RangeError('limits must be greater than 0')
          }
          break
        case 'order_by':
          if (typeof options[key] != "string") {
            throw new TypeError('order by must be a string, it can either be "asc" or "desc"')
          }
          if (!['asc', 'desc'].includes(options[key])) {
            throw new TypeError("order_by must be 'asc' or 'desc'")
          }
          options[key] = options[key].toUpperCase()
          break
        case 'start':
          if (!Number.isInteger(options[key])) {
            throw new TypeError('start must be a non-negative integer')
          }
          break
        case 'to':
          if (!Number.isInteger(options[key])) {
            throw new TypeError('to must be a non-negative integer')
          }
          break
      }
    }
    return options
  }
}