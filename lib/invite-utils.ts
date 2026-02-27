import { createHash, randomBytes } from "crypto"

const SALT = process.env.INVITE_SALT ?? "leaseu-fsu-invite-salt"

export function generateInviteCode(): string {
  return randomBytes(24).toString("base64url")
}

export function hashInviteCode(code: string): string {
  return createHash("sha256").update(code + SALT).digest("hex")
}

export function verifyInviteCode(code: string, hash: string): boolean {
  return hashInviteCode(code) === hash
}
