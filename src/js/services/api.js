import API from 'ipfs-api'
import {sortBy} from 'lodash-es'
import {join} from 'path'
import Chain3 from 'chain3'


const host = (process.env.NODE_ENV !== 'production') ? 'localhost' : window.location.hostname
const port = (process.env.NODE_ENV !== 'production') ? '5001' : (window.location.port || (window.location.protocol === 'https:' ? 443 : 80))
const protocol = (process.env.NODE_ENV !== 'production') ? 'http' : (window.location.protocol === 'https:' ? 'https' : 'http')

const localApi = new API(host, port, {protocol: protocol})

var myChain3 = null;

if(myChain3 && typeof myChain3 !== 'undefined') {
  myChain3 = new Chain3(myChain3.currentProvider);
} else {
  myChain3 = new Chain3(new Chain3.providers.HttpProvider("http://localhost:8545")); 
}


// -- Public Interface

export const id = localApi.id

export const files = {
  list (root, api = localApi) {
    return api.files.ls(root)
      .then((res) => {
        const files = sortBy(res, 'name') || []

        return Promise.all(files.map((file) => {
          return api.files.stat(join(root, file.name))
            .then((stats) => {
              return {...file, ...stats}
            })
        }))
      })
  },

  mkdir (name, api = localApi) {
    return api.files.mkdir(name)
  },

  rmdir (name, api = localApi) {
    return api.files.rm(name, {recursive: true})
  },

  mv (from, to, api = localApi) {
    return api.files.mv([from, to])
  },

  createFiles (root, files, api = localApi) {
    // root is the directory we want to store the files in
    return Promise.all(files.map((file) => {
      const target = join(root, file.name)
      var writtenFile = api.files.write(target, file.content, {create: true})
      return writtenFile
    }))
  },

  stat (name, api = localApi) {
    if (name && name.substr(0,1) != '/') {
      name = '/' + name
    }
    // console.log('stat name', name)
    var fileStat = api.files.stat(name)
    // console.log('stat fileStat', fileStat)
    return fileStat
  },

  read (name, api = localApi) {
    return api.files.read(name)
  },

  addToContract (hash) {
    console.log('addToContract', hash)
    var contractAddress = '0x651ee0e11Bae6850C8e2eaDf5cC842AA9B38a2a8'
    var hashHex = myChain3.toHex(hash)
    hashHex = hashHex.substr(2)
    var rightPaddedHex = myChain3.padRight(hashHex, 128)
    var dataInput = '0xebaac7710000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002e' + rightPaddedHex
    console.log("dataInput", dataInput)
    var myAccount = myChain3.personal.newAccount('test123')
    console.log('myAccount', myAccount)
    var callback = (err, res) => {
      console.log('err', err)
      console.log('res', res)
    }
    myChain3.mc.sendTransaction({
      from: myAccount,
      value:0,
      to: contractAddress,
      gas: 1000000,
      gasPrice: myChain3.mc.gasPrice,
      shardingflag: 1,
      data: dataInput,
      nonce: 1,
      via: '0x5B43583F33214c790B8206D9B06685c49A1DB455'
    },
    callback)
  }
}

export const getConfig = (api = localApi) => {
  return api.config.get()
    .then((res) => JSON.parse(res.toString()))
}

export const saveConfig = (config, api = localApi) => {
  return api.config.replace(config)
}
