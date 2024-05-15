import { useState } from 'react';
import DeleteAccountModal from '../../atoms/modals/deleteAccountModal';

const DeleteAccount = () => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  return (
    <div className="my-1 md:my-2 relative">
      <p className="font-normal text-lg text-quaternary mx-5 my-5 md:my-0 md:mb-4 md:mx-4 md:pt-2 relative inline-block cursor-pointer">
        Ao deletar sua conta você não poderá mais acessar seus anúncios.
      </p>

      <div className="lg:float-right flex md:justify-end justify-center md:w-[90%] lg:w-full mb-10 md:mr-16 lg:mr-5">
        <button
          className="bg-primary w-fit h-12 flex items-center text-quinary rounded-[10px] py-5 px-10 text-lg font-extrabold transition-colors duration-300 hover:bg-red-600 hover:text-white"
          onClick={() => setDeleteModalIsOpen(true)}
        >
          Deletar conta
        </button>
      </div>

      <DeleteAccountModal
        isOpen={deleteModalIsOpen}
        setModalIsOpen={setDeleteModalIsOpen}
      />
    </div>
  );
};

export default DeleteAccount;
