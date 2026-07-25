import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { VoucherService } from "./voucher.service";
import { CreateVoucherBatchDto } from "./dto/create-voucher.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { SkipAuth } from "../../core/decorators/skipAuth.decorator";

@ApiTags("Vouchers")
@ApiBearerAuth()
@Controller("vouchers")
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post("generate")
  @ApiOperation({ summary: "Generate a batch of vouchers" })
  @ApiResponse({ status: 201, description: "Vouchers generated." })
  async generateBatch(@Body() dto: CreateVoucherBatchDto) {
    return this.voucherService.generateBatch(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all vouchers" })
  async findAll() {
    return this.voucherService.findAll();
  }

  @SkipAuth()
  @Post("redeem")
  @ApiOperation({ summary: "Redeem a voucher to reveal its reward" })
  @ApiResponse({ status: 200, description: "Voucher redeemed." })
  async redeem(@Body("code") code: string) {
    try {
        return await this.voucherService.redeem(code);
    } catch (e) {
        return { success: false, message: e.message };
    }
  }
}
