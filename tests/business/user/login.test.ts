import { UserBusiness } from "../../../src/business/UserBusiness"
import { LoginSchema } from "../../../src/dtos/user/login.dto"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve gerar token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "fulano@email.com",
      password: "fulano123"
    })

    const output = await userBusiness.login(input)

    expect(output).toEqual({
      message: "Login realizado com sucesso",
      token: "token-mock-fulano"
    })
  })

  test('Email não encontrado', async () => {

    try {

      const input = LoginSchema.parse({

        email: 'any@email.com',
        password: 'fulano123'
      })

      const output = await userBusiness.login(input)

    } catch (error) {

      if (error instanceof NotFoundError) {

        expect(error.message).toBe("'email' não encontrado")
        expect(error.statusCode).toBe(404)
      }
    }
  })

  test('Senha incorreta', async () => {

    try {

      const input = LoginSchema.parse({

        email: 'fulano@email.com',
        password: 'string'
      })

      const output = await userBusiness.login(input)

    } catch (error) {

      if (error instanceof NotFoundError) {

        expect(error.message).toBe("'email' ou 'password' incorretos")
        expect(error.statusCode).toBe(400)
      }
    }
  })
})