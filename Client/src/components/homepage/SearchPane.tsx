import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { memoize, noop, keyBy } from 'lodash';

import { CategoriesCheckboxTree, Link, Loading, IconAlt } from '@veupathdb/wdk-client/lib/Components';
import { LinksPosition } from '@veupathdb/wdk-client/lib/Components/CheckboxTree/CheckboxTree';
import { RootState } from '@veupathdb/wdk-client/lib/Core/State/Types';
import { useSessionBackedState } from '@veupathdb/wdk-client/lib/Hooks/SessionBackedState';
import { CategoryTreeNode, getDisplayName, getTargetType, getRecordClassUrlSegment, getTooltipContent, isIndividual, getFormattedTooltipContent } from '@veupathdb/wdk-client/lib/Utils/CategoryUtils';
import { makeClassNameHelper, wrappable } from '@veupathdb/wdk-client/lib/Utils/ComponentUtils';
import { decode, arrayOf, string } from '@veupathdb/wdk-client/lib/Utils/Json';
import { Question } from '@veupathdb/wdk-client/lib/Utils/WdkModel';

import { HtmlTooltip } from '@veupathdb/components/lib/components/widgets/Tooltip';

import { combineClassNames, useAlphabetizedSearchTree } from 'ebrc-client/components/homepage/Utils';

import './SearchPane.scss';

const cx = makeClassNameHelper('ebrc-SearchPane');
const EXPANDED_BRANCHES_SESSION_KEY = 'homepage-left-panel-expanded-branch-ids';

export type Props = {
  containerClassName?: string,
  searchTree: CategoryTreeNode | undefined
};

export const SearchPane = (props: Props) => {
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ expandedBranches, setExpandedBranches ] = useSessionBackedState(
    [ ],
    EXPANDED_BRANCHES_SESSION_KEY,
    JSON.stringify,
    memoize((s: string) => decode(arrayOf(string), s))
  );

  const alphabetizedSearchTree = useAlphabetizedSearchTree(props.searchTree);

  return (
    <nav className={combineClassNames(cx(), props.containerClassName)}>
      <h2>
        Search for...
      </h2> 
      <div className={cx('CheckboxTreeContainer')}>
        <SearchCheckboxTree 
          searchTree={alphabetizedSearchTree}
          searchTerm={searchTerm}
          expandedBranches={expandedBranches}
          setSearchTerm={setSearchTerm}
          setExpandedBranches={setExpandedBranches}
        />
      </div>
    </nav>
  );
}

export type SearchCheckboxTreeProps = {
  searchTree?: CategoryTreeNode,
  searchTerm: string,
  expandedBranches: string[],
  setSearchTerm: (newSearchTerm: string) => void,
  setExpandedBranches: (newExpandedBranches: string[]) => void,
  linksPosition?: LinksPosition
  showSearchBox?: boolean
};

export const SearchCheckboxTree = wrappable((props: SearchCheckboxTreeProps) => {
  const noSelectedLeaves = useMemo(
    () => [] as string[],
    []
  );

  const questionsByUrlSegment = useSelector((state: RootState) => keyBy(state.globalData.questions, 'urlSegment'));

  const renderNode = useCallback(
    (node: CategoryTreeNode, path: number[] | undefined) => (
      <SearchPaneNode
        node={node}
        questionsByUrlSegment={questionsByUrlSegment}
        path={path}
      />
    ),
    [questionsByUrlSegment]
  );

  return !props.searchTree 
    ? <Loading />
    : <CategoriesCheckboxTree
        containerClassName="wdk-SearchTree"
        selectedLeaves={noSelectedLeaves}
        onChange={noop}
        tree={props.searchTree}
        expandedBranches={props.expandedBranches}
        searchTerm={props.searchTerm}
        isSelectable={false}
        searchBoxPlaceholder="Filter the searches below..."
        leafType="search"
        renderNode={renderNode}
        renderNoResults={renderNoResults}
        onUiChange={props.setExpandedBranches}
        onSearchTermChange={props.setSearchTerm}
        showSearchBox={props.showSearchBox != null ? props.showSearchBox : true}
        linksPosition={props.linksPosition != null ? props.linksPosition : LinksPosition.Top}
      />;
});

const renderNoResults = (searchTerm: string) =>
  <div>
    <p>
      <strong>
        We could not find any searches matching "{searchTerm}".
      </strong>
    </p>
    <p>
      Perhaps you meant to
      {' '}
      <Link to={`/search?q=${encodeURIComponent(searchTerm)}`}>
        run a site-wide search for "{searchTerm}"
      </Link>
      ?
    </p>
  </div>;

interface SearchPaneNodeProps {
  questionsByUrlSegment: Record<string, Question>;
  node: CategoryTreeNode;
  path: number[] | undefined;
}

function SearchPaneNode({
  questionsByUrlSegment = {},
  node,
  path
}: SearchPaneNodeProps) {
  const [ offerTooltip, setOfferTooltip ] = useState(true);

  const nodeMetadata = isIndividual(node) && getTargetType(node) === 'search'
    ? { isSearch: true, searchName: (node.wdkReference as any).urlSegment }
    : { isSearch: false };

  const baseUrlSegment = nodeMetadata.isSearch ? nodeMetadata.searchName : null;

  // autoRun searches whose questions (1) require no parameters and (2) are not internal dataset questions
  // (N.B.: internal dataset questions are currently being detected by the presence of
  // "datasetCategory" and "datasetSubtype" properties)
  const urlSegment = (
    questionsByUrlSegment[baseUrlSegment]?.paramNames.length === 0 &&
    questionsByUrlSegment[baseUrlSegment]?.properties?.datasetCategory == null &&
    questionsByUrlSegment[baseUrlSegment]?.properties?.datasetSubtype == null
  )
    ? `${baseUrlSegment}?autoRun`
    : baseUrlSegment;

  const displayName = getDisplayName(node);
  const displayElement = nodeMetadata.isSearch
    ? <Link
        onClick={() => {
          setOfferTooltip(false);
        }}
        to={`/search/${getRecordClassUrlSegment(node)}/${urlSegment}`}
      >
        <IconAlt fa="search" />
        {displayName}
      </Link>
    : <span className={path?.length === 2 ? 'SubcategoryText' : undefined}>{displayName}</span>

  const tooltipContent = getFormattedTooltipContent(node);

  return tooltipContent && offerTooltip
    ? <HtmlTooltip css={{}} title={tooltipContent}>
        {displayElement}
      </HtmlTooltip>
    : displayElement;
}
