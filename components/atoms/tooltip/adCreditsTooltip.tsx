import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export interface IAdCreditsTooltip {
  anchorId: string | undefined;
  planName: string;
  creditsLeft: number;
}

const AdCreditsTooltip: React.FC<IAdCreditsTooltip> = ({
  anchorId,
  planName,
  creditsLeft,
}) => {

  const plansInfo = {
    free: `Este é seu plano atual e você pode anunciar à vontade por ele, porém seu anúncio não aparecerá em destaque.`,
    basic: creditsLeft > 0 ?
      `Este é seu plano atual e ainda há ${creditsLeft} anúncios destaque disponíveis` :
      `Este é seu plano atual e não há mais destaques disponíveis. Mas você ainda pode fazer quantos anúncios comuns desejar trocando seu plano para o grátis`,
    plus: creditsLeft > 0 ?
      `Este é seu plano atual e ainda há ${creditsLeft} anúncios destaque disponíveis` :
      `Este é seu plano atual e não há mais destaques disponíveis. Mas você ainda pode fazer quantos anúncios comuns desejar trocando seu plano para o grátis`,
  }

  const selectedContent = () => {
    let content;
    if (planName === 'Free') {
      content = plansInfo.free;
    } else if (planName === 'Básico') {
      content = plansInfo.basic;
    } else {
      content = plansInfo.plus
    }

    return content;
  };

  return (
    <Tooltip
      style={{
        backgroundColor: '#F7F7F6',
        color: '#6B7280',
        border: '2px solid #6B7280',
        width: '100%'
      }}
      border="2px solid #6B7280"
      anchorId={anchorId}
      openEvents={{ mouseenter: true }}
      closeEvents={{ click: true, mouseleave: true }}
      globalCloseEvents={{ scroll: true, clickOutsideAnchor: true }}
      content={selectedContent()}
      delayHide={4000}
      noArrow
      place='bottom'
    />
  );
};

export default AdCreditsTooltip;