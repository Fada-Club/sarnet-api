import { PrismaClient } from "@prisma/client";


declare global {
    var prisma: PrismaClient | undefined
}


const prismac = globalThis.prisma || new PrismaClient
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismac

export default prismac