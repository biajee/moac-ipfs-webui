import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {isEmpty, map} from 'lodash-es'
import {readAsBuffer} from '../../utils/files'
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
      console.log('this.chain3', this.chain3)
      var contractAddress = '0x8671eb9f82218199e5ce0acab2d31b2e5e281491';
      var contractAbi = [{"constant":true,"inputs":[],"name":"tokenRatio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contributorsTopBonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gTotalContribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"SafetySendout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"haltFlag","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"teamNumber","type":"uint256"}],"name":"SetChampion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contributorsAccountBonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"teams","outputs":[{"name":"teamNumber","type":"uint256"},{"name":"teamName","type":"string"},{"name":"totalContributions","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"contributor","type":"address"}],"name":"AddContributor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"teamNumber","type":"uint256"},{"name":"teamName","type":"string"}],"name":"AddTeam","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"matches","outputs":[{"name":"matchNumber","type":"uint256"},{"name":"homeTeamNumber","type":"uint256"},{"name":"awayTeamNumber","type":"uint256"},{"name":"startTime","type":"uint256"},{"name":"homeScore","type":"uint256"},{"name":"awayScore","type":"uint256"},{"name":"finished","type":"bool"},{"name":"rewardSent","type":"bool"},{"name":"jackpot","type":"uint256"},{"name":"totalHomeWinContributions","type":"uint256"},{"name":"totalAwayWinContributions","type":"uint256"},{"name":"totalDrawContributions","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"founder","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contributionUpperBound","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"championRewardSent","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contributionLowerBound","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"matchesContributions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contributorsEarlyBonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"matchNumber","type":"uint256"},{"name":"homeScore","type":"uint256"},{"name":"awayScore","type":"uint256"}],"name":"FinalizeMatch","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenSymbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"allWinnersMap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"matchNumber","type":"uint256"}],"name":"SendoutSingleMatchReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalBonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"SendoutTopBonus","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"winner","type":"address"}],"name":"AddWinAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"teamsContributionsSent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"earlyBonusLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"matchesContributionsSent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"allContributorsMap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"SendoutChampionReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newFounder","type":"address"}],"name":"SetFounder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"to","type":"address"}],"name":"ManualTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"championJackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"halt","type":"bool"}],"name":"SetHalt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"toShaRatio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"matchNumber","type":"uint256"},{"name":"homeTeamNumber","type":"uint256"},{"name":"awayTeamNumber","type":"uint256"},{"name":"startTime","type":"uint256"}],"name":"AddMatch","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allWinners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"matchNumber","type":"uint256"},{"name":"result","type":"uint256"}],"name":"SingleMatchBet","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allContributors","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"topBonusLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"unitEarlyBonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"teamsContributions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"accountBonusLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"unitAccountBonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"teamNumber","type":"uint256"}],"name":"ChampionBet","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]
      var contractInstance;

      if (!contractInstance && (typeof this.chain3 !== 'undefined')) {
          contractInstance = this.chain3.mc.contract(contractAbi).at(contractAddress);
      }

      if (contractInstance) {
        var result = contractInstance.registerFile.call(
          files,
          {
            from: mc.accounts[0]
          },
          (err, res) => {
            console.log("res", res)
          }
        )

        console.log("register succeeded", res);
      } else {
        console.log("failed to register file to microchain.")
      }

    }

    onCreateFiles(files)
  }

  componentDidMount() {
    console.log("componentDidMount", new Date().getTime())
    // this.chain3 = new Chain3();
    // console.log(this.chain3); // {mc: .., net: ...} // it's here!

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
