import { useState } from 'react';
import Modal, { Styles } from 'react-modal';
import { useIsMobile } from '../../../hooks/useIsMobile';



interface IAreaData {
  open: boolean;
  handleClose: () => void;
  handleSize: (value: number) => void;
}

interface IChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function AreaCalculatorModal({
  open,
  handleClose,
  handleSize,
}: IAreaData) {

  Modal.setAppElement('#__next');
  
  const [area, setArea] = useState(0);
  const [areaWidth, setAreaWidth] = useState(0);
  const [areaLength, setAreaLength] = useState(0);
  const isMobile = useIsMobile();

  const style: Styles | undefined = {
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: isMobile ? '90%' : '40%',
      backgroundColor: 'background.paper',
      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      borderRadius: '30px',
      padding: '10px',
    },
  };

  const handleWidhtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(event.target.value);
    setAreaWidth(width);
    const area = width * areaLength;
    setArea(!Number.isNaN(area) ? area : 0);
    handleSize(area);
  };

  const handleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const length = parseInt(event.target.value);
    setAreaLength(length);
    const area = length * areaWidth;
    setArea(!Number.isNaN(area) ? area : 0);
    handleSize(area);
  };
  return (
    <div>
      <Modal
        isOpen={open}
        onRequestClose={handleClose}
        style={style}
        contentLabel="Calculadora de área"
      >
        <h2 className="text-xl text-quaternary font-bold text-center mt-1">
          Calculadora de área
        </h2>
        <div className="mt-2 flex flex-col md:flex-row gap-2 justify-center">
          <input
            onChange={handleWidhtChange}
            type="number"
            placeholder="Largura:"
            maxLength={10}
            className="border border-quaternary rounded-lg md:w-full h-10 text-quaternary md:text-md text-base font-semibold px-5 drop-shadow-lg bg-tertiary mt-5"
          />
          <input
            onChange={handleLengthChange}
            type="number"
            placeholder="Comprimento:"
            maxLength={10}
            className="border border-quaternary rounded-lg md:w-full h-10 text-quaternary md:text-md text-base font-semibold px-5 drop-shadow-lg bg-tertiary mt-5"
          />
        </div>
        <p className="m-2 text-center text-quaternary">
          A área total é: <b className="text-quaternary">{area}m²</b>
        </p>
      </Modal>
    </div>
  );
}
