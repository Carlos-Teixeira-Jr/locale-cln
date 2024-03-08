import { PropertyFeaturesErrors } from "../../interfaces/property/propertyFeaturesErrors";
import { IUserDataComponentErrors } from "../../interfaces/user/user";

type ErrorKey = 'username' | 'email' | 'cpf' | 'cellPhone' | 'description' | 'totalArea' | 'propertyValue' | 'condominiumValue' | 'iptuValue';

export const scrollToError = (
  errorKey: ErrorKey,
  dataErrors: IUserDataComponentErrors | PropertyFeaturesErrors,
  dataInputRefs: any,
  dataErrorScroll: any,
) => {
  const classList = dataInputRefs[errorKey]?.current?.classList;

  if (classList && dataErrors[errorKey] !== '') {
    const element = dataErrorScroll[errorKey]?.current;
    if (element) {
      element.scrollIntoView({
        behavior: 'auto',
        block: 'center',
      });
    }
  }
};
