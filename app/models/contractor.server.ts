// Prisma types are no longer used - we use WordPress API instead
// import { Contractor } from "@prisma/client";
// import { prisma } from "~/db.server";
import { sortByDistanceFromZip } from "~/lib/distances";
import {
  Certification,
  Service,
  State,
  CreateContractorPayload,
  ContractorFilters
} from "~/types";
import { 
  fetchContractorsFromWordPress, 
  fetchContractorById as fetchWPContractorById,
  transformWordPressContractor,
  WordPressFilters 
} from "~/services/wordpress-api";

export const getContractorById = async (id: string) => {
  try {
    const wpContractor = await fetchWPContractorById(parseInt(id));
    const contractor = transformWordPressContractor(wpContractor);
    return contractor;
  } catch (error) {
    console.error(`Error fetching contractor by ID ${id}:`, error);
    throw new Error("Failed to fetch contractor");
  }
};

//get contractor by name - now uses WordPress API
export async function getContractorByName(name: string) {
  try {
    const wpResponse = await fetchContractorsFromWordPress({ search: name });
    if (wpResponse.contractors.length > 0) {
      return transformWordPressContractor(wpResponse.contractors[0]);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching contractor by name ${name}:`, error);
    throw new Error("Failed to fetch contractor");
  }
}

export const getContractors = async ({zip, certifications, services, stateServed}:ContractorFilters, page = 1, pageSize = 10) => {
  try {
    // Map the existing filters to WordPress API parameters
    const wpFilters: WordPressFilters = {
      page,
      per_page: pageSize,
    };

    // Add service type filter (map services to service_type taxonomy)
    if (services && services.length > 0) {
      // For now, use the first service type - we can enhance this later
      wpFilters.service_type = services[0];
    }

    // Add location filter if provided
    if (stateServed) {
      wpFilters.location = stateServed;
    }

    // Fetch contractors from WordPress
    const wpResponse = await fetchContractorsFromWordPress(wpFilters);
    
    // Transform WordPress contractors to match existing app structure
    const contractors = wpResponse.contractors.map(transformWordPressContractor);

    // If there's a zip filter, sort by distance (keep existing distance logic)
    if (zip) {
      try {
        const sortedContractors = await sortByDistanceFromZip(contractors, zip);
        return {
          contractors: sortedContractors,
          totalPages: wpResponse.totalPages,
          currentPage: wpResponse.currentPage,
        };
      } catch (error) {
        console.log("Error fetching distances from zip: ", error);
        // If distance calculation fails, return unsorted results
        return {
          contractors,
          totalPages: wpResponse.totalPages,
          currentPage: wpResponse.currentPage,
        };
      }
    }

    return {
      contractors,
      totalPages: wpResponse.totalPages,
      currentPage: wpResponse.currentPage,
    };
  } catch (error) {
    console.error("Error fetching contractors from WordPress:", error);
    throw new Error("Failed to fetch contractors from WordPress");
  }
};

// createContractor function removed - contractors are now managed in WordPress
// Use WordPress admin panel to add/edit contractors
