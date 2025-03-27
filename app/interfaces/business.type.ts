export interface CreateBusinessGeneral {
  industry: string;
  name: string;
  email?: string;
  phoneNumber?: string;
}

export interface CreateBusinessContact {
  email: string;
  phoneNumber: string;
  website: string;
  street: string;
  postalCode: string;
  city: string;
  state: string;
}

export interface CreateBusinessSocial {
  facebook: string;
  twitter: string;
  instagram: string;
  whatsapp: string;
}

export interface CreateBusinessLink {
  text: string;
  url: string;
}

export interface BusinessType extends CreateBusinessGeneral {
  id?: string;
  address: CreateBusinessContact;
  socials: CreateBusinessSocial;
  links: CreateBusinessLink[];
}

export interface StaffType {
  id?: string;
  businessId: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

//segment type
export interface SegmentType {
  id?: string;
  businessId: string;
  name: string;
}
