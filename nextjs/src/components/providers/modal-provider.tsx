"use client";

import { useEffect, useState } from "react";
// Import your custom modals here
// import { CardModal } from "@/components/modals/card-modal"; 
// import { ProModal } from "@/components/modals/pro-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent Hydration Errors: Only render modals after the component 
  // has mounted on the client.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* <CardModal /> */}
      {/* <ProModal /> */}
    </>
  );
};