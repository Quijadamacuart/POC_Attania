import { test, expect } from '@playwright/test';
import { leerDatosDesdeExcel } from './Utilities/readExcel';

// Read Data from Spreadsheet using /Utilities/ReadExcel.ts
const idBuscado='TD_001';
const datos = leerDatosDesdeExcel('./Data/TestData.xlsx', 'password',idBuscado);
  
  test('Login Atania and switch organization', async ({ page }) => {  
      if(datos){
        await page.goto('/pagina');
        // Verify Page's Tittle
        await expect(page).toHaveTitle('PLAN-IT');

        //Login 
        await page.getByLabel('Email').click();
        await page.getByLabel('Email').fill(`${datos.username}`);

        await page.getByLabel('Password', { exact: true }).click();
        await page.getByLabel('Password', { exact: true }).fill(`${datos.password}`);
        
        await page.locator('[data-test="login"]').click();

        //Switch Organization
        await expect(page.locator('#toolbar')).toContainText('Attainia');
        await page.locator('[data-test="avatar"]').click();

        // await expect(page.getByText('Provider Test Organization'));
        await page.getByText('Provider Test Organization').click();

        await expect(page.getByRole('dialog')).toContainText('Switch Organization');

          // Espera a que el modal esté visible
        await page.waitForSelector('//*[@class="v-card v-sheet theme--light"]', { state: 'visible' }); 

        // Espera a que el campo de texto esté visible y listo para interactuar
        const inputField = await page.waitForSelector('//input[@id="password"]', { state: 'visible' }); 

        const pass2= `${datos.password}`;
        await inputField.fill(pass2);

        await page.getByRole('button', { name: 'Switch' }).click();

      }else{
        console.error(`No se encontró la fila con el ID ${idBuscado}`);
      }
        
    });



