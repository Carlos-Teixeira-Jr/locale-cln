import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export interface ILinkCopiedTooltip {
  open: boolean;
  onRequestClose: any;
  anchorId: any;
}

const LinkCopiedTooltip: React.FC<ILinkCopiedTooltip> = ({
  anchorId,
}) => {
  return (
    <Tooltip
      style={{ 
        backgroundColor: '#F7F7F6', 
        color: '#6B7280',
        border: '2px solid #6B7280'
      }}
      anchorId={anchorId}
      events={['click']}
      content="Link copiado!"
      delayHide={5000}
      noArrow
    />
  );
};

export default LinkCopiedTooltip;