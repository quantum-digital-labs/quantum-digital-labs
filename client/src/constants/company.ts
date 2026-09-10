/**
 * Public company constants.
 */
export const COMPANY = {
  legalName: 'Quantum Digital Labs Pvt. Ltd.',
  shortName: 'Quantum Digital Labs',
  brandName: 'QUANTUM',
  tagline: 'Connect · Innovate · Transform',
  founded: 'April 2026',
  email: 'quantumdigitallabsp@gmail.com',
  phone: '8019412604',
  address:
    'Unit 409, 4th Floor, Elite Business Center, Jain Sadguru Image Capital Park, VIP Hills, Madhapur, Hyderabad-500081',
} as const;

export const COMPANY_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`;
