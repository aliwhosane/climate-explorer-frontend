// This module provides functions common to several app controllers.
//
// Note: In this module, we follow a pure functional programming style wherever
// possible. In particular, this means (wherever possible):
//
//    - No side effects (pure functions)
//
//    - Iteratee-first, data-last methods
//      (see https://github.com/lodash/lodash/wiki/FP-Guide)
//
//    - Most methods are partially or fully curried.

import filter from 'lodash/fp/filter';
import find from 'lodash/fp/find';
import flatMap from 'lodash/fp/flatMap';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import flatten from 'lodash/fp/flatten';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import assign from 'lodash/fp/assign';
import _ from 'lodash';
import sortBy from 'lodash/fp/sortBy';


// Get the ensemble name from props (as passed to an app controller),
// falling back to the env variable REACT_APP_CE_ENSEMBLE_NAME if not found.
export const ensemble_name = props =>
  (props.match && props.match.params && props.match.params.ensemble_name) ||
  props.ensemble_name ||
  process.env.REACT_APP_CE_ENSEMBLE_NAME;


// Filters out noisy multi-year monthly datasets.
export const filterOutMonthlyMym = filter(
  m => !(m.multi_year_mean === false && m.timescale === 'monthly')
);


export const findModelNamed = model_id =>
  find({ value: { representative: { model_id }}});


export const findScenarioIncluding = s =>
  find(opt => opt.value.representative.experiment.includes(s));


export const findVariableMatching = match =>
  flow(flatMap('options'), find(match));


// Extract a value from the representative for a named option in source.
export const representativeValue = (optionName, valueName) =>
  get([optionName, 'value', 'representative', valueName]);


// Returns an object containing the union of all representatives of the
// options named in the arguments (e.g., 'model', 'scenario').
// Returned object is suitable as a constraint for a
// `SimpleConstraintGroupingSelector`.
export const constraintsFor = (...optionNames) => options =>
  flow(
    flatten,
    map(name => options[name]),
    map(option => option && option.value.representative),
    reduce((result, value) => assign(result, value), {})
  )(optionNames);


// Return a filtered subset of metadata, based on the selected options
// (typically one or more of model, emissions scenario, variable).
//
// Initially, options (derived from selectors) can be undefined,
// and go through a cascading defaulting process that eventually settles
// with a defined value for all of them. Returning a metadata set that is
// filtered by a partially settled selector set causes problems in client
// components. This function returns the empty array unless a full set of
// constraints (derived from selectors) is available.
export const filterMetaBy = (...optionNames) => options => meta => {
  const settled = _.allDefined(options, ...optionNames);
  if (!settled) {
    return [];
  }
  return flow(
    filter(constraintsFor(...optionNames)(options)),
    sortBy('unique_id')
  )(meta);
};


// Generic state setter
export const setState = (this_, name) =>
    value => this_.setState({ [name]: value });