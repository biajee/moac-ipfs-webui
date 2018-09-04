import React, {Component} from 'react'
import PropTypes from 'prop-types'
import pretty from 'prettysize'
import classnames from 'classnames'
import {ContextMenuTrigger} from 'react-contextmenu'

import Icon from '../../../views/icon'

function renderType (type) {
  if (type === 'directory') {
    return <Icon glyph='folder' large />
  }
  return <Icon glyph='file' large />
}

class Row extends Component {
  _onClick = (event) => {
    event.preventDefault()
    this.props.onClick(
      this.props.file,
      event.shiftKey,
      event.ctrlKey || event.metaKey
    )
  }

  _onClickAddBtn = (event) => {
    event.preventDefault()
    console.log('event', event, this.props.file)
  }

  _onContextMenu = (event) => {
    event.preventDefault()
    this.props.onContextMenu(this.props.file, event.shiftKey)
  }

  _onDoubleClick = (event) => {
    event.preventDefault()
    this.props.onDoubleClick(this.props.file)
    this.props.file.fsstat = true
  }

  render () {
    const {file, selected} = this.props
    const {fsstat} = file.fsstat
    const className = classnames('file-row', {selected})
    return (
      <ContextMenuTrigger id='files-context-menu'>
        <div
          onClick={this._onClick}
          onContextMenu={this._onContextMenu}
          onDoubleClick={this._onDoubleClick}
          className={className}>
          <div className='name'>
            {renderType(file.type)}
            {file.name}
          </div>
          <div className='size'>
            {file.type === 'directory' ? '-' : pretty(file.size)}
          </div>
          {!file.fsstat && (<div
            onClick={this._onClickAddBtn.bind(this)}
            >
            <input type="button" class="btnadd" value="+" />
          </div>)}
          <div className={file.fsstat ? "fsstat fsok" : "fsstat fswrong"}>
            {file.fsstat ? 'ON' : 'OFF'}
          </div>
        </div>
      </ContextMenuTrigger>
    )
  }
}

Row.propTypes = {
  file: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  // onRemoveDir: PropTypes.func.isRequired,
  selected: PropTypes.bool
}

Row.defaultProps = {
  selected: false
}

export default Row
