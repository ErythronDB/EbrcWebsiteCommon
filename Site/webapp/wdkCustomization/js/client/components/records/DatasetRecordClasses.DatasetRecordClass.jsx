import React from 'react';
import { HelpIcon } from 'wdk-client/Components';

// Use Element.innerText to strip XML
function stripXML(str) {
  let div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent;
}

function formatLink(link, opts) {
  opts = opts || {};
  let newWindow = !!opts.newWindow;
  return (
    <a href={link.url} target={newWindow ? '_blank' : '_self'}>{stripXML(link.displayText)}</a>
  );
}

function renderDownloadUrl(url) {
  return formatLink(url);
}

function renderPrimaryPublication(publication) {
  return formatLink(publication.pubmed_link, { newWindow: true });
}

function renderSourceVersion(version) {
  return (
    <span>
      {version.version}&nbsp;
      <i className="fa fa-question-circle" style={{ color: 'blue' }}
        title={'The data provider\'s version number or publication date, from' +
          ' the site the data was acquired. In the rare case neither is available,' +
          ' the download date.'} />
    </span>
  );
}

export function RecordHeading(props) {
  let { record, questions, recordClasses } = props;
  let { attributes, tables, id } = record;
  let {
    full_description,
    primary_contact,
    institution,
    organism,
    primary_publication,
    bulk_download_url
  } = attributes;

  let version = tables.Version && tables.Version[0];
  let primaryPublication = tables.Publications && tables.Publications[0];

  return (
    <div>
      <props.DefaultComponent {...props} />
      <div className="wdk-RecordOverview erythrondb-RecordOverview">

        <div className="erythrondb-RecordOverviewItem">
          <span style={{ whiteSpace: 'normal' }} dangerouslySetInnerHTML={{ __html: full_description }} />
        </div>

        {organism ? (
          <div className="erythrondb-RecordOverviewItem mt-4">
            <strong>Organism: </strong>
            <span dangerouslySetInnerHTML={{ __html: organism }} />
          </div>
        ) : null}

        {primary_contact ? (
          <div className="erythrondb-RecordOverviewItem mt-4">
            <strong>Submitter: </strong>
            <span>{primary_contact}</span>
          </div>
        ) : null}

        {primary_publication ? (
          <div className="erythrondb-RecordOverviewItem mt-4">
            <strong>Publications: </strong>
            <span dangerouslySetInnerHTML={{ __html: primary_publication }} />
          </div>
        ) : null}

        {bulk_download_url ? (
          <div className="erythrondb-RecordOverviewItem mt-4">
            <strong>Accession:</strong><HelpIcon>Browse study design and download raw data files from ArrayExpress</HelpIcon>
            <span>&nbsp;&nbsp;{renderDownloadUrl(bulk_download_url)}</span>
          </div>
        ) : null}


        <div className="erythrondb-RecordOverviewItem mt-4">
          <strong>Search Data: </strong>
          <div>
            <ul>
              {id[0].value == 'study001'
                ? <li><a href={`../../search/mm/${id[0].value}_comparison`}>Compare cell stages within or across erythroid lineages</a></li>
                : <li><a href={`../../search/${organism.toLowerCase()}/${id[0].value}_comparison`}>Compare EPO-challenged cells to controls</a></li>
              }
              {id[0].value != 'study003' &&
                <li><a href={`../../search/mm/${id[0].value}_expression`}>Find genes by ranked expression level</a></li>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecordMainSection(props) {
  if (props.record.id[0].value != 'study003') {
    return <props.DefaultComponent {...props} />
  }
  else {
    return null;
  }
}

export function RecordTable(props) {
  if (props.record.id[0].value != 'study003') {
    return <props.DefaultComponent {...props} />
  }
  else {
    return null;
  }
}
