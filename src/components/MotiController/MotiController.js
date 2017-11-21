import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import MapController from '../MapController';
import MotiDataController from '../MotiDataController';
import Selector from '../Selector';
import AppMixin from '../AppMixin';


var App = React.createClass({

  /**
   * Initial state set upon metadata returning in {@link App#componentDidMount}.
   * Includes: - model_id - variable_id - experiment
   */

  mixins: [AppMixin],

  //This function is used to filter which datasets will be used by this
  //portal. Datasets the filter returns "false" on will not be added to
  //the set of available datasets. Filters out noisy monthly non-mean datasets.
  datasetFilter: function (datafile) {
    return !(datafile.multi_year_mean == false && datafile.timescale == "monthly");
  },

  render: function () {
    //hierarchical selections: model (implicit), then variable, then emission
    var varOptions = this.markDisabledMetadataItems(this.getVariableIdNameArray(),
        this.getFilteredMetadataItems('variable_id', {model_id: this.state.model_id}));
    var expOptions = this.markDisabledMetadataItems(this.getMetadataItems('experiment'),
        this.getFilteredMetadataItems('experiment', {model_id: this.state.model_id, variable_id: this.state.variable_id}));

    return (
      <Grid fluid>
        <Row>
          <Col lg={4} md={4}>
            <Selector label={"Variable Selection"} onChange={this.updateSelection.bind(this, 'variable_id')} items={varOptions} value={this.state.variable_id}/>
          </Col>
          <Col lg={4} md={4}>
            <Selector label={"Emission Scenario Selection"} onChange={this.updateSelection.bind(this, 'experiment')} items={expOptions} value={this.state.experiment}/>
          </Col>
          <Col lg={4} md={4} />
        </Row>
        <Row>
          <Col lg={6}>
            <div>
              <MapController
                meta = {this.getfilteredMeta()}
                onSetArea={this.handleSetArea}
              />
            </div>
          </Col>
          <Col lg={6}>
            <MotiDataController
              model_id={this.state.model_id}
              variable_id={this.state.variable_id}
              experiment={this.state.experiment}
              area={this.state.area}
              meta = {this.getfilteredMeta()}
            />
          </Col>
        </Row>
      </Grid>

    );
  },
});

export default App;
