export interface Template {
  name: string;
  specs: Spec[];
}

export interface Spec {
  name: string;
  description: string;
  maxRating: number;
  evaluatedRating: number;
  context?: string;
  proof: Proof;
}

export type Proof =
  | { type: "pdf"; file: File }
  | { type: "text"; content: string }
  | { type: "screenshot"; file: File };
