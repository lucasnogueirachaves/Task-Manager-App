import 'dotenv/config'
import {z} from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1024).max(65535).default(3333),
    HOST: z.string().default('0.0.0.0'),
    DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
    console.error('Invalid environment vaiables.', _env.error)

    throw new Error('Invalid environment vaiables.')
}

export const env = envSchema.parse(process.env)