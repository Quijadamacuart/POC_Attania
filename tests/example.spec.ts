import { test, expect } from '@playwright/test';
import { leerDatosDesdeExcel } from './Utilities/readExcel';

// ID de los datos buscados en el archivo Excel
const idBuscado = 'TD_001';

// Prueba principal
test('Login Atania and switch organization', async ({ page }) => {
    try {
        // Leer datos desde el archivo Excel
        const datos = leerDatosDesdeExcel('./Data/TestData.xlsx', 'password', idBuscado);

        if (datos) {
            // Navegar a la página principal
            await page.goto('/pagina');
            await expect(page).toHaveTitle('PLAN-IT');

            // Login
            await page.getByLabel('Email').click();
            await page.getByLabel('Email').fill(datos.username);

            await page.getByLabel('Password', { exact: true }).click();
            await page.getByLabel('Password', { exact: true }).fill(datos.password);

            await page.locator('[data-test="login"]').click();

            // Switch Organization
            await expect(page.locator('#toolbar')).toContainText('Attainia');
            await page.locator('[data-test="avatar"]').click();

            await page.getByText('Provider Test Organization').click();
            await expect(page.getByRole('dialog')).toContainText('Switch Organization');

            // Espera y rellena el modal
            await page.waitForSelector('//*[@class="v-card v-sheet theme--light"]', { state: 'visible' });
            const inputField = await page.waitForSelector('//input[@id="password"]', { state: 'visible' });
            await inputField.fill(datos.password);

            await page.getByRole('button', { name: 'Switch' }).click();
        } else {
            console.error(`No se encontró la fila con el ID "${idBuscado}". Verifica los datos en el archivo Excel.`);
        }
    } catch (error) {
        console.error('Se produjo un error durante la ejecución de la prueba:', error);
        throw error; // Vuelve a lanzar el error para que Playwright lo registre
    }
});




