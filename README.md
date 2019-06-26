# Installation
```pip install wynum```

To install using github try

```pip install -U -e git+https://github.com/wynum/wynum-python#egg=wynum```

# Getting started
Very easy to use. Create a ```Client``` and you're ready to go.
## API Credentials
The ```Client``` needs Wynum credentials.You can either pass these directly to the constructor.
```js
const Client = require('wynum-node')

let secret = "your_secret_key"
let token = "project_token"
let client = new Client(secret, token)
```


## Get schema
call ```getSchema``` on ```Client``` to get the keys and types for the data. This will return an ```array``` of ```Schema``` objects.  ```Schema.key``` will return the key and ```Schema.type``` will return the Wynum type. Following is the mapping from Wynum type to JS type.

| Wynum type            | JS type                    |
| --------------------- | ------------------------   |
| Text                  | ```string```               | 
| Date                  | ```string``` (dd/mm/yyyy)  |
| Number                | ```number```               |
| Choice (Or)           | ```number```               |
| Multiple Choice (And) | ```array``` of ```string```|
| Time                  | ```string``` (hh:mm)       |
| File                  | ```fs.ReadStream```        |       |

```js
client.getSchema().then((schemas) => {
    for (let schema of schemas) {
      console.log(schema.key, schema.type)
    }
})

```

## Post data
the ```postData``` method accepts a single parameter data which is an ```object``` containing the post key:value. Every data ```object``` should contain the 'identifier'. You can get identifier key if you have called ```getSchema```. You can retrieve it using ```client.identifier```.

```JS
await client.getSchema()
let identifer_key = client.identifier
let data = {'key1':val1, 'key2':val2, identifer_key:'id_string'}
let = await client.postData(data)
```
If the call is successful it returns the ```object``` containing the created data instance. If there is some error the ```object``` will contain ```_error``` and ```_message``` keys.  You should check this to check for errors.

## Get data
Call ```getData``` to get the data. This will return an ```array``` of ```object```. ```getData``` accepts an options object as a parameter. It can have following options
- ```limit```: ```integer```
    <br>Number of records to return.
- ```order_by```: ```string```
    <br> Sorting order which can either be 'asc' or desc'
- ```ids```: ```array``` of ```string```
    <br> The list of ids to retrieve
- ```start```: ```integer```
    <br> Record number to start from
- ```to```: ```integer```
    <br> Record number to end at

```start``` and `to` can be used for pagination.

If no arguments are provided it will return an array of all data records.

```js
let data = await client.getData()
```

## Updating data
The ```updateData``` method is same as that of ```postData``` method.
```JS
await client.getSchema()
let identifer_key = client.identifier
let data = {'key1':val1, 'key2':val2, identifer_key:'id_string'}
let = await client.updateData(data)
```