import { RefObject, SetStateAction } from "react";

export const handleClickOutside = (ref: RefObject<HTMLDivElement>, setOpen: (value: SetStateAction<boolean>) => void) => {
  return function handleClick(event: MouseEvent) {
    if (ref && ref.current) {
      const myRef = ref.current;
      if (!myRef.contains(event.target as Node)) {
        setOpen(false);
      }
    }
  };
};
