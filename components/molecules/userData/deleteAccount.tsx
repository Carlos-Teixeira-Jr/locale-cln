import { useEffect, useState } from "react";
import DeleteAccountModal from "../../atoms/modals/deleteAccountModal";

const DeleteAccount = () => {

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  return (
    <div className="my-2 relative">
      <p 
        className="font-normal text-xl text-quaternary mx-5 my-5 md:my-0 md:mb-4 md:mx-4 pt-2 relative inline-block group transition-colors duration-300 hover:text-primary cursor-pointer"
        onClick={() => setDeleteModalIsOpen(true)}
      >
        Ao deletar sua conta você não poderá mais acessar seus anúncios.
      </p>

      <DeleteAccountModal 
        isOpen={deleteModalIsOpen} 
        setModalIsOpen={setDeleteModalIsOpen}
      />
    </div>
  );
}

export default DeleteAccount;
