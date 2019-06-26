module.exports = class Schema {
  constructor(schemJson) {
    this.key = schemJson['Property']
    this.type = schemJson['Type']
  }

  toString() {
    return `Key: ${this.key}\n Type: ${this.type}`
  }
}