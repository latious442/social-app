import { IsString, IsNotEmpty , IsInt} from 'class-validator';
export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsInt()
    @IsNotEmpty()
    userId!: number;

}
