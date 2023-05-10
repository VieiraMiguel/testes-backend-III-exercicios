import { ProductBusiness } from '../../../src/business/ProductBusiness'
import { CreateProductSchema } from '../../../src/dtos/product/createProduct.dto'
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

    test("Testando a função", async () => {

        expect.assertions(1)

        const input = CreateProductSchema.parse({

            name: 'new product',
            price: 99,
            token: 'token-mock-astrodev'
        })

        const output = await productBusiness.createProduct(input)

        expect(output).toEqual({
            message: 'Producto cadastrado com sucesso',
            product: {
                id: 'id-mock',
                name: 'new product',
                price: 99,
                createdAt: expect.any(String)
            }
        })
    })

    test('Token invalido', async () => {

        expect.assertions(2)

        try {

            const input = CreateProductSchema.parse({
                name: 'new product',
                price: 99,
                token: 'token-mock-invalido'
            })

            const output = await productBusiness.createProduct(input)

        } catch (error) {

            if (error instanceof BadRequestError) {

                expect(error.message).toBe('token inválido')
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test('Token sem autorização', async () => {

        expect.assertions(2)

        try {

            const input = CreateProductSchema.parse({
                name: 'new product',
                price: 99,
                token: 'token-mock-fulano'
            })

            const output = await productBusiness.createProduct(input)

        } catch (error) {

            if (error instanceof BadRequestError) {

                expect(error.message).toBe('somente admins podem acessar')
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test('Preço menor ou igual a 0', async () => {

        expect.assertions(2)

        try {

            const input = CreateProductSchema.parse({
                name: 'new product',
                price: 0,
                token: 'token-mock-astrodev'
            })

            const output = await productBusiness.createProduct(input)

        } catch (error) {

            if (error instanceof BadRequestError) {

                expect(error.message).toBe('preço não pode ser 0 ou negativo')
                expect(error.statusCode).toBe(400)
            }
        }
    })
})