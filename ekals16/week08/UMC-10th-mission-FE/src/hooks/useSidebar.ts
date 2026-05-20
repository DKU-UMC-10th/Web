import { useState } from "react";

function useSidebar(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

export default useSidebar;
