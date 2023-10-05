import React from "react";
import { Tooltip } from "react-tooltip";

export interface IFavouritePropertyTooltip {
  open: boolean;
  onRequestClose: any;
  anchorId: any;
}

const FavouritePropertyTooltip: React.FC<IFavouritePropertyTooltip> = ({
  anchorId
}) => {


  return (
    <Tooltip
      place="left"
      style={{ 
        width: '300px',
        backgroundColor: '#F7F7F6', 
        color: '#6B7280',
        border: '2px solid #6B7280'
      }}
      anchorId={anchorId}
      events={['click']}
      delayHide={5000}
      html={`Você precisa estar logado para favoritar imóveis! Se você já tem uma conta, faça LOGIN com ela, se não, crie uma conta para aproveitar todas as funcionalidades da Locale.`}
      className="pointer-events-none"
      variant="warning"
      noArrow
    />
  );
};

export default FavouritePropertyTooltip;