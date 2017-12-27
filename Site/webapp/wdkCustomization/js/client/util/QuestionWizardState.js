// Wizard state utility functions

import { memoize, pick } from 'lodash';
import { getTree } from 'wdk-client/FilterServiceUtils';
import { getLeaves } from 'wdk-client/TreeUtils';

/**
 * Create initial wizard state object
 */
export function createInitialState(question, recordClass, paramValues) {

  const paramUIState = question.parameters.reduce(function(uiState, param) {
    switch(param.type) {
      case 'FilterParamNew': {
        const leaves = getLeaves(getTree(param.ontology), node => node.children);
        const ontology = param.values == null
          ? param.ontology
          : param.ontology.map(entry =>
            param.values[entry.term] == null
              ? entry
              : Object.assign(entry, {
                values: param.values[entry.term].join(' ')
              })
          );
        return Object.assign(uiState, {
          [param.name]: {
            ontology: ontology,
            activeOntologyTerm: leaves.length > 0 ? leaves[0].field.term : null,
            hideFilterPanel: leaves.length === 1,
            hideFieldPanel: leaves.length === 1,
            ontologyTermSummaries: {},
            fieldStates: {},
            defaultMemberFieldState: {
              sort: {
                columnKey: 'value',
                direction: 'asc',
                groupBySelected: false
              }
            }
          }
        });
      }

      case 'FlatVocabParam':
      case 'EnumParam':
        return Object.assign(uiState, {
          [param.name]: {
            vocabulary: param.vocabulary
          }
        });

      default:
        return Object.assign(uiState, {
          [param.name]: {}
        });
    }
  }, {});

  const groupUIState = question.groups.reduce(function(groupUIState, group) {
    return Object.assign(groupUIState, {
      [group.name]: {
        accumulatedTotal: undefined
      }
    });
  }, {});

  const filterPopupState = {
    visible: false,
    pinned: false
  }

  return {
    question,
    paramValues,
    paramUIState,
    groupUIState,
    filterPopupState,
    recordClass,
    activeGroup: undefined,
  };
}

/**
 * Get the default parameter values
 * @param {WizardState} wizardState
 * @return {Record<string, string>}
 */
export function getDefaultParamValues(wizardState) {
  return wizardState.question.parameters.reduce(function(defaultParamValues, param) {
    return Object.assign(defaultParamValues, { [param.name]: param.defaultValue });
  }, {});
}

/**
 * Determine if the parameters of a given group have their default value.
 * @param {WizardState} wizardState
 * @param {Group} group
 * @return {boolean}
 */
export function groupParamsValuesAreDefault(wizardState, group) {
  const defaultValues = getDefaultParamValues(wizardState);
  return group.parameters.every(paramName =>
    wizardState.paramValues[paramName] === defaultValues[paramName]);
}

export function getGroup(wizardState, groupName) {
  return getGroupMap(wizardState.question).get(groupName);
}

export function getParameter(wizardState, paramName) {
  return getParamMap(wizardState.question).get(paramName);
}

/**
 * Get the set of parameters for a given group.
 */
export function getParameterValuesForGroup(wizardState, groupName) {
  const group = getGroup(wizardState, groupName);
  return pick(wizardState.paramValues, group.parameters);
}

const getGroupMap = memoize(question => new Map(question.groups.map(g => [g.name, g])));
const getParamMap = memoize(question => new Map(question.parameters.map(p => [p.name, p])));


// Immutable state modifiers
// -------------------------

/**
 * Show or hide popup with filter summary.
 * @param {WizardState} wizardState
 * @param {boolean} visiblity
 * @return {WizardState}
 */
export function setFilterPopupVisiblity(wizardState, visible) {
  return updateObjectImmutably(wizardState, ['filterPopupState', 'visible'], visible);
}

/**
 * Set if filter popup should hide when navigation elements are clicked
 * @param {WizardState} wizardState
 * @param {boolean} pinned
 * @return {WizardState}
 */
export function setFilterPopupPinned(wizardState, pinned) {
  return updateObjectImmutably(wizardState, ['filterPopupState', 'pinned'], pinned);
}

/**
 * Update paramValues with defaults.
 * @param {WizardState} wizardState
 * @return {WizardState}
 */
export function resetParamValues(wizardState) {
  return updateObjectImmutably(wizardState, ['paramValues'], getDefaultParamValues(wizardState));
}

/**
 * Creates a new object based on input object with an updated value
 * a the specified path.
 */
function updateObjectImmutably(object, [key, ...restPath], value) {
  const isObject = typeof object === 'object';
  if (!isObject || (isObject && !(key in object)))
    throw new Error("Invalid key path");

  return Object.assign({}, object, {
    [key]: restPath.length === 0 ? value
      : updateObjectImmutably(object[key], restPath, value)
  })
}
