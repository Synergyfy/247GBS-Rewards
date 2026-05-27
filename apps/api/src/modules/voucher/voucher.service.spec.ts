import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { VoucherService } from "./voucher.service";
import { Voucher, VoucherType } from "./entities/voucher.entity";
import { Repository } from "typeorm";
import { CreateVoucherBatchDto } from "./dto/create-voucher.dto";

// Mock global fetch
global.fetch = jest.fn();

describe("VoucherService", () => {
  let service: VoucherService;
  let repository: Repository<Voucher>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        { provide: getRepositoryToken(Voucher), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
    repository = module.get<Repository<Voucher>>(getRepositoryToken(Voucher));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateBatch", () => {
    it("should generate a batch of local vouchers (LINK type)", async () => {
      const dto: CreateVoucherBatchDto = {
        type: VoucherType.LINK,
        count: 5,
        config: { url: "http://example.com" },
        validityDays: 30,
      };

      mockRepo.create.mockImplementation((voucher) => voucher);
      mockRepo.save.mockResolvedValue([{}, {}, {}, {}, {}]); // 5 saved items

      const result = await service.generateBatch(dto);

      expect(repository.create).toHaveBeenCalledTimes(5);
      expect(repository.save).toHaveBeenCalled();
      expect((global.fetch as jest.Mock)).not.toHaveBeenCalled();
    });

    it("should generate loyalty vouchers and call external API", async () => {
      const dto: CreateVoucherBatchDto = {
        type: VoucherType.MCOM_LOYALTY_TIER,
        count: 2,
        config: { tierId: "gold", durationDays: 45 },
        validityDays: 30,
      };

      mockRepo.create.mockImplementation((voucher) => voucher);
      mockRepo.save.mockResolvedValue([{}, {}]);

      // Mock successful fetch response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await service.generateBatch(dto);

      expect(repository.create).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/provision"),
          expect.objectContaining({
              method: 'POST',
              body: expect.stringContaining("TIER_ACCESS")
          })
      );
      expect(repository.save).toHaveBeenCalled();
    });

    it("should generate mall vouchers and call external Mall API", async () => {
      const dto: CreateVoucherBatchDto = {
        type: VoucherType.MALL_OFFER,
        count: 1,
        config: { durationDays: 30 },
        validityDays: 30,
      };

      mockRepo.create.mockImplementation((voucher) => voucher);
      mockRepo.save.mockResolvedValue([{}]);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await service.generateBatch(dto);

      expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("3001/api/v1/provision"),
          expect.objectContaining({
              method: 'POST',
              body: expect.stringContaining("TRIAL_EXTENSION")
          })
      );
    });

    it("should log error but continue if external provision fails", async () => {
         const dto: CreateVoucherBatchDto = {
            type: VoucherType.MCOM_LOYALTY_TIER,
            count: 1,
            config: { tierId: "gold" },
            validityDays: 30,
          };
    
          mockRepo.create.mockImplementation((voucher) => voucher);
          mockRepo.save.mockResolvedValue([{}]);
    
          // Mock failed fetch response
          (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => "Server Error",
          });

          // Mock logger to avoid cluttering test output
          jest.spyOn((service as any).logger, 'error').mockImplementation(() => {});

          await service.generateBatch(dto);

          expect(global.fetch).toHaveBeenCalled();
          expect((service as any).logger.error).toHaveBeenCalled();
          // Since we skip failing items, and this batch has only 1 item which failed, save is not called.
          expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
