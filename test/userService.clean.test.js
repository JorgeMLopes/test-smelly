const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um usuário com status ativo', () => {
    // Arrange
    const nome = 'Fulano de Tal';
    const email = 'fulano@teste.com';
    const idade = 25;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.email).toBe(email);
    expect(usuarioCriado.idade).toBe(idade);
    expect(usuarioCriado.status).toBe('ativo');
  });

  test('deve buscar um usuário pelo ID corretamente', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      'Maria',
      'maria@teste.com',
      30
    );

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toEqual(usuarioCriado);
  });

  test('deve desativar um usuário comum', () => {
    // Arrange
    const usuario = userService.createUser(
      'Comum',
      'comum@teste.com',
      30
    );

    // Act
    const resultado = userService.deactivateUser(usuario.id);
    const usuarioAtualizado = userService.getUserById(usuario.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar um usuário administrador', () => {
    // Arrange
    const admin = userService.createUser(
      'Admin',
      'admin@teste.com',
      40,
      true
    );

    // Act
    const resultado = userService.deactivateUser(admin.id);

    // Assert
    expect(resultado).toBe(false);
  });

  test('deve gerar relatório contendo o nome do usuário', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Alice');
  });

  test('deve gerar relatório contendo o status do usuário', () => {
    // Arrange
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('ativo');
  });

  test('deve gerar relatório com o título correto', () => {
    // Arrange
    userService.createUser('Carlos', 'carlos@email.com', 22);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Relatório de Usuários');
  });

  test('deve lançar erro ao tentar criar usuário menor de idade', () => {
    // Arrange
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    // Act + Assert
    expect(() => {
      userService.createUser(nome, email, idade);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve retornar relatório vazio quando não houver usuários cadastrados', () => {
    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Relatório de Usuários');
  });
});