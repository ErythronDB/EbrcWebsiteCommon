import React from 'react';
import { memoize } from 'lodash';
import { Loading, ServerSideAttributeFilter } from 'wdk-client/Components';
import { paramPropTypes } from '../util/paramUtil';

/**
 * FilterParamNew component
 */
export default class FilterParamNew extends React.PureComponent {
  constructor(props) {
    super(props);
    this._getFiltersFromValue = memoize(this._getFiltersFromValue);
    this._getFieldMap = memoize(this._getFieldMap);
    this._handleActiveFieldChange = this._handleActiveFieldChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleMemberSort = this._handleMemberSort.bind(this);
    this._handleMemberSearch = this._handleMemberSearch.bind(this);
    this._handleRangeScaleChange = this._handleRangeScaleChange.bind(this);
  }

  _getFiltersFromValue(value) {
    let { filters = [] } = JSON.parse(value);
    return filters;
  }

  _getFieldMap(ontology) {
    return new Map(ontology.map(o => [ o.term, o ]));
  }

  _handleActiveFieldChange(term) {
    let filters = this._getFiltersFromValue(this.props.value);
    this.props.onActiveOntologyTermChange(this.props.param, filters, term);
  }

  _handleFilterChange(filters) {
    const fieldMap = this._getFieldMap(this.props.param.ontology);
    const filtersWithDisplay = filters.map(filter => {
      const field = fieldMap.get(filter.field);
      const fieldDisplayName = field ? field.display : undefined;
      return { ...filter, fieldDisplayName };
    });
    this.props.onParamValueChange(this.props.param, JSON.stringify({ filters: filtersWithDisplay }));
  }

  _handleMemberSort(field, sort) {
    this.props.onOntologyTermSort(this.props.param, field.term, sort);
  }

  _handleMemberSearch(field, searchTerm) {
    this.props.onOntologyTermSearch(this.props.param, field.term, searchTerm);
  }

  _handleRangeScaleChange(field, state) {
    let newState = Object.assign({}, this.props.uiState, {
      fieldStates: Object.assign({}, this.props.uiState.fieldStates, {
        [field.term]: state
      })
    });
    this.props.onParamStateChange(this.props.param, newState);
  }

  render() {
    let { param, uiState } = this.props;
    let fields = this._getFieldMap(uiState.ontology);
    let filters = this._getFiltersFromValue(this.props.value);
    let activeField = fields.get(uiState.activeOntologyTerm);
    let activeFieldState = uiState.fieldStates[uiState.activeOntologyTerm];
    let activeFieldSummary = uiState.ontologyTermSummaries[uiState.activeOntologyTerm];

    return (
      <div className="filter-param">
        {uiState.errorMessage && <pre style={{color: 'red'}}>{uiState.errorMessage}</pre>}
        {uiState.loading && <Loading/>}
        <ServerSideAttributeFilter
          autoFocus={this.props.autoFocus}
          displayName={param.filterDataTypeDisplayName || param.displayName}

          fields={fields}
          filters={filters}
          dataCount={uiState.unfilteredCount}
          filteredDataCount={uiState.filteredCount}

          activeField={activeField}
          activeFieldState={activeFieldState}
          activeFieldSummary={activeFieldSummary}

          hideFilterPanel={uiState.hideFilterPanel}
          hideFieldPanel={uiState.hideFieldPanel}

          onFiltersChange={this._handleFilterChange}
          onActiveFieldChange={this._handleActiveFieldChange}
          onMemberSort={this._handleMemberSort}
          onMemberSearch={this._handleMemberSearch}
          onRangeScaleChange={this._handleRangeScaleChange}
          hideGlobalCounts={true}
        />
      </div>
    )
  }
}

FilterParamNew.propTypes = paramPropTypes;
