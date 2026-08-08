import { IsString, IsInt } from 'class-validator';
export class CreateMessageDto {

    @IsString()
    msg!: string;

    @IsInt()
    senderId!: number;

    @IsInt()
    receiverId!: number;

    @IsString()
    pht?: string;
}
