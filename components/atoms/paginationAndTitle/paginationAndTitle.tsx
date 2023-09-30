import Pagination from '../pagination/pagination';

interface ITitle {
  adminName: string;
}

const PaginationAndTitle: React.FC<ITitle> = ({ adminName }: ITitle) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-extrabold text-2xl md:text-4xl text-quaternary mb-10 mr-12 md:mr-48">
        Bem vindo {adminName}!
      </h1>
      <Pagination />
    </div>
  );
};

export default PaginationAndTitle;
