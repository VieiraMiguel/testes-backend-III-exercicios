import { ProductBusiness } from '../../../src/business/ProductBusiness'
import { GetProductsSchema } from '../../../src/dtos/product/getProducts.dto'
import { BadRequestError } from '../../../src/errors/BadRequestError'
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock'
import { ProductDatabaseMock } from '../../mocks/ProductDatabaseMock'
import { TokenManagerMock } from '../../mocks/TokenManagerMock'

describe("Testando getProducts", () => {
  const productBusiness = new ProductBusiness(
    new ProductDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test('Retorno de todos os produtos', async () => {

    const input = GetProductsSchema.parse({

      token: 'token-mock-fulano'
    })

    const output = await productBusiness.getProducts(input)

    expect(output).toEqual([
      {

        id: 'p001',
        name: 'Mouse',
        price: 50,
        createdAt: expect.any(String)
      },
      {
        id: 'p002',
        name: 'Teclado',
        price: 80,
        createdAt: expect.any(String)
      }
    ])
  })

  test('Token inválido', async () => {

    expect.assertions(2)

    try {
      
      const input = GetProductsSchema.parse({

        token: 'token-mock-invalido'
      })

      const output = await productBusiness.getProducts(input)

    } catch (error) {
      
      if(error instanceof BadRequestError) {

        expect(error.message).toBe('token inválido')
        expect(error.statusCode).toBe(400)
      }
    }
  })
})