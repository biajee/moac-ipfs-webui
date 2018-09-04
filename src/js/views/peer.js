import React, {Component} from 'react'
import PropTypes from 'prop-types'
import i18n from '../utils/i18n.js'

class Peer extends Component {
  render () {
    return (
      <div className='webui-peer'>
        <div className='box info'>
          <p>
            <strong>FileStorm Contract Address</strong> <code>0xf6a97597540165b9accd3837adfb7d1e77397bc1</code>
          </p>
          <p>
            <strong>My Account</strong> <code>0x18e926ad1821e38597368b606be81de580f46686</code>
          </p>
          <p>
            <strong>Chain3 Provider</strong> <code>http://127.0.0.1:8545</code>
          </p>
          
          <br/>
          <br/>
          <p>
            <strong>{i18n.t('Peer ID')} </strong> <code>{this.props.peer.id}</code>&nbsp;
          </p>
          <br />
          <p>
            <strong>{i18n.t('Location')} </strong> {this.props.location.formatted || i18n.t('Unknown')}
          </p>
          <p>
            <strong>{i18n.t('Agent Version')} </strong> <code>{this.props.peer.agentVersion || ''}</code>
          </p>
          <p>
            <strong>{i18n.t('Protocol Version')} </strong> <code>{this.props.peer.protocolVersion || ''}</code>
          </p>
          <br />
          <div>
            <strong>{i18n.t('Public Key')}</strong>
            <pre className='panel textarea-panel'>{this.props.peer.publicKey || ''}</pre>
          </div>
        </div>
        <h4>{i18n.t('Network Addresses')}</h4>
        <div className='box addresses'>
          {(this.props.peer.addresses || []).map((address, i) => {
            if (!address) return
            return (
              <p key={i}>
                <code>{address}</code>&nbsp;
              </p>
            )
          })}
        </div>
      </div>
    )
  }
}

Peer.displayName = 'Peer'
Peer.propTypes = {
  peer: PropTypes.object,
  location: PropTypes.object
}

export default Peer
