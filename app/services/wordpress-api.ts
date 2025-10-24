/**
 * WordPress REST API client for fetching contractor data
 * Replaces the existing Prisma/SQLite data source
 */

export interface WordPressContractor {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    street_1?: string;
    street_2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
    website?: string;
    email?: string;
    energy_audit?: boolean;
    weatherization?: boolean;
    hvac_heat_pump?: boolean;
    electrical?: boolean;
    water_heater?: boolean;
    appliances?: boolean;
  };
  featured_media?: number;
  featured_media_url?: string;
  contractor_service_type?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WordPressContractorResponse {
  contractors: WordPressContractor[];
  totalPages: number;
  currentPage: number;
}

export interface WordPressFilters {
  search?: string;
  service_type?: string;
  location?: string;
  page?: number;
  per_page?: number;
}

const WORDPRESS_API_BASE = process.env.WORDPRESS_API_URL || 'https://electrifydc.org/wp-json/wp/v2';

/**
 * Fetch contractors from WordPress REST API
 */
export async function fetchContractorsFromWordPress(
  filters: WordPressFilters = {}
): Promise<WordPressContractorResponse> {
  const {
    search = '',
    service_type = '',
    location = '',
    page = 1,
    per_page = 10
  } = filters;

  // Build query parameters
  const params = new URLSearchParams({
    per_page: per_page.toString(),
    page: page.toString(),
    _embed: 'true', // Include featured media
  });

  // Add search parameter
  if (search) {
    params.append('search', search);
  }

  // Add service type filter (taxonomy)
  if (service_type) {
    params.append('contractor_service_type', service_type);
  }

  // Add location filter (meta field)
  if (location) {
    params.append('meta_key', 'contractor_location');
    params.append('meta_value', location);
  }

  try {
    console.log('Fetching from WordPress API:', `${WORDPRESS_API_BASE}/contractor?${params.toString()}`);
    const response = await fetch(`${WORDPRESS_API_BASE}/contractor?${params.toString()}`);
    
    console.log('WordPress API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress API error response:', errorText);
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    const contractors: WordPressContractor[] = await response.json();
    console.log('WordPress API returned contractors:', contractors.length, 'contractors');
    
    // Get total pages from response headers
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0');

    return {
      contractors,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching contractors from WordPress:', error);
    throw new Error('Failed to fetch contractors from WordPress API');
  }
}

/**
 * Fetch a single contractor by ID
 */
export async function fetchContractorById(id: number): Promise<WordPressContractor> {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/contractor/${id}?_embed=true`);
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching contractor ${id} from WordPress:`, error);
    throw new Error(`Failed to fetch contractor ${id} from WordPress API`);
  }
}

/**
 * Fetch service types (taxonomy terms) for filter dropdown
 */
export async function fetchServiceTypes(): Promise<Array<{ id: number; name: string; slug: string }>> {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/contractor_service_type`);
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching service types from WordPress:', error);
    throw new Error('Failed to fetch service types from WordPress API');
  }
}

/**
 * Transform WordPress contractor data to match existing app structure
 * This helps maintain compatibility with existing components
 */
export function transformWordPressContractor(wpContractor: WordPressContractor) {
  const acf = wpContractor.acf || {};
  const serviceTypes = wpContractor.contractor_service_type || [];
  
  // Get featured image URL
  const featuredImageUrl = wpContractor._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                           wpContractor.featured_media_url || 
                           null;

  // Convert boolean service fields to service objects
  const services = [];
  if (acf.energy_audit) services.push({ id: 1, name: 'Energy Audit', description: 'Energy audit services' });
  if (acf.weatherization) services.push({ id: 2, name: 'Weatherization', description: 'Weatherization services' });
  if (acf.hvac_heat_pump) services.push({ id: 3, name: 'HVAC / Heat Pump', description: 'HVAC and heat pump services' });
  if (acf.electrical) services.push({ id: 4, name: 'Electrical', description: 'Electrical services' });
  if (acf.water_heater) services.push({ id: 5, name: 'Water Heater', description: 'Water heater services' });
  if (acf.appliances) services.push({ id: 6, name: 'Appliances', description: 'Appliance services' });

  return {
    id: wpContractor.id.toString(),
    name: wpContractor.title.rendered,
    description: wpContractor.content.rendered.replace(/<[^>]*>/g, ''), // Strip HTML tags
    email: acf.email || '',
    phone: acf.phone_number || '',
    website: acf.website || '',
    addressLine1: acf.street_1 || '',
    addressLine2: acf.street_2 || '',
    city: acf.city || '',
    state: acf.state || '',
    zip: acf.zip_code || '',
    featuredImageUrl,
    // Use the services we created from boolean fields
    services: services,
    // For now, we'll use empty arrays for these since they're not in WordPress
    statesServed: [],
    certifications: [],
    distance: undefined
  };
}

