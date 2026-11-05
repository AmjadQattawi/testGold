export type Company = {
  id: string;
  name: string;
  companyId?: number | string;
  companyName?: string;
  companyIsActive?: boolean;
  companyAPIPath?: string;
  companyVirtualPath?: string;
  companyPhysicalPath?: string;
  companyLogoURL?: string;
  subscriptionEndDate?: string;
  isDefaultForUser?: boolean;
};
