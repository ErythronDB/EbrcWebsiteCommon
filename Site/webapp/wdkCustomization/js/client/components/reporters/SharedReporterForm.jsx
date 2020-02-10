import React from 'react';
import { CategoriesCheckboxTree, Checkbox, ReporterSortMessage, RadioList } from 'wdk-client/Components';
import * as CategoryUtils from 'wdk-client/Utils/CategoryUtils';
import * as ComponentUtils from 'wdk-client/Utils/ComponentUtils';
import * as OntologyUtils from 'wdk-client/Utils/OntologyUtils';
import * as ReporterUtils from 'wdk-client/Views/ReporterForm/reporterUtils';

let util = Object.assign({}, ComponentUtils, ReporterUtils, OntologyUtils, CategoryUtils);

let SharedReporterForm = props => {

  let { scope, question, recordClass, formState, formUiState, updateFormState, updateFormUiState, onSubmit, ontology, includeSubmit } = props;
  let getUpdateHandler = fieldName => util.getChangeHandler(fieldName, updateFormState, formState);
  let getUiUpdateHandler = fieldName => util.getChangeHandler(fieldName, updateFormUiState, formUiState);

  return (
    <div>
      <div className="eupathdb-ReporterForm eupathdb-ReporterForm__shared">
        <ReporterSortMessage scope={scope}/>

        <div className="eupathdb-ReporterFormGroup eupathdb-ReporterFormGroup__columns">
          <CategoriesCheckboxTree
              // title and layout of the tree
              title="Choose Attributes"
              searchBoxPlaceholder="Search Attributes..."
              tree={util.getAttributeTree(ontology, recordClass.fullName, question)}

              // state of the tree
              selectedLeaves={formState.attributes}
              expandedBranches={formUiState.expandedAttributeNodes}
              searchTerm={formUiState.attributeSearchText}

              // change handlers for each state element controlled by the tree
              onChange={util.getAttributesChangeHandler('attributes', updateFormState, formState, recordClass)}
              onUiChange={getUiUpdateHandler('expandedAttributeNodes')}
              onSearchTermChange={getUiUpdateHandler('attributeSearchText')}
          />
        </div>

        <div className="eupathdb-ReporterFormGroup eupathdb-ReporterFormGroup__tables">
          <CategoriesCheckboxTree
            // title and layout of the tree
            title="Choose Tables"
            searchBoxPlaceholder="Search Tables..."
            tree={util.getTableTree(ontology, recordClass.fullName)}

            // state of the tree
            selectedLeaves={formState.tables}
            expandedBranches={formUiState.expandedTableNodes}
            searchTerm={formUiState.tableSearchText}

            // change handlers for each state element controlled by the tree
            onChange={getUpdateHandler('tables')}
            onUiChange={getUiUpdateHandler('expandedTableNodes')}
            onSearchTermChange={getUiUpdateHandler('tableSearchText')}
          />
        </div>

        <div className="eupathdb-ReporterFormGroup eupathdb-ReporterFormGroup__otherOptions">
          <div className="eupathdb-ReporterFormDownloadType">
            <h3>Download Type</h3>
            <div>
              <RadioList name="attachmentType" value={formState.attachmentType}
                onChange={getUpdateHandler('attachmentType')} items={util.attachmentTypes}/>
            </div>
          </div>
          <div className="eupathdb-ReporterFormAddtionOptions">
            <h3>Additional Options</h3>
            <div>
              <label>
                <Checkbox value={formState.includeEmptyTables} onChange={getUpdateHandler('includeEmptyTables')}/>
                <span style={{marginLeft:'0.5em'}}>Include empty tables</span>
              </label>
            </div>
          </div>
        </div>

      </div>

      { includeSubmit &&
        <div className="eupathdb-ReporterFormSubmit">
          <button className="btn" type="submit" onClick={onSubmit}>Get {recordClass.displayNamePlural}</button>
        </div>
      }
    </div>
  );
};

SharedReporterForm.getInitialState = (downloadFormStoreState) => {
  let { scope, question, recordClass, ontology, preferences } = downloadFormStoreState;
  // select all attribs and tables for record page, else column user prefs and no tables
  let allReportScopedAttrs = util.getAllLeafIds(util.getAttributeTree(ontology, recordClass.fullName, question));
  let attribs = util.addPk((scope === 'results' ?
      util.getAttributeSelections(preferences, question, allReportScopedAttrs) :
      allReportScopedAttrs), recordClass);
  let tables = (scope === 'results' ? [] :
      util.getAllLeafIds(util.getTableTree(ontology, recordClass.fullName)));
  return {
    formState: {
      attributes: attribs,
      tables: tables,
      includeEmptyTables: true,
      attachmentType: "plain"
    },
    formUiState: {
      expandedAttributeNodes: null,
      attributeSearchText: "",
      expandedTableNodes: null,
      tableSearchText: ""
    }
  };
}

export default SharedReporterForm;
