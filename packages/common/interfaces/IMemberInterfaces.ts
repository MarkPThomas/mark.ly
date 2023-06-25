export interface IMemberStatus {
  reason: string | null;
  status: string;
  note?: string;
}


export interface IMemberBadge {
  link: string | null;
  imageUrl: string | null;
  hoverText: string | null;
}


export interface IMemberSocial {
  [key: string]: string | null;
}


export interface IMemberImage {
  alt: string;
  url: string;
  downloadName: string;
}


export interface IMemberPersonal {
  gender?: string[];
  pronouns?: string[];
  orientation?: string[];
  background?: string[];
  communities?: string[];
  isApproved?: boolean;
  country?: string[];
}
