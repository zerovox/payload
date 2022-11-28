import React from 'react';
import LeafButton from '../Button';
import LeftAlignIcon from '../../../../../icons/LeftAlign';

const LeftAlign = ({ attributes, children }) => (
  <div
    {...attributes}
    style={{ textAlign: 'left' }}
  >
    {children}
  </div>
);

const leftAlign = {
  Button: () => (
    <LeafButton format="leftAlign">
      <LeftAlignIcon />
    </LeafButton>
  ),
  Leaf: LeftAlign,
};

export default leftAlign;
