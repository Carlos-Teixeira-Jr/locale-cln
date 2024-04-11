import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { IPlan } from '../../../common/interfaces/plans/plans';

export interface IAdCreditsTooltip {
  anchorId: string | undefined;
  planName: string;
  creditsLeft: number;
  plans: IPlan[]
}

const AdCreditsTooltip: React.FC<IAdCreditsTooltip> = ({
  anchorId,
  planName,
  creditsLeft,
  plans
}) => {
  console.log("🚀 ~ anchorId tooltip:", anchorId)
  // console.log("🚀 ~ plans:", plans)

  const [selectedContent, setSelectedContent] = useState('')

  const plansInfo = {
    free: `Este é seu plano atual e você pode fazer apenas um anúncio comum. Créditos restantes: ${creditsLeft}.`,
    basic: creditsLeft > 0 ?
      `Este é seu plano atual e ainda há ${creditsLeft} anúncios destaque disponíveis` :
      `Este é seu plano atual e não há mais destaques disponíveis. Mas você ainda pode fazer quantos anúncios comuns desejar trocando seu plano para o grátis`,
    plus: creditsLeft > 0 ?
      `Este é seu plano atual e ainda há ${creditsLeft} anúncios destaque disponíveis` :
      `Este é seu plano atual e não há mais destaques disponíveis. Mas você ainda pode fazer quantos anúncios comuns desejar trocando seu plano para o grátis`,
  }

  const changePlansInfo = {
    free: 'bocê quer mudar para o free',
    basic: 'bocê quer mudar para o teste basic',
    plus: 'bocê quer mudar para o plus'
  }

  // const selectedContent = () => {
  //   let content;
  //   if (planName === 'Free') {
  //     content = plansInfo.free;
  //   } else if (planName === 'Básico') {
  //     content = plansInfo.basic;
  //   } else {
  //     content = plansInfo.plus
  //   }

  //   return content;
  // };

  useEffect(() => {
    const selectedContent = () => {
      let content;
      const hoveredCard = plans?.find((plan) => plan._id === anchorId);
      if (hoveredCard?.name === 'Free') {
        content = changePlansInfo.free;
      } else if (hoveredCard?.name === 'Básico') {
        content = changePlansInfo.basic;
      } else if (hoveredCard?.name === 'Locale Plus') {
        content = changePlansInfo.plus
      }

      return content;
    };
    const selectedCont = selectedContent();
    setSelectedContent(selectedCont!)
  }, [anchorId])

  return (
    <Tooltip
      style={{
        backgroundColor: '#F7F7F6',
        color: '#6B7280',
        border: '2px solid #6B7280',
        width: '100%'
      }}
      border="2px solid #6B7280"
      anchorSelect={`.card-${anchorId}`}
      openEvents={{ mouseenter: true }}
      closeEvents={{ click: true, mouseleave: true }}
      globalCloseEvents={{ scroll: true, clickOutsideAnchor: true }}
      content={selectedContent}
      delayHide={4000}
      noArrow
      place='bottom'
    />
  );
};

export default AdCreditsTooltip;