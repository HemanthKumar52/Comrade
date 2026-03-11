import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslateDto {
  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  text: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  sourceLang: string;

  @ApiProperty({ example: 'hi' })
  @IsString()
  targetLang: string;
}

export class DetectLanguageDto {
  @ApiProperty({ example: 'Namaste, aap kaise hain?' })
  @IsString()
  text: string;
}
