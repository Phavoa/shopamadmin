import { Hub } from "@/api/hubApi";

export interface HubDocument {
  title: string;
  url: string;
  type: string;
}

export interface HubDisplay extends Hub {
  status: "PENDING" | "APPROVED" | "REJECTED";
  documents: HubDocument[];
  submittedAt: string;
}
