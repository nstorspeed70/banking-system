import { Test, TestingModule } from '@nestjs/testing';
import { UpdateEnterpriseUseCase } from './update-enterprise.use-case';
import { IEnterpriseRepository, EnterpriseFilter } from '../../../domain/repositories/enterprise.repository.interface';
import { Enterprise, EnterpriseType } from '../../../domain/entities/enterprise.entity';

// Token para la inyección de dependencias
const ENTERPRISE_REPOSITORY_TOKEN = 'ENTERPRISE_REPOSITORY';

describe('UpdateEnterpriseUseCase', () => {
  let useCase: UpdateEnterpriseUseCase;
  let enterpriseRepository: any; // Usar 'any' para evitar problemas de tipado con los mocks
  
  // Datos de prueba
  const enterprise1 = new Enterprise({
    id: '1',
    legalBusinessName: 'Empresa 1',
    taxId: 'ABC123456789',
    enterpriseType: EnterpriseType.COMPANY,
    contactEmail: 'empresa1@example.com',
    contactPhone: '123456789',
  });

  const enterprise2 = new Enterprise({
    id: '2',
    legalBusinessName: 'Empresa 2',
    taxId: 'XYZ987654321',
    enterpriseType: EnterpriseType.INDIVIDUAL,
    contactEmail: 'empresa2@example.com',
    contactPhone: '987654321',
  });

  beforeEach(async () => {
    // Crear un mock del repositorio
    const mockEnterpriseRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByTaxId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    // Crear un módulo de prueba con nuestras dependencias
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ENTERPRISE_REPOSITORY_TOKEN,
          useValue: mockEnterpriseRepository,
        },
        {
          provide: UpdateEnterpriseUseCase,
          useFactory: (repository) => new UpdateEnterpriseUseCase(repository),
          inject: [ENTERPRISE_REPOSITORY_TOKEN],
        },
      ],
    }).compile();

    // Obtener instancias de las clases que necesitamos para las pruebas
    useCase = module.get<UpdateEnterpriseUseCase>(UpdateEnterpriseUseCase);
    enterpriseRepository = module.get(ENTERPRISE_REPOSITORY_TOKEN);
  });

  it('debería actualizar una empresa exitosamente', async () => {
    // Configurar los mocks
    enterpriseRepository.findById.mockResolvedValue(enterprise1);
    enterpriseRepository.update.mockImplementation((id, data) => {
      return Promise.resolve({
        ...enterprise1,
        ...data,
      });
    });

    // Datos para actualizar
    const updateData = {
      legalBusinessName: 'Empresa 1 Actualizada',
      contactEmail: 'empresa1_nueva@example.com',
    };

    // Ejecutar el caso de uso
    const result = await useCase.execute('1', updateData);

    // Verificar que la empresa fue actualizada correctamente
    expect(result).toBeDefined();
    expect(result.legalBusinessName).toBe('Empresa 1 Actualizada');
    expect(result.contactEmail).toBe('empresa1_nueva@example.com');
    // Verificar que los campos no incluidos en updateData no cambiaron
    expect(result.taxId).toBe('ABC123456789');
    expect(result.enterpriseType).toBe(EnterpriseType.COMPANY);
    // Verificar que se llamaron los métodos correctos
    expect(enterpriseRepository.findById).toHaveBeenCalledWith('1');
    expect(enterpriseRepository.update).toHaveBeenCalledWith('1', updateData);
  });

  it('debería lanzar error si la empresa no existe', async () => {
    // Configurar los mocks para simular que la empresa no existe
    enterpriseRepository.findById.mockResolvedValue(null);

    // Intentar actualizar una empresa que no existe
    await expect(useCase.execute('999', { legalBusinessName: 'Empresa Inexistente' }))
      .rejects
      .toThrow('Empresa no encontrada');
    
    // Verificar que se llamó el método correcto
    expect(enterpriseRepository.findById).toHaveBeenCalledWith('999');
    expect(enterpriseRepository.update).not.toHaveBeenCalled();
  });

  it('debería lanzar error si el taxId ya está en uso por otra empresa', async () => {
    // Configurar los mocks
    enterpriseRepository.findById.mockResolvedValue(enterprise1);
    enterpriseRepository.findByTaxId.mockResolvedValue(enterprise2);

    // Intentar actualizar con un taxId que ya está siendo usado por otra empresa
    await expect(useCase.execute('1', { taxId: 'XYZ987654321' }))
      .rejects
      .toThrow('Ya existe otra empresa con este ID fiscal');
    
    // Verificar que se llamaron los métodos correctos
    expect(enterpriseRepository.findById).toHaveBeenCalledWith('1');
    expect(enterpriseRepository.findByTaxId).toHaveBeenCalledWith('XYZ987654321');
    expect(enterpriseRepository.update).not.toHaveBeenCalled();
  });

  it('debería lanzar error si el formato del taxId es inválido', async () => {
    // Configurar los mocks
    enterpriseRepository.findById.mockResolvedValue(enterprise1);
    enterpriseRepository.findByTaxId.mockResolvedValue(null);

    // Intentar actualizar con un taxId con formato inválido (minúsculas)
    await expect(useCase.execute('1', { taxId: 'abc123456' }))
      .rejects
      .toThrow('Formato de ID fiscal inválido');

    // Intentar actualizar con un taxId con formato inválido (muy corto)
    await expect(useCase.execute('1', { taxId: 'ABC12345' }))
      .rejects
      .toThrow('Formato de ID fiscal inválido');

    // Intentar actualizar con un taxId con formato inválido (caracteres especiales)
    await expect(useCase.execute('1', { taxId: 'ABC123456@#$' }))
      .rejects
      .toThrow('Formato de ID fiscal inválido');
    
    // Verificar que se llamaron los métodos correctos
    expect(enterpriseRepository.findById).toHaveBeenCalledWith('1');
  });

  it('debería permitir actualizar sin cambiar el taxId', async () => {
    // Configurar los mocks
    enterpriseRepository.findById.mockResolvedValue(enterprise1);
    enterpriseRepository.update.mockImplementation((id, data) => {
      return Promise.resolve({
        ...enterprise1,
        ...data,
      });
    });

    // Datos para actualizar sin cambiar el taxId
    const updateData = {
      legalBusinessName: 'Empresa 1 Actualizada',
      contactPhone: '111222333',
    };

    // Ejecutar el caso de uso
    const result = await useCase.execute('1', updateData);

    // Verificar que la empresa fue actualizada correctamente
    expect(result).toBeDefined();
    expect(result.legalBusinessName).toBe('Empresa 1 Actualizada');
    expect(result.contactPhone).toBe('111222333');
    // Verificar que el taxId no cambió
    expect(result.taxId).toBe('ABC123456789');
    // Verificar que se llamaron los métodos correctos
    expect(enterpriseRepository.findById).toHaveBeenCalledWith('1');
    expect(enterpriseRepository.findByTaxId).not.toHaveBeenCalled();
    expect(enterpriseRepository.update).toHaveBeenCalledWith('1', updateData);
  });

  it('debería permitir actualizar con el mismo taxId', async () => {
    // Configurar los mocks
    enterpriseRepository.findById.mockResolvedValue(enterprise1);
    // No necesitamos configurar findByTaxId porque no se llamará cuando el taxId es el mismo
    enterpriseRepository.update.mockImplementation((id, data) => {
      return Promise.resolve({
        ...enterprise1,
        ...data,
      });
    });

    // Datos para actualizar con el mismo taxId
    const updateData = {
      taxId: 'ABC123456789', // El mismo taxId que ya tenía
      legalBusinessName: 'Empresa 1 Actualizada',
    };

    // Ejecutar el caso de uso
    const result = await useCase.execute('1', updateData);

    // Verificar que la empresa fue actualizada correctamente
    expect(result).toBeDefined();
    expect(result.legalBusinessName).toBe('Empresa 1 Actualizada');
    expect(result.taxId).toBe('ABC123456789');
    // Verificar que se llamaron los métodos correctos
    expect(enterpriseRepository.findById).toHaveBeenCalledWith('1');
    // No se debe llamar a findByTaxId porque el taxId no cambió
    expect(enterpriseRepository.findByTaxId).not.toHaveBeenCalled();
    expect(enterpriseRepository.update).toHaveBeenCalledWith('1', updateData);
  });
});
