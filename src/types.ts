export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
}

export interface Photo {
  id: number;
  url: string;
  alt: string;
}

export interface WeddingInfo {
  groom: {
    name: string;
    phone: string;
    fatherName: string;
    fatherPhone?: string;
    motherName: string;
    motherPhone?: string;
  };
  bride: {
    name: string;
    phone: string;
    fatherName: string;
    fatherPhone?: string;
    motherName: string;
    motherPhone?: string;
  };
  date: string; // ISO string
  location: {
    name: string;
    address: string;
    mapUrl: string;
  };
}