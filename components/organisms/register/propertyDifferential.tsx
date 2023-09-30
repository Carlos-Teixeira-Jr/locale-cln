/* eslint-disable no-undef */
// import { truncate } from "fs";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { scroller } from 'react-scroll';
import CheckIcon from '../../atoms/icons/checkIcon';
import CloseIcon from '../../atoms/icons/closeIcon';
import YoutubeAddIcon from '../../atoms/icons/youtubeAddIcon';

type Props = {
  shouldRenderCondDiv: boolean;
  sharedImagesArray: any;
  setMinimunImagesUpload: any;
  id: string;
};

const PropertyDifferentials = ({
  shouldRenderCondDiv,
  sharedImagesArray,
  setMinimunImagesUpload,
  id,
}: Props) => {
  useEffect(() => {
    console.log('no ultimo comp', sharedImagesArray, sharedImagesArray);
  }, [sharedImagesArray]);

  const router = useRouter();
  const [firstInputValue, setFirstInputValue] = useState('');
  const [secondInputValue, setSecondInputValue] = useState('');

  type CheckedTagsType = {
    [key: string]: boolean;
  };

  const [checkedTags, setCheckedTags] = useState<CheckedTagsType>({
    acceptPet: false,
    airConditioner: false,
    closet: false,
    americanKitchen: false,
    fireplace: false,
    furnished: false,
    gourmetArea: false,
  });

  const [condominiumTags, setCondominiumTags] = useState<CheckedTagsType>({
    gym: false,
    grill: false,
    cinema: false,
    garden: false,
    pool: false,
    playground: false,
    squash: false,
    tennis: false,
    sportsCourt: false,
    partyRoom: false,
    gameRoom: false,
    specialNeedsAccesibility: false,
    bikeRack: false,
    coworking: false,
    elevator: false,
    laundry: false,
    sauna: false,
    spa: false,
    gatedCommunity: false,
    electronicGate: false,
    concierge24h: false,
  });

  const [tagText, setTagText] = useState<
    { checkboxName: string; text: string }[]
  >([]);
  const [condominiumTagText, setCondominiumTagText] = useState<
    { checkboxName: string; text: string }[]
  >([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [condominiumCustomTags, setCondominiumCustomTags] = useState<string[]>(
    []
  );

  const handleCheckboxChange = (checkboxName: string, checkBoxText: string) => {
    setCheckedTags({
      ...checkedTags,
      [checkboxName]: !checkedTags[checkboxName],
    });
    if (!checkedTags[checkboxName]) {
      setTagText([...tagText, { checkboxName, text: checkBoxText }]);
    } else {
      setTagText(
        tagText.filter((tag: any) => tag.checkboxName !== checkboxName)
      );
    }
  };

  const handleFirstInput = () => {
    setTagText((prevArray: Array<{ checkboxName: string; text: string }>) => [
      ...prevArray,
      { checkboxName: firstInputValue, text: firstInputValue },
    ]);
    setCustomTags((prevTags: string[]) => [...prevTags, firstInputValue]);
    setFirstInputValue('');
  };

  const handleCondominiumCheckboxChange = (
    checkboxName: string,
    checkBoxText: string
  ) => {
    setCondominiumTags({
      ...condominiumTags,
      [checkboxName]: !condominiumTags[checkboxName],
    });
    if (!condominiumTags[checkboxName]) {
      setCondominiumTagText([
        ...condominiumTagText,
        { checkboxName, text: checkBoxText },
      ]);
    } else {
      setCondominiumTagText(
        condominiumTagText.filter(
          (tag: any) => tag.checkboxName !== checkboxName
        )
      );
    }
  };

  const handleSecondInput = () => {
    setCondominiumTagText(
      (prevArray: Array<{ checkboxName: string; text: string }>) => [
        ...prevArray,
        { checkboxName: secondInputValue, text: secondInputValue },
      ]
    );
    setCondominiumCustomTags((prevTags: string[]) => [
      ...prevTags,
      secondInputValue,
    ]);
    setSecondInputValue('');
  };

  const handleRemoveTagFirstInput = (tag: any) => {
    setCheckedTags((prevState) => ({
      ...prevState,
      [tag.checkboxName]: !prevState[tag.checkboxName],
    }));

    setTagText((prevState) => {
      const tagIndex = prevState.findIndex(
        (t) => t.checkboxName === tag.checkboxName
      );
      if (tagIndex !== 1) {
        const newState = [...prevState];
        newState.splice(tagIndex, 1);
        return newState;
      }
      return prevState;
    });

    setCustomTags((prevState) =>
      prevState.filter((t) => t !== tag.checkboxName)
    );
  };

  const handleRemoveCondominiumTag = (tag: any) => {
    setCondominiumTags((prevState) => ({
      ...prevState,
      [tag.checkboxName]: !prevState[tag.checkboxName],
    }));

    setCondominiumTagText((prevState) => {
      const tagIndex = prevState.findIndex(
        (t) => t.checkboxName === tag.checkboxName
      );
      if (tagIndex !== 1) {
        const newState = [...prevState];
        newState.splice(tagIndex, 1);
        return newState;
      }
      return prevState;
    });

    setCondominiumCustomTags((prevState) =>
      prevState.filter((t) => t !== tag.checkboxName)
    );
  };

  const scrollToElement = (element: string) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -50,
    });
  };

  const handleContinueBtn = () => {
    const json = {
      checkedTags,
      condominiumTags,
      customTags,
      condominiumCustomTags,
    };

    if (sharedImagesArray.length < 3) {
      setMinimunImagesUpload(true);
      scrollToElement(id);
    } else {
      router.push('/register-step-3');
    }
  };

  return (
    <div className="lg:mx-[100px]">
      <h2 className="text-quaternary text-3xl font-semibold leading-9 my-10 mx-auto">
        Diferenciais do Imóvel
      </h2>
      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2">
        <div className="flex my-5">
          <div
            className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
            onClick={() => {
              handleCheckboxChange('acceptPet', 'Aceita pets');
            }}
          >
            {checkedTags.acceptPet && (
              <CheckIcon
                fill="#F5BF5D"
                className="pb-2 pr-2.5 drop-shadow-md"
              />
            )}
          </div>
          <p
            className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
            id="tag-pets"
          >
            Aceita pets
          </p>
        </div>
        <div className="flex my-5">
          <div
            className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
            onClick={() => {
              handleCheckboxChange('airConditioner', 'Ar-condicionado');
            }}
          >
            {checkedTags.airConditioner && (
              <CheckIcon
                fill="#F5BF5D"
                className="pb-2 pr-2.5 drop-shadow-md"
              />
            )}
          </div>
          <p
            className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
            id="tag-air-conditioner"
          >
            Ar-condicionado
          </p>
        </div>
        <div className="flex my-5">
          <div
            className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer my-auto"
            onClick={() => {
              handleCheckboxChange('closet', 'Closet');
            }}
          >
            {checkedTags.closet && (
              <CheckIcon
                fill="#F5BF5D"
                className="pb-2 pr-2.5 drop-shadow-md"
              />
            )}
          </div>
          <p
            className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
            id="tag-closet"
          >
            Closet
          </p>
        </div>
        <div className="flex my-5">
          <div
            className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
            onClick={() => {
              handleCheckboxChange('americanKitchen', 'Cozinha Americana');
            }}
          >
            {checkedTags.americanKitchen && (
              <CheckIcon
                fill="#F5BF5D"
                className="pb-2 pr-2.5 drop-shadow-md"
              />
            )}
          </div>
          <p
            className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
            id="tag-american-kitchen"
          >
            Cozinha Americana
          </p>
        </div>
        <div className="flex my-5">
          <div
            className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
            onClick={() => {
              handleCheckboxChange('fireplace', 'Lareira');
            }}
          >
            {checkedTags.fireplace && (
              <CheckIcon
                fill="#F5BF5D"
                className="pb-2 pr-2.5 drop-shadow-md"
              />
            )}
          </div>
          <p
            className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
            id="tag-fireplace"
          >
            Lareira
          </p>
        </div>
        <div className="flex my-5">
          <div
            className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
            onClick={() => {
              handleCheckboxChange('furnished', 'Mobiliado');
            }}
          >
            {checkedTags.furnished && (
              <CheckIcon
                fill="#F5BF5D"
                className="pb-2 pr-2.5 drop-shadow-md"
              />
            )}
          </div>
          <p
            className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
            id="tag-furnished"
          >
            Mobiliado
          </p>
        </div>
        <div className="flex my-5">
          <div
            className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
            onClick={() => {
              handleCheckboxChange('gourmetArea', 'Área Gourmet');
            }}
          >
            {checkedTags.gourmetArea && (
              <CheckIcon
                fill="#F5BF5D"
                className="pb-2 pr-2.5 drop-shadow-md"
              />
            )}
          </div>
          <p
            className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
            id="tag-gourmet-area"
          >
            Área Gourmet
          </p>
        </div>
      </div>
      <h2 className="text-2xl my-5 mt-10 font-bold leading-7 text-quaternary drop-shadow-sm">
        Outras características do imóvel
      </h2>
      <div className="flex flex-col md:block">
        <input
          className="my-5 h-[66px] md:w-[500px] w-full border border-quaternary drop-shadow-xl rounded-[10px] bg-tertiary px-5 text-xl font-bold text-quaternary"
          id="first-input"
          value={firstInputValue}
          onChange={(event: any) => setFirstInputValue(event.target.value)}
        />
        <button
          className="bg-secondary text-tertiary mx-5 px-10 py-5 rounded-full text-2xl font-bold leading-7 drop-shadow-md "
          onClick={handleFirstInput}
        >
          Adicionar
        </button>
      </div>
      <div className="flex">
        {tagText.map((tag) => (
          <span
            className="bg-tertiary text-quaternary rounded-full drop-shadow-lg grid grid-flow-col border border-quaternary ml-2"
            key={tag.text}
          >
            <p className="m-2">{tag.text}</p>
            <div
              className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-quaternary rounded-full cursor-pointer"
              onClick={() => handleRemoveTagFirstInput(tag)}
            >
              <CloseIcon fill="white" />
            </div>
          </span>
        ))}
      </div>

      {shouldRenderCondDiv && (
        <div>
          <h2 className="text-quaternary text-3xl font-semibold leading-9 my-10 mt-10">
            Características do condomínio
          </h2>
          <h3 className="text-2xl my-5 font-bold leading-7 text-quaternary drop-shadow-sm">
            Lazer:
          </h3>
          <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2">
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('gym', 'Academia');
                }}
              >
                {condominiumTags.gym && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-gym"
              >
                Academia
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('grill', 'Churrasqueira');
                }}
              >
                {condominiumTags.grill && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-grill"
              >
                Churrasqueira
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer"
                onClick={() => {
                  handleCondominiumCheckboxChange('cinema', 'Cinema');
                }}
              >
                {condominiumTags.cinema && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-cinema"
              >
                Cinema
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer"
                onClick={() => {
                  handleCondominiumCheckboxChange('garden', 'Jardim');
                }}
              >
                {condominiumTags.garden && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-garden"
              >
                Jardim
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer"
                onClick={() => {
                  handleCondominiumCheckboxChange('pool', 'Piscina');
                }}
              >
                {condominiumTags.pool && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-pool"
              >
                Piscina
              </p>
            </div>
            <div className="flex my-auto">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('playground', 'Playground');
                }}
              >
                {condominiumTags.playground && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-playground"
              >
                Playground
              </p>
            </div>
            <div className="flex my-auto">
              <div
                className="bg-tertiary my-auto border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('squash', 'Quadra de Squash');
                }}
              >
                {condominiumTags.squash && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-squash"
              >
                Quadra de Squash
              </p>
            </div>
            <div className="flex my-auto">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('tennis', 'Quadra de Tênis');
                }}
              >
                {condominiumTags.tennis && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-tennis"
              >
                Quadra de Tênis
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary my-auto border shrink-0 rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer"
                onClick={() => {
                  handleCondominiumCheckboxChange(
                    'sportsCourt',
                    'Quadra Poliesportiva'
                  );
                }}
              >
                {condominiumTags.sportsCourt && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-sports-court"
              >
                Quadra Poliesportiva
              </p>
            </div>
            <div className="flex my-auto">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange(
                    'partyRoom',
                    'Salão de Festas'
                  );
                }}
              >
                {condominiumTags.partyRoom && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-party-room"
              >
                Salão de Festas
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('gameRoom', 'Salão de Jogos');
                }}
              >
                {condominiumTags.gameRoom && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-game-room"
              >
                Salão de Jogos
              </p>
            </div>
          </div>

          <h3 className="text-quaternary text-3xl font-semibold leading-9 my-10">
            Acessibilidade e Serviços:
          </h3>
          <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2">
            <div className="flex my-auto">
              <div
                className="bg-tertiary my-auto border shrink-0 rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer"
                onClick={() => {
                  handleCondominiumCheckboxChange(
                    'specialNeedsAccesibility',
                    'Acesso para Pessoas com Deficiência'
                  );
                }}
              >
                {condominiumTags.specialNeedsAccesibility && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-special-needs-accesibility"
              >
                Acesso para Pessoas com Deficiência
              </p>
            </div>
            <div className="flex my-auto">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('bikeRack', 'Bicicletário');
                }}
              >
                {condominiumTags.bikeRack && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-bike-rack"
              >
                Bicicletário
              </p>
            </div>
            <div className="flex my-auto">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('coworking', 'Coworking');
                }}
              >
                {condominiumTags.coworking && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-coworking"
              >
                Coworking
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('elevator', 'Elevador');
                }}
              >
                {condominiumTags.elevator && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-elevator"
              >
                Elevador
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange('laundry', 'Lavanderia');
                }}
              >
                {condominiumTags.laundry && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-laundry"
              >
                Lavanderia
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer"
                onClick={() => {
                  handleCondominiumCheckboxChange('sauna', 'Sauna');
                }}
              >
                {condominiumTags.sauna && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-sauna"
              >
                Sauna
              </p>
            </div>
            <div className="flex my-5">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer"
                onClick={() => {
                  handleCondominiumCheckboxChange('spa', 'Spa');
                }}
              >
                {condominiumTags.spa && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p
                className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                id="tag-sauna"
              >
                Spa
              </p>
            </div>
          </div>
          <h3 className="text-quaternary text-3xl font-semibold leading-9 my-10">
            Segurança:
          </h3>
          <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2">
            <div className="flex my-5">
              <div
                className="bg-tertiary my-auto border shrink-0 rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer"
                onClick={() => {
                  handleCondominiumCheckboxChange(
                    'gatedCommunity',
                    'Condomínio Fechado'
                  );
                }}
              >
                {condominiumTags.gatedCommunity && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto">
                Condomínio Fechado
              </p>
            </div>
            <div className="flex my-auto">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange(
                    'electronicGate',
                    'Portão Eletrônico'
                  );
                }}
              >
                {condominiumTags.electronicGate && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto">
                Portão Eletrônico
              </p>
            </div>
            <div className="flex my-auto">
              <div
                className="bg-tertiary border rounded-[10px] border-quaternary w-[40px] h-[40px] drop-shadow-xl cursor-pointer shrink-0"
                onClick={() => {
                  handleCondominiumCheckboxChange(
                    'concierge24h',
                    'Portaria 24h'
                  );
                }}
              >
                {condominiumTags.concierge24h && (
                  <CheckIcon
                    fill="#F5BF5D"
                    className="pb-2 pr-2.5 drop-shadow-md"
                  />
                )}
              </div>
              <p className="md:text-2xl text-xl font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto">
                Portaria 24h
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-quaternary text-3xl font-semibold leading-9 my-10">
              Outras Características do Condomínio
            </h3>
            <div className="flex flex-col md:block">
              <input
                className="my-5 h-[66px] md:w-[500px] w-full border border-quaternary drop-shadow-xl rounded-[10px] px-5 text-xl font-bold text-quaternary"
                id="second-input"
                value={secondInputValue}
                onChange={(event: any) =>
                  setSecondInputValue(event.target.value)
                }
              />
              <button
                className="bg-secondary text-tertiary mx-5 px-10 py-5 rounded-full text-2xl font-bold leading-7"
                onClick={handleSecondInput}
              >
                Adicionar
              </button>
            </div>
          </div>
          <div className="flex">
            {condominiumTagText.map((tag) => (
              <span
                className="bg-tertiary text-quaternary rounded-full drop-shadow-lg grid grid-flow-col border border-quaternary ml-2"
                key={tag.text}
              >
                <p className="m-2">{tag.text}</p>
                <div
                  className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-quaternary rounded-full cursor-pointer"
                  onClick={() => handleRemoveCondominiumTag(tag)}
                >
                  <CloseIcon fill="white" />
                </div>
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mb-10">
        <div className="flex mt-10">
          <h3 className="md:text-2xl text-xl text-quaternary font-bold leading-7 mt-auto md:mb-0 mb-3.5">
            Adicione o Link de um Vídeo
          </h3>
          <div className="my-auto">
            <YoutubeAddIcon fill="#6B7280" />
          </div>
        </div>
        <input className="my-5 h-[66px] md:w-[500px] w-full border border-quaternary drop-shadow-xl rounded-[10px] px-5 text-xl font-bold text-quaternary" />
      </div>
      <div className="py-10 flex md:block justify-center">
        <button
          className="text-tertiary bg-primary rounded-[10px] md:w-[470px] h-[87px] px-5 md:px-0 text-4xl font-extrabold md:float-right"
          onClick={handleContinueBtn}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PropertyDifferentials;
