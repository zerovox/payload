import React from 'react';
import LeafButton from '../Button';
import RightAlignIcon from '../../../../../icons/RightAlign';

const RightAlign = ({ attributes, children }) => (
  <div
    {...attributes}
    style={{ textAlign: 'right' }}
  >
    {children}
  </div>
);

const rightAlign = {
  Button: () => (
    <LeafButton format="rightAlign">
      <RightAlignIcon />
    </LeafButton>
  ),
  Leaf: RightAlign,
};

export default rightAlign;
