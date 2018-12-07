import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';

import InputRange from 'react-input-range';

import StaticControl from '../StaticControl';

import './LayerOpacityControl.css';

export default class LayerOpacityControl extends PureComponent {
  static propTypes = {
    layerOpacity: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showControls: false,
    };
  }

  handleMouseEnter = () => this.setState({ showControls: true });
  handleMouseLeave = () => this.setState({ showControls: false });

  formatLabel = value => `${(value*100).toFixed(0)}%`;

  render() {
    return (
      <StaticControl position={'topright'}>
        <div
          className={'LayerOpacityControl'}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {
            this.state.showControls ?
            (
              <Grid fluid>
                <Row>
                  <Col lg={12} className='text-center'>
                    Climate layer opacity
                  </Col>
                </Row>
                {
                  Object.entries(this.props.layerOpacity).map(
                    ([layerType, opacity]) => (
                      <Row key={layerType}>
                        <Col lg={3}>{layerType}</Col>
                        <Col lg={8}>
                          <InputRange
                            // step=0.0499 ensures can go up to 100%
                            // presumed rounding error means 0.05 won't work
                            minValue={0} maxValue={1} step={0.0499}
                            formatLabel={this.formatLabel}
                            value={opacity}
                            onChange={
                              this.props.onChange.bind(this, layerType)
                            }
                          />
                        </Col>
                      </Row>
                    )
                  )
                }
              </Grid>
            ) : (
              <Button bsSize='small'>
                <Glyphicon glyph='adjust' />
              </Button>
            )
          }
        </div>
      </StaticControl>
    );
  }
}
