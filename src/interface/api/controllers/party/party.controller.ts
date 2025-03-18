import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddPartyUseCase } from '../../../../application/use-cases/party/add-party.use-case';
import { UpdatePartyUseCase } from '../../../../application/use-cases/party/update-party.use-case';
import { CreatePartyDto } from '../../dtos/party/create-party.dto';
import { UpdatePartyDto } from '../../dtos/party/update-party.dto';
import { PartyResponseDto } from '../../dtos/party/party-response.dto';
import { PartyAggregate } from '../../../../domain/aggregates/party/party.aggregate';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

/**
 * Controller for managing enterprise party operations
 */
@ApiTags('Parties')
@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PartyController {
  constructor(
    private readonly addPartyUseCase: AddPartyUseCase,
    private readonly updatePartyUseCase: UpdatePartyUseCase,
  ) {}

  /**
   * Get all parties of an enterprise
   * @param enterpriseId Enterprise ID
   * @returns List of parties of the enterprise
   */
  @ApiOperation({ summary: 'Get parties of an enterprise', description: 'Retrieves all parties associated with a specific enterprise' })
  @ApiParam({ name: 'enterpriseId', description: 'Unique identifier of the enterprise' })
  @ApiResponse({ status: 200, description: 'Party list retrieved successfully', type: PartyResponseDto, isArray: true })
  @ApiResponse({ status: 404, description: 'Enterprise not found' })
  @Get('enterprises/:enterpriseId/parties')
  async findAllByEnterprise(@Param('enterpriseId') enterpriseId: string) {
    // Here we would implement a use case to get all parties of an enterprise
    // As we don't have that use case implemented, we return an empty array
    return {
      data: [],
      meta: {
        total: 0,
      },
    };
  }

  /**
   * Get all enterprises associated with a party
   * @param partyId Party ID
   * @returns List of enterprises associated with the party
   */
  @ApiOperation({ summary: 'Get enterprises of a party', description: 'Retrieves all enterprises a specific party belongs to' })
  @ApiParam({ name: 'partyId', description: 'Unique identifier of the party' })
  @ApiResponse({ status: 200, description: 'Enterprise list retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  @Get('parties/:partyId/enterprises')
  async findEnterprisesByParty(@Param('partyId') partyId: string) {
    // Here we would implement a use case to get all enterprises associated with a party
    // As we don't have that use case implemented, we return an empty array
    return {
      data: [],
      meta: {
        total: 0,
      },
    };
  }

  /**
   * Add a new party to an enterprise
   * @param enterpriseId Enterprise ID
   * @param createPartyDto Data for the new party
   * @returns The created party
   */
  @ApiOperation({ summary: 'Add party to enterprise', description: 'Adds a new party to an existing enterprise' })
  @ApiParam({ name: 'enterpriseId', description: 'Unique identifier of the enterprise' })
  @ApiBody({ type: CreatePartyDto, description: 'Data for the new party' })
  @ApiResponse({ status: 201, description: 'Party created successfully', type: PartyResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Enterprise not found' })
  @ApiResponse({ status: 409, description: 'Duplicate email in the enterprise' })
  @Post('enterprises/:enterpriseId/parties')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('enterpriseId') enterpriseId: string,
    @Body() createPartyDto: CreatePartyDto,
  ) {
    // Ensure the enterpriseId in the DTO matches the one in the URL
    const partyData = { ...createPartyDto, enterpriseId };
    const party = await this.addPartyUseCase.execute(partyData);
    return this.mapToResponseDto(party);
  }

  /**
   * Update an existing party of an enterprise
   * @param enterpriseId Enterprise ID
   * @param partyId Party ID
   * @param updatePartyDto Data to update
   * @returns The updated party
   */
  @ApiOperation({ summary: 'Update party', description: 'Updates the data of an existing party in an enterprise' })
  @ApiParam({ name: 'enterpriseId', description: 'Unique identifier of the enterprise' })
  @ApiParam({ name: 'partyId', description: 'Unique identifier of the party' })
  @ApiBody({ type: UpdatePartyDto, description: 'Data to update the party' })
  @ApiResponse({ status: 200, description: 'Party updated successfully', type: PartyResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Enterprise or party not found' })
  @ApiResponse({ status: 409, description: 'Duplicate email in the enterprise' })
  @Put('enterprises/:enterpriseId/parties/:partyId')
  async update(
    @Param('enterpriseId') enterpriseId: string,
    @Param('partyId') partyId: string,
    @Body() updatePartyDto: UpdatePartyDto,
  ) {
    const party = await this.updatePartyUseCase.execute(partyId, enterpriseId, updatePartyDto);
    return this.mapToResponseDto(party);
  }

  /**
   * Maps a PartyAggregate to a response DTO
   */
  private mapToResponseDto(party: PartyAggregate): PartyResponseDto {
    return new PartyResponseDto({
      id: party.id,
      name: party.name,
      email: party.email.toString(),
      role: party.role,
      enterpriseId: party.enterpriseId,
      isActive: party.isActive,
      createdAt: party.createdAt,
      updatedAt: party.updatedAt,
    });
  }
}