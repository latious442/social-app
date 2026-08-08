import { IsString, IsNotEmpty , IsInt, IsOptional} from 'class-validator';
export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsInt()
    @IsNotEmpty()
    userId!: number;

    @IsOptional()
    @IsString()
    image?: string;

}
