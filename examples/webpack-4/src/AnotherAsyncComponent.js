import PropTypes from 'prop-types';
import React from 'react';

class LinkInput extends React.Component {
  handleUrlChange = event => {
    this.props.onUrlChange(this.props.index, event.target.value);
  };

  handleDeleteClick = () => {
    this.props.onDeleteLink(this.props.index);
  };

  render() {
    return (
      <div className="LinkInput">
        <input
          type="url"
          onChange={this.handleUrlChange}
          value={this.props.url}
        />
        <button
          className="LinkInput__remove"
          type="button"
          onClick={this.handleDeleteClick}
        >
          -
        </button>
      </div>
    );
  }
}

LinkInput.propTypes = {
  index: PropTypes.number.isRequired,
  onUrlChange: PropTypes.func.isRequired,
  onDeleteLink: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default LinkInput;
