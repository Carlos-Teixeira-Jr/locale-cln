import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { IPlan } from '../../../common/interfaces/plans/plans';
import { useIsMobile } from '../../../hooks/useIsMobile';

export interface IAdCreditsTooltip {
  anchorId: string | undefined;
  planName: string;
  creditsLeft: number;
  plans: IPlan[];
  ownerPlan: string
}

const AdCreditsTooltip: React.FC<IAdCreditsTooltip> = ({
  anchorId,
  creditsLeft,
  plans,
  ownerPlan
}) => {

  const [selectedContent, setSelectedContent] = useState('');
  const formattedAnchorId = anchorId?.replace(/^[^-]*-/, "");
  const clickedCard = plans?.find((plan) => plan._id === formattedAnchorId);
  const isMobile = useIsMobile();

  const changePlansInfo = {
    free: ownerPlan !== clickedCard?._id ? 'Ao mudar seu plano para o GRÁTIS você poderá manter somente 1 anúncio ativo' : `Este é seu plano atual e ainda há ${creditsLeft} anúncios disponíveis.`,
    basic: ownerPlan !== clickedCard?._id ? 'Ao mudar seu plano para o BÁSICO você poderá manter somente 4 anúncios ativos e o valor de seu plano será atualizado na próxima cobrança.' : `Este é seu plano atual e ainda há ${creditsLeft} anúncios disponíveis.`,
    plus: ownerPlan !== clickedCard?._id ? 'Ao trocar para o LOCALE PLUS, você mantém 7 anúncios ativos, destaca 1 anúncio, pode adquirir créditos extras para novos anúncios e o valor será atualizado na próxima cobrança.' : `Este é seu plano atual e ainda há ${creditsLeft} anúncios disponíveis.`
  }

  useEffect(() => {
    const selectedContent = () => {
      let content;
      if (clickedCard?.name === 'Free') {
        content = changePlansInfo.free;
      } else if (clickedCard?.name === 'Básico') {
        content = changePlansInfo.basic;
      } else if (clickedCard?.name === 'Locale Plus') {
        content = changePlansInfo.plus
      }

      return content;
    };
    const selectedCont = selectedContent();
    setSelectedContent(selectedCont!)
  }, [anchorId])

  return (
    <>
      {!isMobile && (
        <Tooltip
          style={{
            backgroundColor: '#F7F7F6',
            color: '#6B7280',
            border: '2px solid #6B7280',
            width: '100%',
            fontSize: isMobile ? '18px' : '12px',
            lineHeight: 1.2,
            zIndex: 999999
          }}
          border="2px solid #6B7280"
          anchorSelect={`.${anchorId}`}
          openOnClick
          closeEvents={{ click: true, mouseleave: true }}
          globalCloseEvents={{ scroll: true, clickOutsideAnchor: true }}
          content={selectedContent}
          delayHide={4000}
          noArrow
          variant='info'
          place='bottom'
        />
      )}
    </>
  );
};

export default AdCreditsTooltip;