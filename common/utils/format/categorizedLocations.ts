import { ILocation } from "../../interfaces/locationDropdown";

interface CategoryTranslations {
  [key: string]: string;
}

export function categorizeLocations(
  locations: ILocation[],
  categoryTranslations: CategoryTranslations
): Record<string, ILocation[]> {
  return locations.reduce((categories: Record<string, ILocation[]>, location) => {
    const translatedCategory = categoryTranslations[location.category] || location.category;

    if (!categories[translatedCategory]) {
      categories[translatedCategory] = [];
    }

    categories[translatedCategory].push({
      name: Array.isArray(location.name) ? location.name : [location.name],
      category: location.category,
    });

    return categories;
  }, {});
}
