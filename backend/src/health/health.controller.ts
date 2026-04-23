import { Controller, Get } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('api/health')
export class HealthController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getHealth() {
    return { status: 'ok' };
  }
}