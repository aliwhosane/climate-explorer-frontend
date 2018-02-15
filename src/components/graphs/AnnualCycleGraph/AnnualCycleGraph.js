import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-bootstrap';

import _ from 'underscore';

import DatasetSelector from '../../DatasetSelector/DatasetSelector';
import DataGraph from '../../DataGraph/DataGraph';
import ExportButtons from '../ExportButtons';
import {
  sortSeriesByRank,
  timeseriesToAnnualCycleGraph,
} from '../../../core/chart';
import { findMatchingMetadata } from '../graph-helpers';
import { exportDataToWorksheet } from '../../../core/export';
import { getTimeseries } from "../../../data-services/ce-backend";
import {
  validateAnnualCycleData,
  validateUnstructuredTimeseriesData
} from "../../../core/util";
import {
  multiYearMeanSelected,
  displayError,
} from '../../../core/data-controller-helpers';

// This component renders a complete annual cycle graph, including a selector
// for the instance (dataset) to display and export-data buttons.
// The component is generalized by two function props, `getInstanceMetadata`
// and `dataToGraphSpec`, which respectively return metadata describing the
// the datasets to display, and return a graph spec for the graph proper.
export default class AnnualCycleGraph extends React.Component {
  // TODO: model_id, variable_id, and experiment are used only to set the
  // initial instance. Could instead make `initialInstance` a prop, which
  // the client computes according to their own recipe. Not sure whether
  // this is a gain or not, since the same computation (`firstMonthlyMetadata`)
  // would be done in each client.
  static propTypes = {
    meta: PropTypes.array,
    model_id: PropTypes.string,
    variable_id: PropTypes.string,
    experiment: PropTypes.string,
    area: PropTypes.string,
    getInstanceMetadata: PropTypes.func,
    // `getInstanceMetadata` returns the metadata describing the datasets to
    // be displayed in this component.
    // A different function is passed by different controllers to specialize
    // this general component to particular cases (single vs. dual controller).
    dataToGraphSpec: PropTypes.func,
    // `dataToGraphSpec` converts data (monthly, seasonal, annual cycle data)
    // to a graph spec.
    // A different function is passed by different controllers to specialize
    // this general component to particular cases (single vs. dual controller).
  };

  constructor(props) {
    super(props);

    const { start_date, end_date, ensemble_member } =
      this.firstMonthlyMetadata(this.props);
    this.state = {
      instance: { start_date, end_date, ensemble_member },
      graphSpec: undefined,
    };
  }
  
  firstMonthlyMetadata({ meta, model_id, variable_id, experiment }) {
    return _.findWhere(
      meta,
      { model_id, variable_id, experiment, timescale: 'monthly' }
    );
  }

  //Removes all data from the Annual Cycle graph and displays a message
  // TODO: set on either loading flag or empty data
  setAnnualCycleGraphNoDataMessage = (message) => {
    this.setState({
      graphSpec: {
        data: {
          columns: [],
          empty: {
            label: {
              text: message,
            },
          },
        },
        axis: {}
      },
    });
  };

  getAndValidateTimeseries(metadata, area) {
    const validate = multiYearMeanSelected(this.props) ?
      validateAnnualCycleData :
      validateUnstructuredTimeseriesData;
    return (
      getTimeseries(metadata, area)
        .then(validate)
        .then(response => response.data)
    );
  }

  loadAnnualCycleGraph(props) {
    // Fetch monthly, seasonal, and yearly resolution annual cycle data,
    // then convert it to a graph spec and set state accordingly.

    // TODO: When invoking only from componentDidMount and componentDidUpdate
    // (as advised in documentation), `props` does not need to be an explicit
    // argument; can use `this.props`.
    this.setAnnualCycleGraphNoDataMessage('Loading Data');

    const instanceMetadata =
      this.props.getInstanceMetadata(this.state.instance)
        .filter(metadata => !!metadata);
    const timeseriesPromises =
      instanceMetadata.map(metadata =>
        this.getAndValidateTimeseries(metadata, props.area)
      );

    Promise.all(timeseriesPromises).then(data => {
      this.setState({
        // TODO: Does instanceMetadata need to be reduced to unique elements?
        graphSpec: this.props.dataToGraphSpec(instanceMetadata, data),
      });
    }).catch(error => {
      displayError(error, this.setAnnualCycleGraphNoDataMessage);
    });
  }

  // TODO: Refactor to eliminate encoding of instance (dataset).
  handleChangeInstance = (instance) => {
    this.setState({ instance: JSON.parse(instance) });
  };

  // TODO: Extract to core/chart module, as it is common to all graphs.
  blankGraph = {
    data: {
      columns: [],
    },
    axis: {},
  };

  exportAnnualCycleData(format) {
    // TODO: Verify this works in case of dual graph --
    // what about comparand_id and comparandMeta??
    exportDataToWorksheet(
      'timeseries',
      _.pick(this.props, 'model_id', 'variable_id', 'experiment', 'meta'),
      this.state.graphSpec,
      format,
      this.state.instance
    );
  }
  
  handleExportXslx = this.exportAnnualCycleData.bind(this, 'xslx');
  handleExportCsv = this.exportAnnualCycleData.bind(this, 'csv');
  
  // Lifecycle hooks

  componentDidMount() {
    this.loadAnnualCycleGraph(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.meta !== this.props.meta ||
      !_.isEqual(prevState.instance, this.state.instance)
    ) {
      this.loadAnnualCycleGraph(this.props);
    }
  }

  render() {
    const graphSpec = this.state.graphSpec || this.blankGraph;
    
    return (
      <React.Fragment>
        <Row>
          <Col lg={4} lgPush={8} md={6} mdPush={6} sm={6} smPush={6}>
            <DatasetSelector
              meta={this.props.meta}
              // TODO: Refactor to eliminate encoding of dataset.
              value={JSON.stringify(this.state.instance)}
              onChange={this.handleChangeInstance}
            />
          </Col>
          <Col lg={4} lgPush={1} md={6} mdPush={1} sm={6} smPush={1}>
            <ExportButtons
              onExportXslx={this.handleExportXslx}
              onExportCsv={this.handleExportCsv}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <DataGraph
              data={graphSpec.data}
              axis={graphSpec.axis}
              tooltip={graphSpec.tooltip}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
