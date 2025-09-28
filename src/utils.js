import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// creo rutas absolutas para evitar probles con las rutas relativas de mis archivos.
// Se hace atraves de un pequeño trozo de codgo predefinido( un snipet ) para que sea mas facil de leer
// Me va a dar una nueva variale llamada __dirname
// ahora mis rutas van a estar definidas por mi carpeta y no por el nivel de ejecucion.