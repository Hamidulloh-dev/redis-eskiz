import { IsString } from "class-validator"

export class CreateAuthDto {
    @IsString()
    phone_number: string
    @IsString()
    password: string
    @IsString()
    session_token: string
}
