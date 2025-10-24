import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import Select from "react-select";

import Heading from "~/components/heading";
import { Ratings } from "~/components/rating";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
  renderPageNumbers,
} from "~/components/ui/pagination";
import { getContractors } from "~/models/contractor.server";

import content from "../content/contractors.json";
import {
  STATES,
  SERVICES,
  CERTIFICATIONS,
  Contractor,
  ContractorFilters,
  ContractorResponse,
} from "../types";

export async function action({
  request,
}: ActionFunctionArgs): Promise<ContractorResponse> {
  const body = await request.formData();
  const services: string[] = [];
  const certifications: string[] = [];

  for (const pair of body.entries()) {
    if (!pair[1]) continue;
    if (pair[0] == "services") {
      services.push(pair[1].toString());
    }
    if (pair[0] == "certifications") {
      certifications.push(pair[1].toString());
    }
  }

  let zip = body.get("zip")?.toString();
  if (!zip || zip.length != 5) {
    zip = "";
  }

  const filters: ContractorFilters = {
    zip: zip,
    stateServed: body.get("state")?.toString() ?? "",
    services: services,
    certifications: certifications,
  };

  const pageNumber = Number(body.get("page-number")?.toString()) ?? 1;

  const data = await getContractors(filters, pageNumber);
  return data as ContractorResponse;
}

export async function loader(): Promise<ContractorResponse> {
  // Temporarily disable WordPress API to test if app loads
  console.log("Loading contractors - temporarily disabled WordPress API");
  return {
    contractors: [],
    totalPages: 0,
    currentPage: 1,
  };
}

export const meta: MetaFunction = () => [
  { title: "Find Contractors | Electrify DC" },
  { name: "description", content: "Find qualified contractors for your electrification project in Washington DC, Maryland, and Virginia. Search by service type, location, and certifications." },
  { name: "robots", content: "index, follow" },
  { property: "og:title", content: "Find Contractors | Electrify DC" },
  { property: "og:description", content: "Find qualified contractors for your electrification project in Washington DC, Maryland, and Virginia." },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://contractors.electrifydc.org" },
];

interface PhoneLinkProps {
  phoneNumber: string;
}

const PhoneLink = (props: PhoneLinkProps) => {
  const { phoneNumber } = props;
  const formattedPhoneNumber = `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  return <a href={`tel:+1${phoneNumber}`}>{formattedPhoneNumber}</a>;
};

interface ContractorBlockProps {
  contractor: Contractor;
}

const ContractorBlock = (props: ContractorBlockProps) => {
  const { contractor } = props;
  return (
    <li key={contractor.name} className="flex justify-center">
      <div className="relative w-full max-w-3xl items-start overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="flex justify-between px-4 py-2">
          <h2 className="text-xl font-bold">{contractor.name}</h2>
          {contractor.distance ? (
            <div className="align-center">
              Distance: {contractor.distance} mi
            </div>
          ) : null}
        </div>
        <div className="flex">
          <div className="w-[200px] px-4 pb-4 md:w-[400px]">
            <ul>
              {contractor.statesServed.map((item, index) => (
                <li
                  key={index}
                  className="mr-1 inline-block rounded-full bg-green-100 px-2 text-xs text-green-800"
                >
                  {item.name}
                </li>
              ))}
            </ul>
            <ul>
              {contractor.services.map((item, index) => (
                <li
                  key={index}
                  className="mr-1 inline-block rounded-full bg-blue-100 px-2 text-xs text-blue-800"
                >
                  {item.name}
                </li>
              ))}
            </ul>
            <ul>
              {contractor.certifications.map((item, index) => (
                <li
                  key={index}
                  className="mr-1 inline-block rounded-full bg-orange-100 px-2 text-xs text-orange-800"
                  title={item.name}
                >
                  {item.shortName}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex grow flex-col items-end px-4 pb-4 text-sm">
            {contractor.website ? (
              <a
                href={contractor.website}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-sm underline hover:text-blue-500"
              >
                Website
              </a>
            ) : null}
            {contractor.email ? (
              <a
                href={`mailto:${contractor.email}`}
                rel="noreferrer"
                className="inline-block text-sm underline hover:text-blue-500"
              >
                Email
              </a>
            ) : null}
            {contractor.phone ? (
              <PhoneLink phoneNumber={contractor.phone} />
            ) : null}
            <p>{`${contractor.city}, ${contractor.state}`}</p>
            <div className="mt-auto flex pt-2">
              {contractor.googleRating ? (
                <Ratings
                  rating={contractor.googleRating}
                  title="{contractor.googleRating} stars"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default function ContractorList() {
  const initialData = useLoaderData<typeof loader>();
  const initialContractors = initialData.contractors as Contractor[];
  const [filteredContractors, setFilteredContractors] =
    useState(initialContractors);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);

  const fetcher = useFetcher<ContractorResponse>();

  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data;
      setFilteredContractors(data.contractors);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    }
  }, [fetcher.data]);

  interface Option<Type> {
    value: Type;
    label: Type;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    (document.getElementById("page-number") as HTMLInputElement).value =
      page.toString();
    const form = document.getElementById("filter-form") as HTMLFormElement;

    fetcher.submit(form, {
      method: "POST",
    });
  };

  return (
    <div>
      <Heading>{content.heading}</Heading>
      <fetcher.Form id="filter-form" method="post">
        <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 space-x-4">
          <h3 className="hidden font-bold md:inline-block">Filter by:</h3>
          <Select<Option<string>>
            id="state"
            instanceId="state"
            name="state"
            classNames={{
              control: () => "!border-2 !border-green-200",
            }}
            isClearable
            placeholder="Anywhere"
            options={STATES.map((state) => ({
              value: state,
              label: state,
            }))}
          />
          <Select<Option<string>, true>
            id="services"
            instanceId="services"
            name="services"
            classNames={{
              control: () => "!border-2 !border-blue-200",
            }}
            isMulti
            placeholder="Any service"
            options={SERVICES.map((service) => ({
              value: service,
              label: service,
            }))}
          />
          <Select<Option<string>, true>
            id="certifications"
            instanceId="certifications"
            name="certifications"
            classNames={{
              control: () => "!border-2 !border-orange-200",
            }}
            isMulti
            placeholder="Any certifications"
            options={CERTIFICATIONS.map((cert) => ({
              value: cert,
              label: cert,
            }))}
          />
          <input
            className="w-24 rounded-sm border-2 p-[6px]"
            type="text"
            id="zip"
            name="zip"
            placeholder="Zip Code"
            maxLength={5}
          />
          <input
            type="hidden"
            id="page-number"
            name="page-number"
            value="1"
          ></input>
          <button
            className="rounded-sm bg-gray-200 px-4 py-2 hover:bg-gray-300"
            type="submit"
          >
            Search
          </button>
        </div>
      </fetcher.Form>
      <ul className="mt-6 space-y-4">
        {filteredContractors.length === 0 ? (
          <li className="text-center py-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No contractors found
              </h3>
              <p className="text-gray-600 mb-4">
                We're currently setting up our contractor directory. 
                Please check back soon or contact us for recommendations.
              </p>
              <a 
                href="https://electrifydc.org/contact" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800"
              >
                Contact Us
              </a>
            </div>
          </li>
        ) : (
          filteredContractors.map((contractor: Contractor) => (
            <ContractorBlock contractor={contractor} key={contractor.name} />
          ))
        )}
      </ul>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationPrevious>
          {renderPageNumbers(currentPage, totalPages, handlePageChange)}
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationNext>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
