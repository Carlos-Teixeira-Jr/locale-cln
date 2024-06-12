import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorToastNames, showErrorToast } from "../../../common/utils/toasts";
import CheckIcon from "../icons/checkIcon";
import Loading from "../loading";

interface IAdminFilter {
  ownerId: string,
  onSearchChange: (data: any) => void;
  onCloseFilter: (isOpen: boolean) => void;
}

const AdminFilter = ({ ownerId, onSearchChange, onCloseFilter }: IAdminFilter) => {

  const { query } = useRouter();
  const page = query.page;

  const [filterData, setFilterData] = useState({
    location: '',
    adCode: ''
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onCloseFilter(filterIsOpen);
    if (!filterIsOpen) {
      onSearchChange(null)
    }
  }, [filterIsOpen])

  const inputs = [
    {
      key: 'location',
      label: 'Localidade',
      type: 'text',
      id: 'location',
      value: filterData.location,
      htmlFor: 'location'
    },
    {
      key: 'adCode',
      label: 'Código do anúncio',
      type: 'text',
      id: 'adCode',
      value: filterData.adCode,
      htmlFor: 'adCode'
    },
  ];

  const handleSubmit = async () => {
    const filter: { locationFilter?: string; announcementCode?: string; }[] = [];
    const isNotEmpty = Object.values(filterData).some((e) => e !== '');

    if (isNotEmpty) {
      if (filterData.adCode) {
        try {
          setLoading(true);
          const { data } = await axios.get(`${baseUrl}/property/announcementCode/${filterData.adCode}`);

          onSearchChange(data);
          setLoading(false);
        } catch (error) {
          showErrorToast(ErrorToastNames.InvalidAnnouncementCode)
        }
      } else {
        if (filterData.location) {
          filter.push({ locationFilter: filterData.location });
          const encodedFilter = decodeURIComponent(JSON.stringify(filter));
          try {
            setLoading(true);
            const { data } = await axios.get(`${baseUrl}/property/filter-by-owner/${ownerId}?page=${page}&limit=5&filter=${encodedFilter}&need_count=true`);

            onSearchChange(data);
            setLoading(false);
          } catch (error) {
            showErrorToast(ErrorToastNames.FilterError)
          }
        }
      }
    } else {
      showErrorToast(ErrorToastNames.EmptyFilterFields)
    }
  }

  return (
    <section>
      <div className={`flex justify-start px-5 my-5 md:my-0 md:mt-10'}`}>
        <div
          className={`w-6 h-6 border z-0 bg-tertiary rounded-[5px] drop-shadow-lg cursor-pointer my-auto shrink-0 ${filterIsOpen ? 'border-secondary' : 'border-quaternary'
            }`}
          onClick={() => {
            setFilterIsOpen(!filterIsOpen);
          }}
        >
          {filterIsOpen && (
            <CheckIcon
              fill="#F5BF5D"
              width="30"
              className={`pr-2 pb-6 ${filterIsOpen ? ' border-secondary' : ''
                }`}
            />
          )}
        </div>
        <h3 className="text-xl mx-5 leading-10 text-quaternary font-semibold my-auto">
          {filterIsOpen ? 'Fechar filtros de busca' : 'Abrir filtros de busca'}
        </h3>
      </div>
      {filterIsOpen && (
        <fieldset className="flex flex-col gap-2 text-quaternary text-lg bg-tertiary rounded-[30px] shadow-xl p-4">

          {inputs.map((input) => (
            <div className="flex flex-col" key={input.key}>
              <label htmlFor={input.htmlFor}>
                {input.label}
              </label>
              <input
                type={input.type}
                id={input.id}
                value={input.value}
                onChange={(e) => setFilterData({ ...filterData, [input.key]: e.target.value })}
                className="p-2 h-10 border border-gray-300 rounded-md"
              />
            </div>
          ))}

          <button
            className="mt-4 p-2 h-10 w-1/2 mx-auto text-xl font-semibold text-tertiary bg-primary hover:text-white rounded-md hover:bg-red-600 transition-colors duration-300"
            onClick={handleSubmit}
          >
            {loading ? (
              <span className="flex justify-center my-auto">
                <Loading />
              </span>
            ) : (
              <p>Filtrar</p>
            )}
          </button>
        </fieldset>
      )}

    </section>
  )
}

export default AdminFilter;