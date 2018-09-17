import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {isEmpty, map} from 'lodash-es'
import {readAsBuffer} from '../../utils/files'
import {toastr} from 'react-redux-toastr'
import Chain3 from 'chain3'

import Icon from '../../views/icon'

class ActionBar extends Component {
  _onUploadClick = event => {
    this.fileInput.click()
  }

  _onFilesChange = event => {
    const rawFiles = this.fileInput.files
    const { onCreateFiles } = this.props
    var me = this

    Promise
      .all(map(rawFiles, readAsBuffer))
      .then((files) => {
        me._addToMicrochain(files, onCreateFiles)
      })

    this.fileInput.value = null
  }

  _addToMicrochain (files, onCreateFiles) {
    console.log('_addToMicrochain', files)

    if (this.chain3) {
      console.log('contract loading', new Date().getTime);
      var contractAddress = '0x651ee0e11Bae6850C8e2eaDf5cC842AA9B38a2a8';
      // var contractInstance;

      // if (!contractInstance && (typeof this.chain3 !== 'undefined')) {
      //     // contractInstance = this.chain3.mc.contract(contractAbi).at(contractAddress)
      // }

      // if (contractInstance) {
      //   if (!contractInstance.registerFile) {
      //     console.log('contract loading end', new Date().getTime)
      //     toastr.error('Contract has no registerFile function')
      //     // return
      //   }

      //   var result = contractInstance.registerFile.call(
      //     files,
      //     {
      //       from: mc.accounts[0]
      //     },
      //     (err, res) => {
      //       console.log("res", res)
      //     }
      //   )

      //   console.log('register succeeded', res);
      // } else {
      //   toastr.error('Failed to find contract for microchain.')
      //   console.log('Failed to find contract for microchain.')
      // }

    }

    onCreateFiles(files)
  }

  componentDidMount() {
    console.log("componentDidMount", new Date().getTime())

    this.chain3 = null;
    if(this.chain3 && typeof this.chain3 !== 'undefined') {
      this.chain3 = new Chain3(this.chain3.currentProvider);
    } else {
      this.chain3 = new Chain3(new Chain3.providers.HttpProvider("http://localhost:8545")); 
    }

    console.log("componentDidMount", new Date().getTime())

  }

  render () {
    const {
      selectedFiles,
      onRemoveDir,
      onMoveDir,
      onCreateDir
    } = this.props
    let fileActions

    if (!isEmpty(selectedFiles)) {
      const length = selectedFiles.length
      const plural = length > 1 ? 's' : ''
      const count = `${length} file${plural}`

      fileActions = ([
        <div className='action-bar-file-actions'>
          <a onClick={onMoveDir}>
            <Icon glyph='pencil' />
            Rename
          </a>
        </div>,
        <div className='action-bar-file-actions'>
          <a onClick={onRemoveDir}>
            <Icon glyph='minus' />
            Delete {count}
          </a>
        </div>
      ])
    }

    return (
      <div className='action-bar'>
        <div className='action-bar-general-actions'>
          <a onClick={onCreateDir}>
            <Icon glyph='plus' />
            Create Folder
          </a>
        </div>
        <div className='action-bar-general-actions'>
          <a onClick={this._onUploadClick}>
            <Icon glyph='upload' />
            Upload
          </a>
        </div>
        <input
          type='file'
          className='hidden'
          multiple
          ref={(input) => { this.fileInput = input }}
          onChange={this._onFilesChange} />
        {fileActions}
      </div>
    )
  }
}

ActionBar.propTypes = {
  onCreateDir: PropTypes.func.isRequired,
  onRemoveDir: PropTypes.func.isRequired,
  onMoveDir: PropTypes.func.isRequired,
  onCreateFiles: PropTypes.func.isRequired,
  selectedFiles: PropTypes.array.isRequired
}

export default ActionBar
