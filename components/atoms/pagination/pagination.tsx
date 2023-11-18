import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import ArrowLeftIcon from '../icons/arrowLeftIcon';
import ArrowRightIcon from '../icons/arrowRightIcon';
import TwoArrowLeftIcon from '../icons/twoArrowLeftIcon';
import TwoArrowRightIcon from '../icons/twoArrowRightIcon';

export interface IPagination {
  totalPages?: number;
  setCurrentPage?: any;
  currentPage?: number;
}

const Pagination: React.FC<IPagination> = ({
  totalPages = 0,
  currentPage = 0,
  setCurrentPage = () => {},
}) => {
  const router = useRouter();
  const query = router.query;
  const [pages, setPages] = useState<number | undefined>();
  const isMobile = useIsMobile();

  useEffect(() => {
    setPages(totalPages);
  }, [totalPages]);

  return (
    <div className="flex flex-row items-center gap-2 my-2 h-10">
      {!isMobile ? (
        <>
          <div
            onClick={() => setCurrentPage(1)}
            className="max-w-[91px] max-h-[38px] bg-[#F7F7F6] cursor-pointer border rounded-[30px] border-[#6B7280] text-[#F5BF5D] font-extrabold text-lg leading-5 px-5 py-2 active:bg-[#F5BF5D] active:text-white"
          >
            Início
          </div>
          <span
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            className="max-w-[40px] max-h-[38px] bg-[#F7F7F6] cursor-pointer border rounded-[30px] border-[#6B7280] text-[#F5BF5D] text-center px-1 py-1 active:bg-[#F5BF5D] active:text-white"
          >
            <ArrowLeftIcon />
          </span>
        </>
      ) : (
        <>
          <a
            href={`/${pages}`}
            className="w-[33px] h-[33px] bg-[#F7F7F6] cursor-pointer border rounded-[30px] border-[#6B7280] text-[#F5BF5D] text-center px-1 py-1"
          >
            <TwoArrowLeftIcon />
          </a>
          <span
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            className="w-[33px] h-[33px] bg-[#F7F7F6] border rounded-[30px] border-[#6B7280] cursor-pointer text-[#F5BF5D] text-center px-1 py-1"
          >
            <ArrowLeftIcon />
          </span>
        </>
      )}

      {Array.from({ length: totalPages }, (_, i) => (
        <div
          onClick={() => setCurrentPage(i + 1)}
          key={i}
          className={`w-[2.2rem] h-[2.1rem] bg-[#F7F7F6] cursor-pointer rounded-full border-quaternary text-[#6B7280] font-extrabold text-lg py-[0.1rem] text-center hover:text-[#F7F7F6] hover:bg-[#F5BF5D] hover:text-2xl hover:border-none hover:w-[40px] hover:h-[38px] ${
            query.page !== undefined &&
            i === parseInt(query?.page?.toString()) - 1
              ? 'bg-[#F5BF5D] text-2xl border-none w-[38px] h-[38px] py-1'
              : 'border'
          }`}
        >
          {i + 1}
        </div>
      ))}

      {!isMobile ? (
        <>
          <span
            onClick={() => {
              if (pages && currentPage < pages) {
                setCurrentPage(currentPage + 1);
              }
            }}
            className="max-w-[33px] h-[33px] bg-[#F7F7F6] cursor-pointer border rounded-[30px] border-[#6B7280] text-[#F5BF5D] text-center p-1 active:bg-[#F5BF5D] active:text-white"
          >
            <ArrowRightIcon />
          </span>
          <div
            //href={`/${pages - 1}`}
            className="max-w-[91px] max-h-[38px] bg-[#F7F7F6] cursor-pointer border rounded-[30px] border-[#6B7280] text-[#F5BF5D] font-extrabold text-lg leading-5 px-5 py-2 active:bg-[#F5BF5D] active:text-white"
            onClick={() => {
              if (pages) {
                setCurrentPage(pages);
              }
            }}
          >
            Fim
          </div>
        </>
      ) : (
        <>
          <span
            onClick={() => {
              if (pages && currentPage < pages) {
                setCurrentPage(currentPage + 1);
              }
            }}
            className="max-w-[33px] h-[33px] bg-[#F7F7F6] border rounded-[30px] border-[#6B7280] text-[#F5BF5D] text-center px-1 py-1"
          >
            <ArrowRightIcon />
          </span>
          <div
            onClick={() => {
              if (pages) {
                setCurrentPage(pages);
              }
            }}
            className="w-[33px] h-[33px] bg-[#F7F7F6] border rounded-[30px] border-[#6B7280] text-[#F5BF5D] text-center p-1"
          >
            <TwoArrowRightIcon />
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;
