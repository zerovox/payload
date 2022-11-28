import React from 'react';
import LeafButton from '../Button';
import CenterAlignIcon from '../../../../../icons/CenterAlign';

const CenterAlign = ({ attributes, children }) => (
  <div
    {...attributes}
    style={{ textAlign: 'center' }}
  >
    {children}
  </div>
);

const centerAlign = {
  Button: () => (
    <LeafButton format="centerAlign">
      <CenterAlignIcon />
    </LeafButton>
  ),
  Leaf: CenterAlign,
};

export default centerAlign;
