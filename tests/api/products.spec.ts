import { productListSchema, productSchema, apiErrorSchema } from '../../src/api/schemas/dummyjson';
import { dataPaths } from '../../src/config/paths';
import { expect, test } from '../../src/fixtures';
import { apiProductRowSchema } from '../../src/schemas/test-data';
import { loadCsv } from '../../src/utils/data-loader';
import { parseWithSchema } from '../../src/utils/schema';

const products = loadCsv(dataPaths.apiProducts, apiProductRowSchema);

test.describe('Products API', () => {
  test(
    'returns a catalog that matches the product schema',
    { tag: ['@smoke', '@regression', '@api'] },
    async ({ productsApi }) => {
      const body = parseWithSchema(
        productListSchema,
        await productsApi.list(10, 0),
        'GET /products',
      );
      expect(body.limit).toBe(10);
      expect(body.products).toHaveLength(10);
      expect(body.total).toBeGreaterThan(10);
    },
  );

  for (const row of products) {
    test(
      `returns product ${row.id} from the CSV fixture`,
      { tag: ['@regression', '@api'] },
      async ({ productsApi }) => {
        const product = parseWithSchema(
          productSchema,
          await productsApi.getById(Number(row.id)),
          `GET /products/${row.id}`,
        );
        expect(product.id).toBe(Number(row.id));
        expect(product.title).toBe(row.title);
        expect(product.price).toBeGreaterThan(0);
      },
    );
  }

  test(
    'searches products by keyword',
    { tag: ['@regression', '@api'] },
    async ({ productsApi }) => {
      const body = parseWithSchema(
        productListSchema,
        await productsApi.search('phone'),
        'GET /products/search',
      );
      expect(body.products.length).toBeGreaterThan(0);
      expect(body.products.some((product) => /phone|airpod|headphone/i.test(product.title))).toBe(
        true,
      );
    },
  );

  test(
    'returns a not-found payload for an unknown product',
    { tag: ['@regression', '@api'] },
    async ({ productsApi }) => {
      const response = await productsApi.getByIdResponse(99999);
      expect(response.status()).toBe(404);
      const body = parseWithSchema(apiErrorSchema, await response.json(), 'GET /products/99999');
      expect(body.message.toLowerCase()).toContain('not found');
    },
  );
});
