import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Button, Glyphicon, Modal } from 'react-bootstrap';

import _ from 'underscore';

import './MapSettings.css';
import compAcontrolsB from '../../HOCs/compAcontrolsB';
import DatasetSelector from './DatasetSelector';


export default class MapSettings extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    // TODO: Refactor according to comments in DatasetSelector
    meta: PropTypes.array,
    dataset: PropTypes.string,  // current dataset selection, encoded as JSON string
    onDatasetChange: PropTypes.func.isRequired,  // callback, arg is enocded JSON string
  };

  A = (props) =>
    <Button onClick={props.open} title={this.props.title}>
      <Glyphicon glyph='menu-hamburger'/>
    </Button>
  ;

  // TODO: ? Extract to a seaparate component `MapSettingsDialog`
  B = (props) =>
    <Modal show={props.show} onHide={props.close} >

      <Modal.Header closeButton>
        <Modal.Title>Map Settings</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Grid>
          <Row>
            <DatasetSelector
              meta={this.props.meta}
              value={this.props.dataset}
              onChange={this.props.onDatasetChange}
            />
          </Row>
          <Row>
            rasterControls
            linkControls
            isolineControls
          </Row>
        </Grid>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.close}>Close</Button>
      </Modal.Footer>

    </Modal>
  ;

  render() {
    const ButtonWithModal = compAcontrolsB(this.A, this.B);
    return <ButtonWithModal/>;
  }
}
