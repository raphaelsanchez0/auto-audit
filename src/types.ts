import { number } from "zod";
import { Template, Spec, Audit, AuditSpec } from "./generated/prisma";

export interface TemplateWithSpecCount extends Template {
  specCount: number;
}

export interface TemplateWithSpecs extends Template {
  specs: Spec[];
}

// export interface Spec {
//   name: string;
//   description: string;
//   maxRating: number;
// }
export interface AuditEntityComplete extends Audit {
  template: TemplateWithSpecs;
  auditSpecs: AuditSpec[];
}
// export interface Audit extends Spec {
//   evaluatedRating: number;
//   context?: string;
//   proof: Proof;
// }

export type Proof =
  | { type: "pdf"; file: File }
  | { type: "text"; content: string }
  | { type: "screenshot"; file: File };
