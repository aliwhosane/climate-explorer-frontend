/***************************************************************
 * AppController.js 
 * 
 * This controller represent climate explorer's main portal. It
 * has dropdowns to allow a user to select a model, emission
 * scenario, and variable. It loads and filters metadata for 
 * the selected datasets and passes them to its children:  
 * - MapController (displays a variable as a colour-shaded map) 
 * - DataController (displays graphs and a statistical table).
 ***************************************************************/

import React from 'react';
import createReactClass from 'create-react-class';
import { Grid, Row, Col } from 'react-bootstrap';

import MapController from '../MapController';
import AltMapController from '../AltMapController';
import DataController from '../DataController/DataController';
import Selector from '../Selector';
import AppMixin from '../AppMixin';
import g from '../../core/geo';

var App = createReactClass({
  displayName: 'App',

  /**
   * Initial state set upon metadata returning in {@link App#componentDidMount}.
   * Includes: - model_id - variable_id - experiment
   */

  mixins: [AppMixin],

  //This filter controls which datasets are available for viewing on this portal;
  //only datasets the filter returns a truthy value for are available.
  //Filters out noisy multi-year monthly datasets.
  datasetFilter: function (datafile) {
    return !(datafile.multi_year_mean == false && datafile.timescale == "monthly");
  },

  render: function () {
    //hierarchical selection: model, then variable, then experiment
    var modOptions = this.getMetadataItems('model_id');
    var varOptions = this.markDisabledMetadataItems(this.getVariableIdNameArray(),
        this.getFilteredMetadataItems('variable_id', {model_id: this.state.model_id}));
    var expOptions = this.markDisabledMetadataItems(this.getMetadataItems('experiment'),
        this.getFilteredMetadataItems('experiment', {model_id: this.state.model_id, variable_id: this.state.variable_id}));

    return (
      <Grid fluid>
        <Row>
          <Col lg={4} md={4}>
            <Selector label={"Model Selection"} onChange={this.updateSelection.bind(this, 'model_id')} items={modOptions} value={this.state.model_id}/>
          </Col>
          <Col lg={4} md={4}>
            <Selector label={"Variable Selection"} onChange={this.updateSelection.bind(this, 'variable_id')} items={varOptions} value={this.state.variable_id}/>
          </Col>
          <Col lg={4} md={4}>
            <Selector label={"Emission Scenario Selection"} onChange={this.updateSelection.bind(this, 'experiment')} items={expOptions} value={this.state.experiment}/>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <div>
              <AltMapController
                meta = {this.getfilteredMeta()}
                area={this.state.area}
                onSetArea={this.handleSetArea}
              />
            </div>
          </Col>
          <Col lg={6}>
            <DataController
              ensemble_name={this.state.ensemble_name}
              model_id={this.state.model_id}
              variable_id={this.state.variable_id}
              comparand_id={this.state.comparand_id ? this.state.comparand_id : this.state.variable_id}
              experiment={this.state.experiment}
              area={g.geojson(this.state.area).toWKT()}
              meta = {this.getfilteredMeta()}
            />
          </Col>
        </Row>
      </Grid>

    );
  },
});

export default App;
