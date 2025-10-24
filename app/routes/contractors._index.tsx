import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Find Contractors | Electrify DC" },
  { name: "description", content: "Find qualified contractors for your electrification project in Washington DC, Maryland, and Virginia. Search by service type, location, and certifications." },
  { name: "robots", content: "index, follow" },
  { property: "og:title", content: "Find Contractors | Electrify DC" },
  { property: "og:description", content: "Find qualified contractors for your electrification project in Washington DC, Maryland, and Virginia." },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://contractors.electrifydc.org" },
];

export default function ContractorsIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Find Contractors
        </h1>
        
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            No contractors found
          </h2>
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
      </div>
    </div>
  );
}