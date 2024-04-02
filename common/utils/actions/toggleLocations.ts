import { ILocation } from "../../interfaces/locationDropdown";

export function toggleLocation(
  name: string,
  category: string,
  locations: ILocation[],
  setLocation: React.Dispatch<React.SetStateAction<ILocation[]>>
): void {
  const existingCategoryIndex = locations.findIndex(
    (item) => item.category === category
  );

  if (existingCategoryIndex !== -1) {
    const updatedLocations = locations.map((item) => {
      if (item.category === category) {
        if (item.name.includes(name)) {
          const updatedName = item.name.filter((itemName: any) => itemName !== name);
          return updatedName.length === 0 ? null : { ...item, name: updatedName };
        } else {
          return { ...item, name: [...item.name, name] };
        }
      }
      return item;
    }).filter(Boolean) as ILocation[];

    setLocation(updatedLocations);
  } else {
    setLocation([...locations, { name: [name], category }]);
  }
}
