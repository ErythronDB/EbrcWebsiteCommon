import React from 'react';

import { IconAlt } from 'wdk-client/Components';
import { makeClassNameHelper } from 'wdk-client/Utils/ComponentUtils';

import { combineClassNames } from 'ebrc-client/components/homepage/Utils';

import './SocialMediaControls.scss';

type Props = {
  isNewsExpanded: boolean,
  toggleNews: () => void
};

const cx = makeClassNameHelper('ebrc-SocialMediaControls');

export const SocialMediaControls = ({ isNewsExpanded, toggleNews }: Props) => {
  const newsToggleClassName = combineClassNames(
    cx('NewsToggle'),
    'link'
  );

  return (
    <div className={cx('', isNewsExpanded ? 'news-expanded' : 'news-collapsed')}>
      {
        isNewsExpanded &&
        <button type="button" className={newsToggleClassName} onClick={toggleNews}>
          <span>News</span>
          <IconAlt 
            fa="angle-double-right"
          />
        </button>
      }
      {
        !isNewsExpanded &&
        <div className="ebrc-SocialMediaLinks">
          <button onClick={toggleNews} className="link">
            <IconAlt fa="newspaper-o" />
            <span>News</span>
            <span>Tweets</span>
          </button>
        </div>
      }
    </div>
  );
};
