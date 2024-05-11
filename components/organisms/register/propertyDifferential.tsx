import { useEffect, useState } from 'react';
import store from 'store';
import { IData } from '../../../common/interfaces/property/propertyData';
import {
  accessibilityTags,
  condominiumTagsDefault,
  propertyTags,
  securityTags,
} from '../../../data/tags';
import CheckIcon from '../../atoms/icons/checkIcon';
import CloseIcon from '../../atoms/icons/closeIcon';
import YoutubeAddIcon from '../../atoms/icons/youtubeAddIcon';

type Props = {
  shouldRenderCondDiv?: boolean;
  property?: IData;
  isEdit?: boolean;
  onTagsUpdate?: (updatedTags: string[]) => void;
  onCondominiumTagsUpdate?: (updatedCondTags: string[]) => void;
  onVideoLinkUpdate?: (updatedVideo: string) => void;
};

const PropertyDifferentials = ({
  shouldRenderCondDiv,
  property,
  isEdit,
  onTagsUpdate,
  onCondominiumTagsUpdate,
  onVideoLinkUpdate,
}: Props) => {
  console.log("🚀 ~ property:", property)
  const [firstInputValue, setFirstInputValue] = useState('');
  const [secondInputValue, setSecondInputValue] = useState('');
  const storedData = store.get('propertyData');
  const [updatedYouTubeLink, setUpdatedYouTubeLink] = useState<string>(property?.youtubeLink ? property.youtubeLink : '');
  console.log("🚀 ~ updatedYouTubeLink:", updatedYouTubeLink)

  const [updatedTags, setUpdatedTags] = useState<string[]>(() => {
    if (property && property.tags.length > 0) {
      return property.tags;
    } else if (storedData && storedData?.tags?.length > 0) {
      return storedData.tags
    } else {
      return [];
    }
  });

  const [updatedCondominiumTags, setUpdatedCondominiumTags] = useState<string[]>(() => {
    if (property && property.condominiumTags) {
      return property.condominiumTags;
    } else if (storedData && storedData?.condominiumTags?.length > 0) {
      return storedData.condominiumTags
    } else {
      return [];
    }
  });

  const handleAddWithEnter = (event: React.KeyboardEvent<HTMLInputElement>, type: string) => {
    if (event.key === 'Enter') {
      if (type === 'condominiumTags') {
        const newTag = firstInputValue.trim(); // Remove espaços em branco extras
        if (newTag !== '') {
          const newTagsArray = [...updatedTags, newTag];
          setUpdatedTags(newTagsArray);
          setFirstInputValue('');
        }
      } else if (type === 'tags') {
        const newTag = secondInputValue.trim();
        if (newTag !== '') {
          const newTagsArray = [...updatedTags, newTag];
          setUpdatedTags(newTagsArray);
          setSecondInputValue('');
        }
      }
    }
  };

  useEffect(() => {
    if (property) {
      setUpdatedYouTubeLink(property.youtubeLink);
    }
  });

  useEffect(() => {
    onTagsUpdate!(updatedTags);
  }, [updatedTags]);

  useEffect(() => {
    onCondominiumTagsUpdate!(updatedCondominiumTags);
  }, [updatedCondominiumTags]);

  useEffect(() => {
    // Verifica se onVideoLinkUpdate não é undefined antes de chamar
    onVideoLinkUpdate?.(updatedYouTubeLink);
  }, [updatedYouTubeLink, onVideoLinkUpdate]);

  const classes = {
    tagLabel:
      'text-sm font-normal leading-7 drop-shadow-md text-quaternary mx-2 my-auto',
    addButton:
      'bg-secondary text-tertiary mx-5 px-7 py-2 rounded-full text-lg font-bold leading-7 drop-shadow-md transition-colors duration-300 hover:bg-yellow-500',
    mediumInput:
      'h-12 md:w-[500px] w-full border border-quaternary drop-shadow-xl rounded-[10px] px-5 text-sm font-bold text-quaternary',
    checkIcon: 'pb-3 drop-shadow-md',
    checkContainer:
      'flex bg-tertiary border rounded-[10px] border-quaternary w-[30px] h-[30px] drop-shadow-xl cursor-pointer shrink-0 my-auto',
    h2Title:
      'text-quaternary md:text-xl text-lg font-semibold leading-9 mt-4 mx-3',
    handleTag:
      'w-5 h-5 flex items-center justify-center my-auto mx-1 mr-2 bg-quaternary rounded-full cursor-pointer',
    h3Title:
      'text-lg my-5 font-bold leading-7 text-quaternary drop-shadow-sm ml-3',
    tagSpan:
      'bg-tertiary text-quaternary text-sm font-semibold rounded-full drop-shadow-lg grid grid-flow-col border border-quaternary mb-2 ml-3',
    checkBox: 'flex my-5 w-[150px] max-w-[30%] ml-3',
  };

  return (
    <div>
      <h2 className="text-quaternary md:text-xl text-lg font-semibold leading-9 mt-4 mb-2 mx-3">
        Diferenciais do Imóvel:
      </h2>

      <div className="flex flex-wrap sm:justify-between md:justify-start gap-x-4 sm:gap-x-5 mx-3">
        {propertyTags.map((tag, i) => (
          <div className="flex my-2 w-32 sm:w-40" key={i}>
            <div
              className={classes.checkContainer}
              onClick={() => {
                if (updatedTags.includes(tag)) {
                  const newTagsArray = updatedTags.filter(
                    (existingTag) => existingTag !== tag
                  );
                  setUpdatedTags(newTagsArray);
                } else {
                  const newTagsArray = [...updatedTags, tag];
                  setUpdatedTags(newTagsArray);
                }
              }}
            >
              {updatedTags.some((item) => item === tag) && (
                <CheckIcon
                  fill="#F5BF5D"
                  className={classes.checkIcon}
                  width="40"
                  height="40"
                  viewBox="0 96 960 960"
                />
              )}
            </div>
            <p className={classes.tagLabel} id="tag-pets">
              {tag}
            </p>
          </div>
        ))}
      </div>

      <h2 className={classes.h2Title}>Outras características do imóvel:</h2>
      <div className="flex flex-col md:block mx-3">
        <input
          className="my-2 h-12 md:w-[500px] w-full border border-quaternary drop-shadow-xl rounded-[10px] bg-tertiary px-5 text-sm font-normal text-quaternary"
          id="first-input"
          value={firstInputValue}
          maxLength={40}
          onChange={(event) => setFirstInputValue(event.target.value)}
          onKeyUp={(event) => handleAddWithEnter(event, 'condominiumTags')}
        />
        <button
          className={classes.addButton}
          onClick={() => {
            const newTag = firstInputValue;
            if (firstInputValue !== '') {
              const newTagsArray = [...updatedTags, newTag];
              setUpdatedTags(newTagsArray);
              setFirstInputValue('');
            }
          }}
        >
          Adicionar
        </button>
      </div>
      <div className="flex flex-wrap mt-4">
        {updatedTags.map((tag) => (
          <span className={classes.tagSpan} key={tag}>
            <p className="m-1 mb-2">{tag}</p>
            <div
              className={classes.handleTag}
              onClick={() => {
                const newTags = updatedTags.filter((str) => str !== tag);
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
          <h2 className={classes.h2Title}>Características do condomínio</h2>

          <h3 className={classes.h3Title}>Lazer:</h3>

          <div className="flex flex-wrap">
            {condominiumTagsDefault.map((tag, i) => (
              <div className={classes.checkBox} key={i}>
                <div
                  className={classes.checkContainer}
                  onClick={() => {
                    if (updatedCondominiumTags.includes(tag)) {
                      const newTagsArray = updatedCondominiumTags.filter(
                        (existingTag) => existingTag !== tag
                      );
                      setUpdatedCondominiumTags(newTagsArray);
                    } else {
                      const newTagsArray = [...updatedCondominiumTags, tag];
                      setUpdatedCondominiumTags(newTagsArray);
                    }
                  }}
                >
                  {updatedCondominiumTags.some((item) => item === tag) && (
                    <CheckIcon
                      fill="#F5BF5D"
                      className={classes.checkIcon}
                      width="40"
                      height="40"
                      viewBox="0 96 960 960"
                    />
                  )}
                </div>
                <p className={classes.tagLabel} id="tag-pets">
                  {tag}
                </p>
              </div>
            ))}
          </div>

          <h3 className={classes.h3Title}>Acessibilidade e Serviços:</h3>

          <div className="flex flex-wrap">
            {accessibilityTags.map((tag, i) => (
              <div className={classes.checkBox} key={i}>
                <div
                  className={classes.checkContainer}
                  onClick={() => {
                    if (updatedCondominiumTags.includes(tag)) {
                      const newTagsArray = updatedCondominiumTags.filter(
                        (existingTag) => existingTag !== tag
                      );
                      setUpdatedCondominiumTags(newTagsArray);
                    } else {
                      const newTagsArray = [...updatedCondominiumTags, tag];
                      setUpdatedCondominiumTags(newTagsArray);
                    }
                  }}
                >
                  {updatedCondominiumTags.some((item) => item === tag) && (
                    <CheckIcon
                      fill="#F5BF5D"
                      className={classes.checkIcon}
                      width="40"
                      height="40"
                      viewBox="0 96 960 960"
                    />
                  )}
                </div>
                <p className={classes.tagLabel} id="tag-pets">
                  {tag}
                </p>
              </div>
            ))}
          </div>

          <h3 className={classes.h3Title}>Segurança:</h3>

          <div className="flex flex-wrap">
            {securityTags.map((tag, i) => (
              <div className={classes.checkBox} key={i}>
                <div
                  className={classes.checkContainer}
                  onClick={() => {
                    if (updatedCondominiumTags.includes(tag)) {
                      const newTagsArray = updatedCondominiumTags.filter(
                        (existingTag) => existingTag !== tag
                      );
                      setUpdatedCondominiumTags(newTagsArray);
                    } else {
                      const newTagsArray = [...updatedCondominiumTags, tag];
                      setUpdatedCondominiumTags(newTagsArray);
                    }
                  }}
                >
                  {updatedCondominiumTags.some((item) => item === tag) && (
                    <CheckIcon
                      fill="#F5BF5D"
                      className={classes.checkIcon}
                      width="40"
                      height="40"
                      viewBox="0 96 960 960"
                    />
                  )}
                </div>
                <p className={classes.tagLabel} id="tag-pets">
                  {tag}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-quaternary text-lg font-semibold leading-9 ml-3 my-2">
              Outras Características do Condomínio
            </h2>
            <div className="flex flex-col md:block mx-3">
              <input
                className={classes.mediumInput}
                id="second-input"
                value={secondInputValue}
                maxLength={20}
                onChange={(event) => setSecondInputValue(event.target.value)}
                onKeyUp={(event) => handleAddWithEnter(event, 'tags')}
              />
              <button
                className={classes.addButton}
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
          <div className="flex flex-wrap my-5 gap-2">
            {updatedCondominiumTags.map((tag) => (
              <span className={classes.tagSpan} key={tag}>
                <p className={classes.tagLabel}>{tag}</p>
                <div
                  className={classes.handleTag}
                  onClick={() => {
                    const newTags = updatedCondominiumTags.filter(
                      (str) => str !== tag
                    );
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

      <div className="mx-3">
        <div className="flex flex-row items-center -ml-2 mb-2 mt-10 sm:mt-5">
          <h2 className={classes.h2Title}>Adicione o Link de um Vídeo</h2>
          <div className="mt-1">
            <YoutubeAddIcon fill="#6B7280" />
          </div>
        </div>
        <input
          value={updatedYouTubeLink}
          className={classes.mediumInput}
          onChange={(e) => setUpdatedYouTubeLink(e.target.value)}
          maxLength={150}
        />
      </div>
    </div>
  );
};

export default PropertyDifferentials;
