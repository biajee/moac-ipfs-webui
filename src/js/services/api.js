import API from 'ipfs-api'
import {sortBy} from 'lodash-es'
import {join} from 'path'
import Chain3 from 'chain3'
import abi from 'ethereumjs-abi'


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

export const scsApi = {
  initFlag: false,
  init () {
    if (!scsApi.initFlag) {
      scsApi.options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      scsApi.url = 'http://127.0.0.1:1337/rpc'
  //    scsApi.url = 'http://139.198.126.104:8546/rpc'
      // scsApi.url = 'http://35.196.114.202:50068/rpc'
      scsApi.contractAddress = '0xf6a97597540165b9accd3837adfb7d1e77397bc1'
      scsApi.abi = [{"constant":false,"inputs":[],"name":"list","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fileHash","type":"string"}],"name":"read","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fileHash","type":"string"}],"name":"remove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"fileHashes","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"s1","type":"string"},{"name":"s2","type":"string"}],"name":"compareStringsbyBytes","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"fileHash","type":"string"}],"name":"write","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
      scsApi.sender = '0xbcebf3541dba42f99522496950a149a79ee94d9d'
      scsApi.initFlag = true
    }

  },

  request(bodyJSON) {
    scsApi.init()
    scsApi.options.body = JSON.stringify(bodyJSON)
    return fetch (scsApi.url, scsApi.options)
      .then((resp) => {
        return resp.json()
      })
  },

  getScsId() {
    var bodyJSON = { "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetScsId", "params": {} }
    return scsApi.request(bodyJSON)
  },

  getNonce(sender, subChainAddr) {
    if (!subChainAddr) {
      subChainAddr = scsApi.contractAddress
    }
    if (!sender) {
      sender = scsApi.sender
    }
    var bodyJSON = { "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetNonce", "params": {"Sender": sender, "SubChainAddr": subChainAddr} }
    return scsApi.request(bodyJSON)
  },

  getData(sender, subChainAddr, dataFunc) {
    if (!subChainAddr) {
      subChainAddr = scsApi.contractAddress
    }
    if (!sender) {
      sender = scsApi.sender
    }
    var bodyJSON = { "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetData", "params": {"Sender": sender, "SubChainAddr": subChainAddr, "Func": dataFunc} }
    console.log("getData call", bodyJSON)
    return scsApi.request(bodyJSON)
  },

  getDappState(sender, subChainAddr) {
    if (!subChainAddr) {
      subChainAddr = scsApi.contractAddress
    }
    if (!sender) {
      sender = scsApi.sender
    }
    var bodyJSON = { "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetDappState", "params": {"Sender": sender, "SubChainAddr": subChainAddr} }
    return scsApi.request(bodyJSON)
  },

  getContractInfo(subChainAddr, requestJSON) {
    if (!subChainAddr) {
      subChainAddr = scsApi.contractAddress
    }
    var bodyJSON = { "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetContractInfo", "params": {"SubChainAddr": subChainAddr, "Request": requestJSON} }
    return scsApi.request(bodyJSON)
  },

  getBlock(subChainAddr, number) {
    if (!subChainAddr) {
      subChainAddr = scsApi.contractAddress
    }
    var bodyJSON = { "jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetBlock", "params": {"Number": number, "SubChainAddr": subChainAddr} }
    return scsApi.request(bodyJSON)
  }


}

export const id = localApi.id

export const files = {
  list (root, api = localApi) {
    return api.files.ls(root)
      .then((res) => {
        const innerFiles = sortBy(res, 'name') || []
        const scsHashes = files.getScsHashList()
        console.log("innerFiles", innerFiles)
        console.log("scsHashes", scsHashes)
        console.log("files", files)
        return Promise.all(
          innerFiles.map((file) => {
              return api.files.stat(join(root, file.name))
                .then((stats) => {
                  var result = files.checkScsFileListStatus(scsHashes, file)
                  stats.fsstat = result
                  console.log('stats.fsstat', stats.fsstat)
                  return {...file, ...stats}
                })
            })
        )
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
    var dataInput = '0x' + abi.simpleEncode('write(string)', hash).toString('hex')
    console.log("dataInput", dataInput)
    // var myAccount = myChain3.personal.newAccount('')
    myChain3.personal.unlockAccount(scsApi.sender, '12345678', 0)
    console.log('myAccount', scsApi.sender)

    return new Promise(resolve => {
      myChain3.mc.sendTransaction({
        from: scsApi.sender,
        value:0,
        to: scsApi.contractAddress,
        gas: 1000000,
        gasPrice: myChain3.mc.gasPrice,
        shardingFlag: 1,
        data: dataInput,
        nonce: 1,
        via: '0xd344716b819fc0e8bb5935756e6ed8da6b3077b9'
      },
      resolve)
    })
  },

  getScsHashList() {
    //test
    var scsId = scsApi.getScsId()
    console.log("scsId", scsId)
    var respJSON = scsApi.getData(null, null, "fileHashes")
    console.log("getData", respJSON, respJSON.result)
    if (!respJSON.result) {
      return null
    }
    var hashList = JSON.parse(respJSON.result)
    return hashList
  },

  checkScsFileStatus(hash) {
    console.log('checkScsFileStatus', hash)

    var hashList = files.getScsHashList()

    if (hashList) {
      for (var i=0; i<hashList.length; i++) {
        if (hashList[i] == hash) {
          return 'ON'
        }
      }
    } else {
      return 'unknown'
    }
    return 'OFF'
  },

  checkScsFileListStatus(scsHashList, ipfsFileHash) {
    //test
    if (Math.random() > 0.5) {
      return true
    } else {
      return false
    }
    if (!scsHashList) {
      if (scsHashList == null) {
        // return 'unknown'
      } else {
        // return 'OFF'
      }
      return false
    }
    for (var i=0; i<scsHashList.length; i++) {
      if (scsHashList[i] == ipfsFileHash.hash) {
        // return 'ON'
        return true
      }
    }
    // return 'OFF'
    return false
  } 


}

export const getConfig = (api = localApi) => {
  return api.config.get()
    .then((res) => JSON.parse(res.toString()))
}

export const saveConfig = (config, api = localApi) => {
  return api.config.replace(config)
}
