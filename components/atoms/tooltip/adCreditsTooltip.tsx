import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export interface IAdCreditsTooltip {
  open: boolean;
  onRequestClose: any;
  anchorId: any;
  planName: string;
  creditsLeft: number
}

const AdCreditsTooltip: React.FC<IAdCreditsTooltip> = ({
  anchorId,
  planName,
  creditsLeft
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

  const [selectedContent, setSelectedContent] = useState(planName);
  console.log("🚀 ~ selectedContent:", selectedContent)

  useEffect(() => {
    setSelectedContent(planName);
  }, [])

  return (
    <Tooltip
      style={{
        backgroundColor: '#F7F7F6',
        color: '#6B7280',
        border: '2px solid #6B7280'
      }}
      border="2px solid #6B7280"
      anchorId={anchorId}
      events={['click']}
      content={selectedContent}
      delayHide={5000}
      noArrow
    />
  );
};

export default AdCreditsTooltip;