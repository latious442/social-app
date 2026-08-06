import { IsString, IsNotEmpty, IsInt } from 'class-validator';
export class CreateMessageDto {

    @IsString()
    @IsNotEmpty()
    msg!: string;

    @IsInt()
    senderId!: number;

    @IsInt()
    receiverId!: number;

}
