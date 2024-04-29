import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ICantDecrementCreditsTooltip {
  tooltipData: {
    type: string,
    state: boolean,
    anchorId: string
  }
}

const CantDecrementCreditsTooltip = ({
  tooltipData
}: ICantDecrementCreditsTooltip) => {

  const [content, setContent] = useState('Teste de tiooltip');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (tooltipData.state) {
      setContent(`Você não pode diminuir os créditos de ${tooltipData.type === 'adCredits' ? 'anúncio' : 'destaque'} já disponíveis em sua conta, apenas adicionar novos créditos.`)
    }
  }, [tooltipData])

  return (
    <span>
      <Tooltip
        style={{
          backgroundColor: '#fa8072',
          color: '#F7F7F6',
          border: '2px solid #6B7280',
          width: isMobile ? '50%' : '30%',
          fontSize: '12px',
          lineHeight: 1.2,
          zIndex: 999999
        }}
        border="2px solid red"
        anchorSelect={`.tooltip-${tooltipData?.anchorId}`}
        openOnClick
        closeEvents={{ click: true, mouseleave: true }}
        globalCloseEvents={{ scroll: true, clickOutsideAnchor: true }}
        content={content}
        delayHide={4000}
        noArrow
        variant='warning'
        place='bottom'
      />
    </span>
  )
}

export default CantDecrementCreditsTooltip