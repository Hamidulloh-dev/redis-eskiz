import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
    private redis: Redis
    private duration : number = 180
    constructor() { 
        this.redis = new Redis({
            port: +(process.env.REDIS_PORT as string),
            host: process.env.REDIS_HOST as string
        })
        this.redis.on('connect', () => {
            console.log('redis connected');
        })
        this.redis.on('error', (error) => {
            console.log('redis connecting error');
            this.redis.quit()
            process.exit(1)
        })
    }
    
    async setOtp(phone_number: string, otp: string) {
        const key = `user:${phone_number}`
        const result = await this.redis.setex(key, this.duration, otp)
        return result
    }

    async getOtp(key: string) {
        const otp = await this.redis.get(key)
        return otp
    }

    async getTTL(key: string) {
        const ttl = await this.redis.ttl(key)
        return ttl
    }

    async delKey(key: string) {
        await this.redis.del(key)
    }

    async setSessionTokenUser(phone_number: string, token: string) {
        await this.redis.setex(`session_token: ${phone_number}`, 300, token)
    }

    async getKey(key: string) {
        return await this.redis.get(key)
    }
}