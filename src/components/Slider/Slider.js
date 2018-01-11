var PropTypes = require('prop-types');
var React = require('react');
var ReactDOM = require('react-dom');
var BootstrapSlider = require('bootstrap-slider');

var Slider = React.createClass({

  propTypes: {
    id: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number.isRequired,
    ticks: PropTypes.array,
    ticksLabels: PropTypes.array,
    ticksPositions: PropTypes.array,
    toolTip: PropTypes.bool,
    selection: PropTypes.string,
    onSlide: PropTypes.func,
    onSlideStop: PropTypes.func,
  },

  getDefaultProps: function () {
    return {
      id: '',
      min: 0,
      max: 100,
      step: 1,
      value: 50,
      ticks: [],
      ticksLabels: [],
      ticksPositions: [],
      toolTip: false,
      selection: 'none',
      onSlideStop: function (event) {
        console.log(event);
      },
    };
  },

  componentWillUpdate: function (nextProps, nextState) {
    this.slider.setValue(nextProps.value);
  },

  componentDidMount: function () {
    var toolTip = this.props.toolTip ? 'show' : 'hide';
    var slider = this.slider = new BootstrapSlider(ReactDOM.findDOMNode(this), {
      id: this.props.id,
      min: this.props.min,
      max: this.props.max,
      step: this.props.step,
      value: this.props.value,
      ticks: this.props.ticks,
      ticks_labels: this.props.ticksLabels,
      ticks_positions: this.props.ticksPositions,
      tooltip: toolTip,
      selection: this.props.selection,
    });

    slider.on('slideStop', function (event) {
      this.props.onSlideStop(event);
      this.slider.setValue(event);
    }.bind(this));
  },

  render: function () {
    return (
      <div style={{ width: '100%' }} />
    );
  },
});

module.exports = Slider;