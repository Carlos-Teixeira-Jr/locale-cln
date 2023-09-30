import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

export interface IPagination {
  totalPages: number;
}

const Pagination: React.FC<IPagination> = ({
  totalPages,
}) => {
  const router = useRouter();
  const query = router.query;
  const [pages, setPages] = useState<number | undefined>();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState<number>(
    query.page !== undefined ? 
    parseInt(query.page.toString()) : 
    1
  );

  useEffect(() => {
    setPages(totalPages);
  }, [totalPages]);

  useEffect(() => {
    const queryParams = { ...query, page: currentPage };
    if (
      query.page !== undefined &&
      parseInt(query.page?.toString()) !== currentPage
    ) {
      router.push({ query: queryParams }, undefined, { scroll: false });
    }
  }, [currentPage]);

  return (
    <div className="flex flex-row items-center gap-2 mt-2 md:ml-6 h-[40px]">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              fill="#F5BF5D"
            >
              <path d="M14 18.2 7.8 12 14 5.8l1.6 1.6L11 12l4.6 4.6Z" />
            </svg>
          </span>
        </>
      ) : (
        <>
          <a
            href={`/${pages}`}
            className="w-[33px] h-[33px] bg-[#F7F7F6] cursor-pointer border rounded-[30px] border-[#6B7280] text-[#F5BF5D] text-center px-1 py-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              fill="#F5BF5D"
            >
              <path d="m11 18-6-6 6-6 1.4 1.4L7.825 12l4.575 4.6Zm6.6 0-6-6 6-6L19 7.4 14.425 12 19 16.6Z" />
            </svg>
          </a>
          <span
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            className="w-[33px] h-[33px] bg-[#F7F7F6] border rounded-[30px] border-[#6B7280] cursor-pointer text-[#F5BF5D] text-center px-1 py-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              fill="#F5BF5D"
            >
              <path d="M14 18.2 7.8 12 14 5.8l1.6 1.6L11 12l4.6 4.6Z" />
            </svg>
          </span>
        </>
      )}

      {Array.from({ length: totalPages }, (_, i) => (
        <div
          onClick={() => setCurrentPage(i + 1)}
          key={i}
          className={`w-[33px] h-[33px] bg-[#F7F7F6] cursor-pointer border rounded-[30px] border-[#6B7280] text-[#6B7280] font-extrabold text-lg px-2 text-center hover:text-[#F7F7F6] hover:bg-[#F5BF5D] hover:text-2xl hover:border-none hover:w-[40px] hover:h-[38px] ${
            query.page !== undefined &&
            i === parseInt(query?.page?.toString()) - 1
              ? 'bg-[#F5BF5D] text-2xl border-none w-[38px] h-[38px]'
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              fill="#F5BF5D"
            >
              <path d="m9.4 18.2-1.6-1.6 4.6-4.6-4.6-4.6 1.6-1.6 6.2 6.2Z" />
            </svg>
          </span>
          <div
            //href={`/${pages - 1}`}
            className="max-w-[91px] max-h-[38px] bg-[#F7F7F6] cursor-pointer border rounded-[30px] border-[#6B7280] text-[#F5BF5D] font-extrabold text-lg leading-5 px-5 py-2 active:bg-[#F5BF5D] active:text-white"
            onClick={() => {
              if (pages) {
                setCurrentPage(pages)
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              fill="#F5BF5D"
            >
              <path d="m9.4 18.2-1.6-1.6 4.6-4.6-4.6-4.6 1.6-1.6 6.2 6.2Z" />
            </svg>
          </span>
          <div
            onClick={() => {
              if (pages) {
                setCurrentPage(pages)
              }
            }}
            className="w-[33px] h-[33px] bg-[#F7F7F6] border rounded-[30px] border-[#6B7280] text-[#F5BF5D] text-center p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              fill="#F5BF5D"
            >
              <path d="M6.4 18 5 16.6 9.575 12 5 7.4 6.4 6l6 6Zm6.6 0-1.4-1.4 4.575-4.6L11.6 7.4 13 6l6 6Z" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;
