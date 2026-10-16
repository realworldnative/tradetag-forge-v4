export type AuthoritySource =
  | "human"
  | "organization"
  | "agent"
  | "protocol";

export type AuthorityStatus =
  | "unverified"
  | "verified"
  | "revoked"
  | "expired";

export interface AuthorityClaim {
  id: string;
  source: AuthoritySource;
  subjectId: string;
  scope: string[];
  status: AuthorityStatus;
  issuedAt: string;
  expiresAt?: string;
  evidenceRefs: string[];
}

export function isAuthorityActive(
  claim: AuthorityClaim,
  now = new Date()
): boolean {
  if (claim.status !== "verified") {
    return false;
  }

  if (!claim.expiresAt) {
    return true;
  }

  return new Date(claim.expiresAt).getTime() > now.getTime();
}
