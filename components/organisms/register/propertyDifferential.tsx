import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CheckIcon from '../../atoms/icons/checkIcon';
import CloseIcon from '../../atoms/icons/closeIcon';
import YoutubeAddIcon from '../../atoms/icons/youtubeAddIcon';
import { accessibilityTags, condominiumTagsDefault, propertyTags, securityTags } from '../../../data/tags';
import { IData } from '../../../common/interfaces/property/propertyData';

type Props = {
  shouldRenderCondDiv: boolean
  property?: IData
  isEdit: boolean
  onTagsUpdate: (updatedTags: string[]) => void
  onCondominiumTagsUpdate: (updatedCondTags: string[]) => void
  onVideoLinkUpdate: (updatedVideo: string) => void
};

const PropertyDifferentials = ({
  shouldRenderCondDiv,
  property,
  isEdit,
  onTagsUpdate,
  onCondominiumTagsUpdate,
  onVideoLinkUpdate
}: Props) => {

  const [firstInputValue, setFirstInputValue] = useState('');
  const [secondInputValue, setSecondInputValue] = useState('');
  const [updatedTags, setUpdatedTags] = useState<string[]>(property ? property.tags : []);
  const [updatedCondominiumTags, setUpdatedCondominiumTags] = useState<string[]>(property ? property.condominiumTags: []);
  const [updatedYouTubeLink, setUpdatedYouTubeLink] = useState<string>('');

  useEffect(() => {
    if (property) {
      setUpdatedYouTubeLink(property.youtubeLink)
    }
  });

  useEffect(() => {
    onTagsUpdate(updatedTags)
  }, [updatedTags]);

  useEffect(() => {
    onCondominiumTagsUpdate(updatedCondominiumTags)
  }, [updatedCondominiumTags]);

  useEffect(() => {
    onVideoLinkUpdate(updatedYouTubeLink)
  }, [updatedYouTubeLink]);

  return (
    <div>
      <h2 className="text-quaternary md:text-3xl text-2xl font-semibold leading-9 my-5 mx-3">
        Diferenciais do Imóvel
      </h2>

      <div className="flex flex-wrap sm:justify-between md:justify-start gap-x-9 sm:gap-x-10 mx-3">
        {propertyTags.map((tag, i) => (
          <div className="flex my-5 w-32 sm:w-40" key={i}>
            <div
              className="flex bg-tertiary border rounded-[10px] border-quaternary w-[30px] h-[30px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
              onClick={() => {
                if (updatedTags.includes(tag)) {
                  const newTagsArray = updatedTags.filter(existingTag => existingTag !== tag);
                  setUpdatedTags(newTagsArray);
                } else {
                  const newTagsArray = [...updatedTags, tag];
                  setUpdatedTags(newTagsArray);
                }
              }}
            >
              {updatedTags.some(item => item === tag) && (
                <CheckIcon
                  fill="#F5BF5D"
                  className="pb-3 drop-shadow-md"
                  width='40'
                  height='40'
                  viewBox='0 96 960 960'
                />
              )}
            </div>
            <p
              className="text-lg font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
              id="tag-pets"
            >
              {tag}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl mx-3 my-5 mt-5 font-bold leading-7 text-quaternary drop-shadow-sm">
        Outras características do imóvel
      </h2>
      <div className="flex flex-col md:block mx-3">
        <input
          className="my-5 h-12 md:w-[500px] w-full border border-quaternary drop-shadow-xl rounded-[10px] bg-tertiary px-5 text-xl font-bold text-quaternary"
          id="first-input"
          value={firstInputValue}
          onChange={(event) => setFirstInputValue(event.target.value)}
        />
        <button
          className="bg-secondary text-tertiary mx-5 px-10 py-3 rounded-full text-xl font-bold leading-7 drop-shadow-md transition-colors duration-300 hover:bg-yellow-500 "
          onClick={() => {
            const newTag = firstInputValue;
            if (firstInputValue !== '') {
              const newTagsArray = [...updatedTags, newTag];
            setUpdatedTags(newTagsArray);
            }
          }}
        >
          Adicionar
        </button>
      </div>
      <div className="flex flex-wrap">
        {updatedTags.map((tag) => (
          <span
            className="bg-tertiary text-quaternary text-base font-semibold rounded-full drop-shadow-lg grid grid-flow-col border border-quaternary ml-2 mb-2"
            key={tag}
          >
            <p className="m-1">{tag}</p>
            <div
              className="w-5 h-5 flex items-center justify-center my-auto mr-2 bg-quaternary rounded-full cursor-pointer"
              onClick={() => {
                const newTags = updatedTags.filter(str => str !== tag);
                setUpdatedTags(newTags);
              }}
            >
              <CloseIcon fill="white" />
            </div>
          </span>
        ))}
      </div>

      {shouldRenderCondDiv && (
        <div>
          <h2 className="text-quaternary text-3xl font-semibold leading-9 my-5 mt-10">
            Características do condomínio
          </h2>

          <h3 className="text-2xl my-5 font-bold leading-7 text-quaternary drop-shadow-sm">
            Lazer:
          </h3>

          <div className="flex flex-wrap">
            {condominiumTagsDefault.map((tag, i) => (
              <div className="flex my-5 w-[150px] max-w-[30%]" key={i}>
                <div
                  className="flex bg-tertiary border rounded-[10px] border-quaternary w-[30px] h-[30px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
                  onClick={() => {
                    if (updatedCondominiumTags.includes(tag)) {
                      const newTagsArray = updatedCondominiumTags.filter(existingTag => existingTag !== tag);
                      setUpdatedCondominiumTags(newTagsArray);
                    } else {
                      const newTagsArray = [...updatedCondominiumTags, tag];
                      setUpdatedCondominiumTags(newTagsArray);
                    }
                  }}
                >
                  {updatedCondominiumTags.some(item => item === tag) && (
                    <CheckIcon
                      fill="#F5BF5D"
                      className="pb-3 drop-shadow-md"
                      width='40'
                      height='40'
                      viewBox='0 96 960 960'
                    />
                  )}
                </div>
                <p
                  className="text-lg font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                  id="tag-pets"
                >
                  {tag}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-quaternary text-3xl font-semibold leading-9 my-5">
            Acessibilidade e Serviços:
          </h3>

          <div className="flex flex-wrap">
            {accessibilityTags.map((tag, i) => (
              <div className="flex my-5 w-[150px] max-w-[30%]" key={i}>
                <div
                  className="flex bg-tertiary border rounded-[10px] border-quaternary w-[30px] h-[30px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
                  onClick={() => {
                    if (updatedCondominiumTags.includes(tag)) {
                      const newTagsArray = updatedCondominiumTags.filter(existingTag => existingTag !== tag);
                      setUpdatedCondominiumTags(newTagsArray);
                    } else {
                      const newTagsArray = [...updatedCondominiumTags, tag];
                      setUpdatedCondominiumTags(newTagsArray);
                    }
                  }}
                >
                  {updatedCondominiumTags.some(item => item === tag) && (
                    <CheckIcon
                      fill="#F5BF5D"
                      className="pb-3 drop-shadow-md"
                      width='40'
                      height='40'
                      viewBox='0 96 960 960'
                    />
                  )}
                </div>
                <p
                  className="text-lg font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                  id="tag-pets"
                >
                  {tag}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-quaternary text-3xl font-semibold leading-9 my-5">
            Segurança:
          </h3>

          <div className="flex flex-wrap">
            {securityTags.map((tag, i) => (
              <div className="flex my-5 w-[150px] max-w-[30%]" key={i}>
                <div
                  className="flex bg-tertiary border rounded-[10px] border-quaternary w-[30px] h-[30px] drop-shadow-xl cursor-pointer shrink-0 my-auto"
                  onClick={() => {
                    if (updatedCondominiumTags.includes(tag)) {
                      const newTagsArray = updatedCondominiumTags.filter(existingTag => existingTag !== tag);
                      setUpdatedCondominiumTags(newTagsArray);
                    } else {
                      const newTagsArray = [...updatedCondominiumTags, tag];
                      setUpdatedCondominiumTags(newTagsArray);
                    }
                  }}
                >
                  {updatedCondominiumTags.some(item => item === tag) && (
                    <CheckIcon
                      fill="#F5BF5D"
                      className="pb-3 drop-shadow-md"
                      width='40'
                      height='40'
                      viewBox='0 96 960 960'
                    />
                  )}
                </div>
                <p
                  className="text-lg font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto"
                  id="tag-pets"
                >
                  {tag}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-quaternary text-3xl font-semibold leading-9 my-5">
              Outras Características do Condomínio
            </h3>
            <div className="flex flex-col md:block  mx-3">
              <input
                className="h-12 md:w-[500px] w-full border border-quaternary drop-shadow-xl rounded-[10px] px-5 text-xl font-bold text-quaternary"
                id="second-input"
                value={secondInputValue}
                onChange={(event) => setSecondInputValue(event.target.value)}
              />
              <button
                className="bg-secondary text-tertiary mx-5 h-12 px-10  rounded-full text-xl font-bold leading-7 transition-colors duration-300 hover:bg-yellow-500"
                onClick={() => {
                  const newTag = secondInputValue;
                  if (secondInputValue !== '') {
                    const newTagsArray = [...updatedCondominiumTags, newTag];
                  setUpdatedCondominiumTags(newTagsArray);
                  }
                }}
              >
                Adicionar
              </button>
            </div>
          </div>
          <div className="flex">
            {updatedCondominiumTags.map((tag) => (
              <span
                className="bg-tertiary text-quaternary text-base font-semibold rounded-full drop-shadow-lg grid grid-flow-col border border-quaternary ml-2"
                key={tag}
              >
                <p className="m-1">{tag}</p>
                <div
                  className="w-5 h-5 flex items-center justify-center my-auto mr-2 bg-quaternary rounded-full cursor-pointer"
                  onClick={() => {
                    const newTags = updatedCondominiumTags.filter(str => str !== tag);
                    setUpdatedCondominiumTags(newTags);
                  }}
                >
                  <CloseIcon fill="white" />
                </div>
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className='mx-3'>
        <div className="flex mt-10 sm:mt-5">
          <h3 className="md:text-2xl text-xl text-quaternary font-bold leading-7 mt-1 md:mb-0 mb-3.5">
            Adicione o Link de um Vídeo
          </h3>
          <div className="my-auto">
            <YoutubeAddIcon fill="#6B7280" />
          </div>
        </div>
        <input className="h-12 md:w-[500px] w-full border border-quaternary drop-shadow-xl rounded-[10px] px-5 text-xl font-bold text-quaternary" onChange={(e) => setUpdatedYouTubeLink(e.target.value)}/>
      </div>
    </div>
  );
};

export default PropertyDifferentials;
