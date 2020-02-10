import React from 'react';
import { RadioList, Checkbox } from 'wdk-client/Components';
import * as ComponentUtils from 'wdk-client/Utils/ComponentUtils';
import * as ReporterUtils from 'wdk-client/Views/ReporterForm/reporterUtils';

let util = Object.assign({}, ComponentUtils, ReporterUtils);

let attachmentTypes = [
  { value: "text", display: "GFF File" },
  { value: "plain", display: "Show in Browser"}
];

let GffInputs = props => {
  let { recordClass, formState, getUpdateHandler } = props;
  if (recordClass.fullName != "TranscriptRecordClasses.TranscriptRecordClass") {
    return ( <noscript/> );
  }
  return (
    <div style={{marginLeft:'2em'}}>
      <Checkbox value={formState.hasTranscript} onChange={getUpdateHandler('hasTranscript')}/>
      Include Predicted RNA/mRNA Sequence (introns spliced out)<br/>
      <Checkbox value={formState.hasProtein} onChange={getUpdateHandler('hasProtein')}/>
      Include Predicted Protein Sequence<br/>
    </div>
  );
};

let Gff3ReporterForm = props => {
  let { formState, recordClass, updateFormState, onSubmit, includeSubmit  } = props;
  let getUpdateHandler = fieldName => util.getChangeHandler(fieldName, updateFormState, formState);
  return (
    <div>
      <h3>Generate a report of your query result in GFF3 format</h3>
      <GffInputs formState={formState} recordClass={recordClass} getUpdateHandler={getUpdateHandler}/>
      <div>
        <h3>Download Type:</h3>
        <div style={{marginLeft:"2em"}}>
          <RadioList name="attachmentType" value={formState.attachmentType}
              onChange={getUpdateHandler('attachmentType')} items={attachmentTypes}/>
        </div>
      </div>
      { includeSubmit &&
        <div className="eupathdb-ReporterFormSubmit">
          <button className="btn" type="submit" onClick={onSubmit}>Get GFF3 file</button>
        </div>
      }
    </div>
  );
};

let initialStateMap = {
  "SequenceRecordClasses.SequenceRecordClass": {
    attachmentType: 'plain'
  },
  "TranscriptRecordClasses.TranscriptRecordClass": {
    hasTranscript: false,
    hasProtein: false,
    attachmentType: 'plain'
  }
};

Gff3ReporterForm.getInitialState = (downloadFormStoreState) => {
  let recordClassFullName = downloadFormStoreState.recordClass.fullName;
  return {
    formState: (recordClassFullName in initialStateMap ? initialStateMap[recordClassFullName] : {}),
    formUiState: {}
  };
};

export default Gff3ReporterForm;
