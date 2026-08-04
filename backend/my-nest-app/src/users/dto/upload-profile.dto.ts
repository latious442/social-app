import { IsInt, IsNotEmpty } from "class-validator";

export class UploadProfileDto {
  @IsNotEmpty()
  profile!: string;

  @IsInt()
  id!: number;
}