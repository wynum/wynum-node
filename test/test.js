const fs = require('fs')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised).should()

const Client = require('../index')

let client = new Client("a742bc685f072fe624f61ee2119d66982x", "8979947")
let data = {
  "name": "groot",
  "height": 5,
  "weight": 42,
  "Details_hobbies": ["painting"],
  "Details_required": "yes",
  "id": "2"
}
let fileClient = new Client("a742bc685f072fe624f61ee2119d66982x", "6138287")
let wrongKeyClient = new Client("a742bc685f072fe624f61ee2119d66982", "8979947")
let invalidTokenClient =  new Client("a742bc685f072fe624f61ee2119d66982x", "897994")

describe('ClientTest', function () {
  describe('postData', function () {
    it('should not contain error', function () {
      return client.postData(data).should.eventually.not.have.property('error')
    })

    it('should post file without error', function () {
      let fileData = {"id": "1", "file": fs.createReadStream(__filename)}
      return fileClient.postData(fileData).should.eventually.not.have.property('error')
    })

    it('should reject when secret_key is invalid', function () {
      return wrongKeyClient.postData(data).should.be.rejectedWith('Secret key error')
    })

    it('should reject when token is invalid', function() {
      return invalidTokenClient.postData(data).should.be.rejectedWith('Invalid Token')
    })
  })

  describe('updateData', function () {
    it('should not contain error', function () {
      return client.updateData(data).should.eventually.not.have.property('error')
    })

    it('should update file without error', function () {
      let fileData = {"id": "1", "file": fs.createReadStream(__filename)}
      return fileClient.updateData(fileData).should.eventually.not.have.property('error')
    })

    it('should reject when secret_key is invalid', function () {
      return wrongKeyClient.updateData(data).should.be.rejectedWith('Secret key error')
    })

    it('should reject when token is invalid', function() {
      return invalidTokenClient.updateData(data).should.be.rejectedWith('Invalid Token')
    })
  })

  describe('getData', function() {
    it('should not fail', function() {
      return client.getData().should.not.be.rejected
    })

    it('should reject when secret_key is invalid', function () {
      return wrongKeyClient.getData().should.be.rejectedWith('Secret key error')
    })

    it('should reject when token is invalid', function() {
      return invalidTokenClient.getData().should.be.rejectedWith('Invalid Token')
    })
  })

  describe('getSchema', function() {
    it('should not fail', function() {
      return client.getSchema().should.not.be.rejected
    })

    it('should reject when secret_key is invalid', function () {
      return wrongKeyClient.getSchema().should.be.rejectedWith('Secret key error')
    })

    it('should reject when token is invalid', function() {
      return invalidTokenClient.getSchema().should.be.rejectedWith('Invalid Token')
    })
  })
})