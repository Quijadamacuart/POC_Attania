import * as xlsx from 'xlsx';

// Define la interfaz en el mismo archivo
interface DatosExcel {
  username: string;
  password: string;
  testdata_identifier: string;
  [key: string]: any; // Esto permite acceso dinámico, si es necesario
}

export function leerDatosDesdeExcel(rutaArchivo: string, nombreHoja: string, idBuscado: string | number): DatosExcel | undefined {
  // console.log(rutaArchivo);
  // console.log(nombreHoja);
  // console.log(idBuscado);
  const libro = xlsx.readFile(rutaArchivo); // Lee el archivo Excel
  const hoja = libro.Sheets[nombreHoja];    // Selecciona la hoja específica
  let datos: DatosExcel[] = xlsx.utils.sheet_to_json(hoja); // Convierte la hoja en JSON

  datos.forEach((fila, index) => {
    console.log(`Fila ${index + 1}:`);
    Object.entries(fila).forEach(([clave, valor]) => {
      console.log(`  ${clave}: ${valor}`);
    });
  });

  // Limpia los nombres de las claves
  datos = datos.map(fila => {
    const filaLimpia: any = {};
    for (const clave in fila) {
      const claveLimpia = clave.trim().toLowerCase().replace(/ /g, '_');
      filaLimpia[claveLimpia] = fila[clave];
    }
    return filaLimpia;
  });

  console.log('Datos disponibles:', datos);

  // Busca por el ID normalizado
  const filaEncontrada = datos.find(fila => fila.testdata_identifier === `${idBuscado}`);
  return filaEncontrada; // Retorna la fila encontrada o undefined
 
}