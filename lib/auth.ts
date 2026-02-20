import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        // Admin login check
        if (credentials.username === "admin-temp" && credentials.password === "leaseu-admin") {
          // Check if admin user exists, create if not
          let admin = await prisma.user.findFirst({
            where: { role: "ADMIN", email: null },
          })

          if (!admin) {
            admin = await prisma.user.create({
              data: {
                role: "ADMIN",
                name: "Admin",
                emailVerified: true,
                eduVerified: true,
              },
            })
          }

          return {
            id: admin.id,
            email: admin.email || "admin-temp",
            name: admin.name || "Admin",
            role: admin.role,
          }
        }

        // Regular user login
        if (!credentials.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
}

declare module "next-auth" {
  interface User {
    role: string
  }
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    id: string
  }
}
