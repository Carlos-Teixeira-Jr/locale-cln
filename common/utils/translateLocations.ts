import { ILocation } from "../interfaces/locationDropdown";

export const categoryMappings: Record<string, string> = {
  Cidade: 'city',
  Estado: 'state',
  Rua: 'streetName',
  Bairro: 'neighborhood',
};

// Traduz o nome das categorias de endereço do inglês para o portugues para mostrar no dropdown;
export const categoryTranslations: Record<string, string> = {
  city: 'Cidade',
  state: 'Estado',
  streetName: 'Rua',
  neighborhood: 'Bairro',
};

export const translateLocations = (locations: ILocation[], allLocations: boolean, categoryMappings: Record<string, string>) => {
  const translatedLocations: ILocation[] = [];

  if (locations.length > 0 && !allLocations) {
    locations.forEach((loc) => {
      const { name, category } = loc;
      const formattedCategory = categoryMappings[category] || category;
      const existingLocation = translatedLocations.find(
        (item) => item.category === formattedCategory
      );
      if (existingLocation) {
        existingLocation.name.push(...name);
      } else {
        translatedLocations.push({ category: formattedCategory, name });
      }
    });
  }

  return JSON.stringify(translatedLocations);
};