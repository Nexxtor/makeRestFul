# Crear un RestFul con Express y MongoDB

# Contenido
- [Crear un RestFul con Express y MongoDB](#crear-un-restful-con-express-y-mongodb)
- [Contenido](#contenido)
  - [Definición](#definici%c3%b3n)
    - [Ventajas](#ventajas)
    - [Desventajas](#desventajas)
- [Objetivo](#objetivo)
- [Recursos necesarios](#recursos-necesarios)
- [Preparando el entorno](#preparando-el-entorno)
  - [Estructura de directorio](#estructura-de-directorio)
  - [Una tonelada de librerías I](#una-tonelada-de-librer%c3%adas-i)
- [Iniciando el proyecto](#iniciando-el-proyecto)
  - [Instalación de express-generator](#instalaci%c3%b3n-de-express-generator)
- [Creación de proyecto](#creaci%c3%b3n-de-proyecto)
- [Conectando Express con MongoDB](#conectando-express-con-mongodb)
  - [Conceptos básicos de MongoDB](#conceptos-b%c3%a1sicos-de-mongodb)
  - [ODM... ¿qué?](#odm-%c2%bfqu%c3%a9)
  - [Mongoose](#mongoose)
  - [Instalando Moongose](#instalando-moongose)
  - [Conexión con el servidor de MongoDB](#conexi%c3%b3n-con-el-servidor-de-mongodb)
    - [Promesas VS Callbacks](#promesas-vs-callbacks)
  - [Definiendo modelos en Mongoose](#definiendo-modelos-en-mongoose)
    - [Modelo User](#modelo-user)
    - [Modelo Post](#modelo-post)
- [Creando controladores](#creando-controladores)
  - [Creación UserController](#creaci%c3%b3n-usercontroller)
    - [Buscar un usuario](#buscar-un-usuario)
    - [Listar usuarios](#listar-usuarios)
    - [Creación de un usuario](#creaci%c3%b3n-de-un-usuario)
    - [Actualización de un usuario](#actualizaci%c3%b3n-de-un-usuario)
    - [Eliminar un usuario](#eliminar-un-usuario)
  - [Creación de PostController](#creaci%c3%b3n-de-postcontroller)
  - [Incompleto](#incompleto)
- [Añadiendo rutas](#a%c3%b1adiendo-rutas)
- [Pruebas REST](#pruebas-rest)

## Definición

Un RESTFul API permite realizar peticiones HTTP de tipo GET, PUT, POST y DELETE; en palabras más simples, es una aplicación que permite consultar y manipular recursos a través de un estándar de comunicación, por ejemplo, si queremos obtener todos los artículos de una tienda en línea, bastaría con consultar la url */article* con el metodo GET, si se deseara la información completa de un artículo en específico, */article/1*, y así sucesivamente. 

Un REST tiene una configuración uniforme de acceso a recursos, no guarda el estado de las operaciones, guarda información en cache y puede estar compuesta por varias capas en el servidor.

### Ventajas

1. Separación del Cliente y el Servidor.
2. Independencia de tecnologías y lenguajes.
3. Fiabilidad, escalabilidad y flexibilidad.
4. Mejora en la experiencia de usuario.
5. REST requiere menos recursos del lado del servidor.

### Desventajas

1. Requiere tiempo adaptar proyectos WEB tradicionales.

# Objetivo

En este pequeño artículo pasaremos por el proceso de construcción de un REST API para un blog personal, que tiene como objetivo estar disponible a futuro en diferentes plataformas móviles, web y de escritorio (¡Un proyecto, pequeño! ;) ).

# Recursos necesarios

- NodeJs, npm
- MongoDb
- VS Code
- ¡Y una tonelada de librerías!

En este artículo no está incluido el proceso de instalción de los componetes nodejs y mongodb, ya que existe una cantidad extraordinaria de tutoriales y documentación en la Web.


# Preparando el entorno

Para poder acelerar la creación del RESTFull utilizaremos un microframework llamado express que nos facilita la creación de Aplicaciones Web y API con un rendimiento adecuado, y con una tonelada de "complementos" que nos ahorran trabajo y nos permiten concentrarnos en el producto.

Para crear una aplicación usando express basta con importar la libreria, configurar el puerto donde escuchará, y finalmente establecer que hacer en caso de acceder a alguna ruta del sitio. En el siguiente código se puede observar la estructura en una página web que muestra una de las frase más conocidas en el mundo del desarrollo: "Hello World!".

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

Para poder ejecutar el código anterior:
1. Crear una carpeta con el nombre de **example**.
2. Abrir la carpeta **example** en una **terminal**.
3. Inicia un proyecto o paquete con npm y llenar todos los datos (Por el momento basta con dar aceptar a todo).
    ~~~
    npm init
    ~~~
4. Instalar express en el proyecto:

    ~~~
    npm install express
    ~~~

    Esto creará una carpeta **node_modules** donde se instalarán todas las librerías que usaremos y es donde está instalado express, hasta este punto. Es importante mencionar que esta capeta es diferente para cada proyecto.

5.  Iniciar el servidor web:

    ~~~
    node app.js
    ~~~

6. Acceder a http://localhost:3000 y obtener como resultado: ![ScreenShoot](asset/images/example.png "Simple express server")

De este código se pueden resaltar unos cuantos conceptos:

1. Express permite configurar que hará el sitio, acorde al metodo **HTTP** y la **PATH** consultada. En la línea de código:
    ~~~  
    app.get('/', (req, res) => res.send('Hello World!')) 
    ~~~
    Se le dice a express que, para el metodo HTTP **GET** y el PATH **/** (el root del sitio), ejecute la función indicada, y que express la entiende como middleware.
    
2. Los middleware en su forma más básica reciben como parámetros la información de toda la peticion HTTP en la variable **req**, y utiliza la varaible **res** para crear el objeto HTTP que se enviará al usuario.

## Estructura de directorio

Antes de empezar con el REST es necesario definir adecuadamente un estructura de directorios que nos permita aplicar patrones de diseño de software sostenibles. En otras palabras, se debe organizar el código para que sea fácil de modificar, reutilizar y que cualquier otro desarrollador pueda meter mano sin tener que refactorizar, porque no entiende nada de lo que hemos escrito. Con este fin los directorios a utilizar serán:

1. **Models**: Se almacenarán los modelos que permitirán manipular la base de datos con relativa facilidad. 
2. **Controllers**: Aquí se deben ubicar las funciones o middlewares que sepan responder a las peticiones.
3. **Routes**: Se ubicarán los archivos que permitan contectar los controllers con los **path** y metodos **HTTP**; en otras palabras, qué controladores o middlewares ejecutar para una **petición HTTP**.
4. **Middlewares**: Almacenará las funciones o middlewares, que se encargarán de examinar las **peticiones HTTP** antes o después de ejecutar un controlador, con el fin de preprocesar o postprocesar los datos de estas peticiones, por ejemplo, la autentificación de usuarios, validación de datos entre otros.

Dado que es muy probable que utilizemos la misma base de código para crear la Web del blog añadiremos las carpetas.

5. **Public** Se almacenan todos los archivos públicos como CSS, JS, Imágenes, vídeos.
6. **Views**  Se ubican archivos que serán utilizados como plantillas para generar HTML de manera dinámica.

## Una tonelada de librerías I

Que el título no intimide, pues en esta sección seleccionaremos algunas librerías o middleware hechos por la comunidad. Estos nos ayudarán a tener una mejor estructura de desarrollo y/o facilitarnos tareas repetitivas.

1. **Express**: Nuestro Web framework.
2. **Http-errors**: Un pequeño paquete para crear una página de errores con facilidad, respetando la estructura de express para manejar errores.
3. **Morgan**: Es un paquete que nos permite llevar un registro (logs) de las peticiones que realizan a nuestra aplicación, estos log son muy útiles, para detectar errores, comportamientos maliciosos y demás.
4. **Debug**: Es una librería que nos permitirá escribir mensajes en consola de una manera sistemática, la cual podremos activar o desactivar según las variables de entorno de sistema; por ejemplo, podremos desactivar los mensajes de un módulo o de varios.
5. **Cookie-parser**: Middleware que nos expondrá las cookies que se manejan en una web tradicional en la varible **req**, además nos permite configurar la forma de cifrar las cookies.
6. **Node-sass-middleware**: Un pequeño middleware que compilará por nosotros; los archivos de estilos escritos en sass, para cuando estemos creando una Web tradicional.
7. **Pug**: Un pequeño manejador de plantillas HTML que permite escribirlo de una manera muy sencilla y ejecutar código js como condicionales, bucles y demás funciones.

Todas estas librerías o paquetes son compatibles con express, lo que queda ahora es instalar y configurar cada una de ellas. Además de asegurarnos de leer desde las variables de entorno las configuraciones que pueden variar cuando la aplicación se pasa a entorno de producción, además de verificar que la aplicación posee los permisos adecuados para su ejecución.

Esta es una tarea repetitiva que se realiza en cada nuevo proyecto. Algo realmente no productivo, por eso utilizaremos un paquete más que sirve para crear proyectos express, con estructura de directorio adecuado y con la mayoría de pormenores contemplados. 

8. **express-generator**: nos permite crear el código base de proyectos express.

# Iniciando el proyecto

## Instalación de express-generator

Para poder generar un proyecto base de express con el paquete **express-generator** se debe instalar de manera global usando **npm**.
~~~BASH
npm install express-generator -g
~~~

Ahora desde cualquier terminal del sistema podrás ejecutar:
~~~
express -h
~~~
Dando como resultado la ayuda del comando:

~~~bash
  Usage: express [options] [dir]

  Options:

        --version        output the version number
    -e, --ejs            add ejs engine support
        --pug            add pug engine support
        --hbs            add handlebars engine support
    -H, --hogan          add hogan.js engine support
    -v, --view <engine>  add view <engine> support (dust|ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
        --no-view        use static html instead of view engine
    -c, --css <engine>   add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git            add .gitignore
    -f, --force          force on non-empty directory
    -h, --help           output usage information
~~~


# Creación de proyecto

Para crear un proyecto con las características que describimos antes ejecutaremos el comando:

~~~
express --git -e --pug -c sass blog 
~~~
Que nos creará una carpeta llamada **blog** con la estructura de directorios deseada (casi completa) y con una configuración base de las librerías y rutas para express ![ExpressGenerator](asset/images/estructura_express_generator.png)

Probablemente en el directorio no se encuentre la carpeta **node_modules**, y es por que hace falta ejecutar el comando de instalación de las librerías definidas en el archivo **package.json**  que contiene las dependencias de nuestro proyecto:

~~~JSON
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "node-sass-middleware": "0.11.0",
    "pug": "^2.0.4"
  }
~~~

Es hora de instalar la librerías, ejecutando desde terminal, en la carpeta del proyecto:

~~~
npm install 
~~~

Para iniciar el proyecto:

~~~
DEBUG=blog:* npm start
~~~

Y en el navegador, se obtiene: ![WelconExpress](asset/images/express_welcome.png)

Antes de seguir y programar un RestFul, se debe instalar nodemon:

~~~
npm install nodemon --save-dev
~~~

Y en el archivo **package.json**, modificar:

~~~JSON
  "scripts": {
    "start": "node ./bin/www"
  },
~~~

por esto 
~~~JSON
  "scripts": {
    "start": "nodemon ./bin/www"
  },
~~~
Esta librería sirve para reiniciar automáticamente nuestro servidor cada vez que cambiemos el código fuente. Ahora se puede ejecutar:
~~~
DEBUG=blog:* npm start
~~~

Y en consola se puede observar:
~~~js
[nodemon] 1.19.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs
[nodemon] starting `node ./bin/www`
  blog:server Listening on port 3000 +0ms
~~~

# Conectando Express con MongoDB

MongoDB es un sistema de base de datos NoSQL orientado a documentos. Estos documentos son almacenados en BSON, que es una representación binaria de JSON. Este tiene soporte nativo para ser conectado desde diferentes lenguajes de programación, entre ellos, nodejs :).

A su vez express permite integrar fácilmente una gran lista de bases de datos, entre ellas mongodb. Para poder conectarlo es necesario instalar el driver en el proyecto.

Por otro lado, utilizaremos un ODM, es decir, una librería de modelado, que nos permita manipular la base de datos sin necesidad de conocer mongodb a fondo y facilitará tareas repetitivas, pero antes de utilizarlo les presento un código de ejemplo de mongodb con express de manera manual.

Instalación del Driver de MongoDB:
~~~
npm install mongodb
~~~

Código fuente de conexión a una base de datos mongo y la obtención de todos los documentos de la colección **mammals**.

~~~JS
var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/animals', function (err, client) {
  if (err) throw err

  var db = client.db('animals')

  db.collection('mammals').find().toArray(function (err, result) {
    if (err) throw err

    console.log(result)
  })
})

~~~

## Conceptos básicos de MongoDB

Para poder utilizar MongoDB, es necesario entender algunos conceptos:

- Un **documento (document)** es la unidad básica de datos en MongoDB, normalmente equivale al concepto de fila en una base de datos relacional.
    - Es un conjunto de claves con valores asociados.
    - Su representación varía de acuerdo al leguaje que se utilice.
    - En JavaScript tiene la forma de un JSON.
    - Las Clave de los documenteos deben ser String.
    - No deben utilizarse caracteres especiales como '$' y '.' en las claves y además no pueden iniciar con '_'.
    - Las claves son sensible a mayúsculas.
    - Todo documento tine una clave _id asignada automáticamente y única en toda la colección.
    - Las claves no se pueden duplicar.
    ~~~JSON
        {
            "name": "nestor",
            "lastname": "aldana",
            "email": "naldana@uca.edu.sv",
            "random": 1
        }
    ~~~
- Una colección (collection) puede ser considerada como una tabla en una base de datos relacional.
  - Es identificada por un nombre.
  - Permite el uso de un esquema libre.
    - Esquema libre significa que los documentos de una misma colección pueden tener estructuras diferentes. Por ejemplo, estos dos documentos pueden formar parte de la misma colección:
    ~~~json
        {
            "name": "nestor",
            "lastname": "aldana",
            "email": "naldana@uca.edu.sv",
            "random": 1
        }

        {
            "fullname": "Douglas Hernandez"
        }
    ~~~
    - Lo anterior no es recomendable, ya que podría ser un infierno manejar diferentes estructuras, pero con la práctica se podrá entender que esta flexibilidad bien manejada aporta mucha utilidad
    -  Se pueden organizar colecciones en subcolecciones utilizando namespaces separados por el caracter punto. Por ejemplo si tenemos un blog podemos tener una colección **blog.posts** y otra colección **blog.autores**.

- Una sola instancia de MongoDB puede alojar múltiples bases de datos independientes, que pueden tener sus propias colecciones y permisos.

 ## ODM... ¿qué?

Normalmente cuando se maneja una base de datos, en un aplicación hay tareas repetitivas que controlar como la inserción, la búsqueda, la conexión, evitar inyección de código malicioso, mapear los datos de la base a modelos sencillos de controllar por nuestra aplicación. Estas tareas y más son las que conforman normalmente un ORM (Object-Relational mapping). 

Los ORM son utilizados con bases de datos SQL y entre algunos de ellos están:

- Propel (PHP).
- Hibernate (Java).
- Sequelize (NodeJs).
- ADO. NET Entity Framework (C#).
- Sequelize (NodeJs).

Un ODM u Object Document Mapper al igual que ORM proporciona una utilidad alta para la manipulación de base datos ahorrando tiempo y dolores de cabeza.

## Mongoose

Mongoose es un ODM que permite definir objetos tipados para asignar a un documento MongoDB, de manera global y sencilla dentro de nuestra APP, las definiciones de esquemas (Schema) para mongoose son las que almacenaremos en la carpeta **models**.

Mongoose permite definir esquemas utilizando tipos de datos llamados SchemTypes, es necesario aclarar que esto es algo diferente a solamente tipos de datos, es un objeto de configuración, además los plugins para mongoose son capaces de modificar y extender las definiciones de tipos, por defecto se encuentran disponibles:

1. String
2. Number
3. Date
4. Buffer
5. Boolean
6. Mixed
7. ObjectId
8. Array
9. Decimal128
10. Map

Cada SchemaType permite definir:

1. Valor predeterminado.
2. Función de validación.
3. Definir el campo como requerido.
4. Función **get** para procesar el dato antes de retornarlo en una petición.
5. Acciones para manipular los datos antes de guardarlos en la base.
6. Definir índices.

Los SchemaType permiten definir algunas otras propiedades, es recomendable consultar cada uno de ellos en la documentación de mongoose. A continua
ción un ejemplo de definir una **Thing**:

~~~JS
// Definir las propiedades de un documento de mongoDB usando mongoose
var schema = new Schema({ // El objeto Schema pertenece a mongoose
  name:    String, // SchemType
  binary:  Buffer,
  living:  Boolean,
  updated: { type: Date, default: Date.now }, // SchemaType personalizando opciones
  age:     { type: Number, min: 18, max: 65 },
  mixed:   Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  decimal: Schema.Types.Decimal128,
  array: [],
  ofString: [String],
  ofNumber: [Number],
  ofDates: [Date],
  ofBuffer: [Buffer],
  ofBoolean: [Boolean],
  ofMixed: [Schema.Types.Mixed],
  ofObjectId: [Schema.Types.ObjectId],
  ofArrays: [[]],
  ofArrayOfNumbers: [[Number]],
  nested: {
    stuff: { type: String, lowercase: true, trim: true }
  },
  map: Map,
  mapOfString: {
    type: Map,
    of: String
  }
})

// Finalmente se guarda la definición anterior como Thing

var Thing = mongoose.model('Thing', schema);
~~~

## Instalando Moongose

Primero acceda desde terminal a la carpeta **blog** creada con **express-generator** y ejecutar:

~~~
npm install mongoose --save
~~~

Con esto se tendrá disponible la librería en todo el proyecto, no esta de más comparar que en el archivo package.json se muestre claramente la dependencia, y hasta el momento el archivo debe verse:

~~~JSON
{
  "name": "blog",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "nodemon ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "mongoose": "^5.7.9",
    "morgan": "~1.9.1",
    "node-sass-middleware": "0.11.0",
    "pug": "^2.0.4"
  },
  "devDependencies": {
    "nodemon": "^1.19.4"
  }
}
~~~

## Conexión con el servidor de MongoDB

En el archivo **app.js**  hacer le siguiente import:

~~~JS
var mongoose = require('mongoose');
~~~

Ahora para conectar con la base es necesario ejecutar el metodo **connect**, mongoose nos permite dos opciones, usando el concepto de callbacks o Promises.

Como este artículo esta diseñado para comprender la mayoría de conceptos la siguiente sección es sobre promesas y callbacks. Saltarse la sección no causará ningún problema a futuro, pero hará más comprensible trabajar con JS.

---

### Promesas VS Callbacks

Todas las técnicas que se utilizan en las soluciones de software están dirigidas a escribir menos código, hacerlo altamente legible, reutilizable. Los callback y promises son esfuerzos de poder lograrlo.

Un callback en pocas palabras es una función que se pasa por parámetro a otra función, el callback es pasado con el objetivo de ejecutar un código cuando la tarea solicitada termine.

El siguiente código obtiene datos de un formulario y los envía a un servidor y muestra el estado de la respuesta:

~~~JS
document.querySelector('form').onsubmit = formSubmit

function formSubmit (submitEvent) {
  var name = document.querySelector('input').value
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, postResponse) // PostResponse es usado como callback
}

function postResponse (err, response, body) {
  var statusMessage = document.querySelector('.status')
  if (err) return statusMessage.value = err
  statusMessage.value = body
}
~~~

Es de notar como la función **postResponse**  es pasada como parámetro a la función **request** . Cuando se utilizan callbacks es necesario mantener el código simple y legible, intentar dar nombre a la mayoría de funciones y no parsarlas directamente como parámetros, al no cumplir esto, lo que se logra es una contradicción de nuestros objetivos. La página http://callbackhell.com/ de donde se estrajo el código anterior, brinda consejos para no crear un infierno de callbacks y utilizarlos de manera beneficiosa.

Las promesas hacen uso del concepto de callbacks pero nos lo presenta de una manera diferente y no añaden la función de concatenar acciones. Primero las Promises son creadas a partir de un objeto JS:

~~~JS
var myPromise = new Promise(function (resolve, reject) {
    if (2 > 2) {
        resolve(':)');
    } else {
        reject(':(');
    }
});
~~~

y como se puede observar en el código el objeto Promesa recibe una función con dos parámetros **resolve** y **reject**, para poder ejecutar la promesa se debe usar el método then y enviar ambos parámetros solicitados:

~~~JS
myPromise.then(function (result) {
    // Resolve callback.
    console.log(result); 
}, function (result) {
    // Reject callback.
    console.error(result);
});
~~~

Hasta el momento todo parece solo una forma de complicar el conceptos de callbacks, pero lo útil es usar promesas en cadena, por ejemplo:

~~~JS
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise(function(resolve, reject) {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  }))
  // triggers after 3 seconds
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));
~~~

En el código anterior podemos ver cómo después de cada **then** inmediatamente se manda a ejecutar otro, el concepto de esto es hacer una cadena de tareas que se deben ejecutar una tras de otra, hasta que las tareas anteriores se resuelvan. En el caso del ejemplo, la primera tarea es obtener un usario en formato json desde la url indicada a fetch luego (**then**) el cuerpo de la respuesta es convertida a json, del objeto convertido solicita al api de github información sobre el usuario, cuando la información ya está disponible es convertida a json, luego se crea (por ejemplo) una promesa que añade la imagen de usuario de github a nuestra web y finalmente muestra el mensaje de tarea completa.

El código escrito arriba permite leer de manera secuencial tareas que suceden de forma asíncrona, es decir, tareas que no es posible calcular el tiempo que les tomará terminar o incluso si lo harán. 

Es de notar que a ninguna de las llamadas a **then** se le envió el segundo parámetro, que indica qué hacer en caso de error, para seguir manteniedo el concepto de legibilidad existe el método catch que permite definir qué hacer en caso de error.

~~~JS
myPromise
  .then(function (result) {
      // Resolve callback.
      console.log(result); 
  }).catch(function (result) {
      // Reject callback.
      console.error(result);
  });
~~~

En conclusión ambos conceptos nos sirven para ejecutar tareas asíncronas y mantener el orden en el código.

---

Para conectarse con moongosee podemos usar Promise o callback:

~~~JS

// Callback 

mongoose.connect(uri, options, function(error) {
 
// Si hay error estará presente en el parámetro error
 
});
 
// O promise
 
mongoose.connect(uri, options).then(
 
() => { /** Conexión lista */ },
 
err => { /** Error de conexión */ }
 
);
~~~

Ambas opciones requieren de una URI y opciones para la conexión. La URI de conexión es de mala práctica quemarla en el código, se utilizara un archivo **.env** para guardar parámetros de configuración para nuestra app. Para que las variables de entorno definidas en ese archivo pasen a estar disponibles desde **process** es necesario instalar la librería **dontenv**.

~~~
npm install dotenv
~~~

Luego es necesario crear el archivo **.env** en la carpeta blog con el siguiente contenido:

~~~
  MONGO_URI=mongodb+srv://user:password@localhost:27017/db
  PORT=3000
  DEBUG=blog:*
~~~

Luego en el archivo  **bin/www** añadir en la primera línea:

~~~JS
require('dotenv').config();
~~~

En el archivo **app.js** asegurar importar mongoose y la librería debug para mostrar mensajes de debug:

~~~JS
var mongoose = require('mongoose');
var debug = require('debug')('blog:database');
~~~

Y además añadir la conexión antes de la línea:

~~~ JS
var app = express(); 
~~~

usando el siguiente código:

~~~JS
// Conect to database

mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true 
  })
  .then(() => {
    debug("success Connected to database")
  })
  .catch((err) => {
    debug(err);
    process.exit(1);
  });
~~~

Recuerda cambiar el valor de **MONGO_URI** según tu servidor, en el archivo **.env**
Si la URI de conexión es correcta y se han escrito todos los cambios hasta el momento, al ejecutar:

~~~
npm start
~~~

Obtendremos:
~~~js
> nodemon ./bin/www

[nodemon] 1.19.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
  blog:server Listening on port 3000 +0ms
  blog:database success Coneccted to database +491ms
~~~

## Definiendo modelos en Mongoose

Antes de definir los modelos, es buen punto para recordar que el objetivo es hacer un api de acceso para un blog, en el cual almacenaremos, usuarios, post y comentarios.

Los usuarios pueden escribir post y hacer comentarios, además almacenaremos:

1. Username.
2. Firts name.
3. Last name.
4. Email.
5. Password.
6. Fecha de creación.
7. Fecha de actualización.

Del Post almacenaremos:

1. Título.
2. Autor.
3. Comentarios.
   1. Autor.
   2. Contenido.
4. Contenido.
5. Etiquetas.
6. Fecha de creacción.
7. Fecha de modificación.
8. Estado (borrador, publicado, privado).

Como podrán notar tendremos dos colecciones: usuarios y posts, los comentarios serán guardados como un subdocumento.

### Modelo User

Para definir los modelos, empezaremos por los usuarios creando en la carpeta model el archivo **user.js** con el siguiente código:

~~~JS
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    login_count: Number
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
~~~

Este código importa mongoose, mongoose funciona con una sola instancia, esto quiere decir que para cualquier modelo nuestra conexión a la base estará disponible de manera transparente.

Las propiedades username, email, password han sido definidas con el type String además como requerido, esto es equivalente a NOT NULL en bases de datos relacionales.

Además notar el segundo parámetro del pasado al Objeto Schema, este nos permite definir opciones para que mongoose nos ayude con tareas comunes, en este caso con la definición de las propiedades createdAt and updatedAt, que guardan la hora de creación y modificación de nuestro usuario, un usuario insertado en la base de datos se verá así:

~~~JSON
{
  "_id": {
    "$oid":"5dc9bb1db6e7a85a62fd95e5"
  },
  "username":"next94",
  "first_name":"nestor",
  "last_name":"aldana",
  "email":"nestor.aldana1@gmail.com",
  "password":"hashed_string",
  "login_count": {
      "$numberInt":"1"
  },
  "createdAt": {
    "$date": {
      "$numberLong":"1573501725325"
    }
  },
  "updatedAt": {
    "$date": {
      "$numberLong":"1573501725325"
    }
  },
  "__v":{
      "$numberInt":"0"
  }
}
~~~

Para Insertar un documento con moongose, es necesario importar el modelo, luego crear un nuevo objeto y finalmente ejecutar el metodo **save**.

~~~JS

var User = require("./models/user"); // Importa modelo

// Crear un nuevo usuario pasando un objeto con los valores de cada propiedad
new User({ 
  username: "next94",
  first_name: "nestor",
  last_name: "aldana",
  email: "nestor.aldana1@gmail.com",
  password: "true",
  login_count: 1

}).save(); // ejecutar el método save
~~~

### Modelo Post

Antes de continuar con la manipulación de datos es necesario definir el modelo post, en el archivo **post.js** dentro de la carpeta models, con el siguiente código:

~~~JS
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: { type: String, require: true }
    }],
    tags: [
        String
    ],
    state: {
        type: String,
        enum: ['draft', 'published', 'private']
    },
    content : {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);
~~~

Para poder referenciar, otros documentos, al estilo base de datos relacional podemos configurar un objeto como de tipo referencias, además dando el nombre del modelo a referenciar:

~~~JS
author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
}
~~~

Y si deseamos limitar a una lista de valores, el contenido de una propiedad, podemos hacerlo definiendo una propiedad enum:

~~~ js
state: {
    type: String,
    enum: ['draft', 'published', 'private']
}
~~~

En la base de datos este objeto, sin comentarios, se ve almacenado así:

~~~json
{
  "_id":
  {
    "$oid": "5dcd7cabc31d4665204f10ec"
  },
  "tags":[
      "tag1",
      "tag2",
      "tag3"
  ],
  "title":"Post 1",
  "author": {
      "$oid":"5dcd6f9cfc7e774305670dd9"
  },
  "state":"draft",
  "content":"Contenido",
  "comments":[],
  "createdAt": {
    "$date":{
      "$numberLong":"1573747883318"
    }
  },
  "updatedAt": {
    "$date":{ 
      "$numberLong":"1573747883318"
    }
  },
  "__v":{
    "$numberInt":"0"
  }
}
~~~

# Creando controladores

En los controladores se programan las acciones que se van a realizar, como por ejemplo crear, guardar, actualizar e eliminar un recurso. Este sera el único lugar de nuestro aplicación que debe tener acceso a la base de datos y lo tiene que hacer utilizando los modelos definidos anteriormente.

Los controladores se suelen crear con la idea que son responsables de administrar solamente un recurso. En este caso serán necesario crear dos controladores: **UserController** y **PostController**

Los controladores se ubicaran en nuestro proyecto en la carpeta **controllers** y nuestra carpeta de proyecto tendra la siguiente estructura:

![Estructura](asset/images/struct_proyect.png)

Crearemos primero el archivo **UserController.js** y dentro definiremos un modulo de node.js. Para crear un modulo, solamente es necesario definir que exportaremos del archivo, para que esté disponible para cualquiera que importe nuestro modulo. Por ejemplo si:

~~~js
exports.name = () => { return "dato" }
~~~

la función estara disponible con el nombre **name**. si escribimos:

~~~js
module.exports = { propiedad: function() {} }
~~~

exportamos un objeto completo, cada propiedad de este objeto es accesible por su nombre desde otro archivo.

## Creación UserController

En el controlador de Usuario definiremos 5 acciones:

1. Buscar un usuario por su **username**
2. Obtener todos los usuarios
3. Crear un usuario
4. Actualizar un usuario existente
5. Eliminar un usuario

Estas tres acciones seran solicitadas a traves de peticiones **HTTP** y a un **path** en específico así:

|    Acción     | Método |       PATH       |                                             OPTIONS                                              |
| :-----------: | :----: | :--------------: | :----------------------------------------------------------------------------------------------: |
|    Buscar     |  GET   | /users/:username |                                             username                                             |
| Obtener todos |  GET   |      /users      | Query size, page. size: cantidad de usuarios, page: número de la página a mostrar. sortby y sort |
|     Crear     |  POST  |      /users      |                                            data User                                             |
|  Actualizar   |  PUT   | /users/:username |                                             username                                             |
|   Eliminar    | DELETE | /users/:username |                                             username                                             |

Para lograr las acciones en el archivo **UserController.js** importar:

~~~js
var User = require('../models/user');
var debug = require('debug')('blog:user_controller');
~~~

### Buscar un usuario

Para buscar un usuario, lo haremos a través del modelo usuario ejecutando el metodo **findOne**, que dado un criterio de busqueda nos devuelve el primer elemento que encuentre, además en las opciones de **findOne** indicaremos que no queremos seleccionar el **password** ni **login_count** por motivos de seguridad. 

La función a declarar tendrá tres parámetros:

1. **req** Contiene la información de la petición **HTTP**.
2. **res** Nos permite construir una respuesta **HTTP**.
3. **next** Callback que permitira invocar al siguiente **middleware**, lo usaremos solamente en dado caso suceda un error, para que le **middleware** de error se encargue de manejarlo.

El código queda así:

~~~js
// Search a one user y database
module.exports.getOne = (req, res, next) => {
    debug("Search User", req.params);
    User.findOne({
            username: req.params.username
        }, "-password -login_count")
        .then((foundUser) => {
            if (foundUser)
                return res.status(200).json(foundUser);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}
~~~

El primer parámetro de **findOne** recibe un objeto con las opciones de búsqueda.
El **username** estara ubicado en el **PATH** de consulta **/users/:username** para acceder a ese parámetro
utilizaremos la propiedad **params**

~~~js
{  username: req.params.username }
~~~

donde cada propiedad de ese objeto debe llamarse igual a la propiedad por la que se quiere buscar, en este caso **username**.
Como segundo parametro se encuentra una cadena de texto, que nos permite indicar que propiedades se desean seleccionar del objeto **user**, además se puede indicar cuales propiedade no se desean seleccionar,esto se logra al anteponer un guión antes de la propiedad. Las propiedades deben ir separadas por espacio.

~~~js
"-password -login_count"
~~~

Por último se le asigna a la **Promise** retornada por **findOne** la acción de: Si encuentra el usuario, retornalo en formato **JSON**, si el **user** no existe retorna código **404** con **null**,
~~~js
if (foundUser)
    return res.status(200).json(foundUser);
else
    return res.status(400).json(null)
~~~

además se indica que en caso de error se ejecute el siguiente **middleware**:

~~~js
.catch(err => {
    next(err);
});
~~~

### Listar usuarios

Igual que la busqueda de un usuario, tendremos tres parámetros, solo que esta vez las opciones de filtro de usuarios las obtendremos de la **Query** especificada en la **URL**.
La **query** esta conformado por clave-valor indicados al final de la URL con el simbolo **?** así:

~~~
/users/?param=value
~~~

y sí se desea más de un parámetro es necesario usar el simbolo **&**:

~~~
/users/?param1=value1&param2=value2
~~~

En estas opciones permitiremos el uso de paginación. La paginación hace referencia mostrar los datos por trozos (**chuncks**) por ejemplo si la base de datos cuenta con mil usuarios o más, la transferencia de esta información podría complicar el consumo de datos de las aplicaciones web o móviles. Por ese motivo usaremos la configuración predeterminada de retonar de 10 en 10 los usuarios y ordenados por su fecha de creación de manera descendente, es decir, los usuarios más nuevos primero.

Para permitir al usuario cambiar la configuración por defecto, leeremos de **Query** los datos:

1. size: indica el tamaño de la página.
2. page: indica la página que desea obtener.
3. sortby: propiedad por la cual se ordena.
4. sort: criterio de orden.

Todos los parámetos son totalmente opcionales. Nuestra función de buscar **todos** tendrá la siguiente forma:

~~~js
module.exports.getAll = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    var sortProperty = req.query.sortby || "createdAt",
        sort = req.query.sort || "desc";

    debug("Usert List",{size:perPage,page, sortby:sortProperty,sort});

    User.find({}, "-password -login_count")
        .limit(perPage)
        .skip(perPage * page)
        .sort({ [sortProperty]: sort})
        .then((users) => {
           return res.status(200).json(users)
        }).catch(err => {
            next(err);
        })

}
~~~

Primero definimos el tamaño de la página y la página que se quiere obtener, por defecto un tamaño de  10 y la página 0

~~~js
var perPage = Number(req.query.size) || 10,
    page = req.query.page > 0 ? req.query.page : 0;
~~~

luego obtemos la propiedad para ordenar y el criterio

~~~js
var sortProperty = req.query.sortby || "createdAt",
    sort = req.query.sort || "desc";
~~~

que por defecto es la fecha de creación y un orden descendente

### Creación de un usuario

Para crear un usuario, lo haremos a través del método **POST** lo que hara que en la propiedad **req.body** estarán disponibles los datos a almacenar. Lo primero que haremos es buscar sí el usuario que se desea crear existe previamente, de existir generaremos el error:  "El usuario ya existe" , sino existe almacenaremos los datos. Veremos luego la forma adecuada de almacenar la contraseña de manera segura.

~~~js
module.exports.register = (req, res, next) => {
    debug("New User", {
        body: req.body
    });
    User.findOne({
            username: req.body.username
        }, "-password -login_count")
        .then((foundUser) => {
            if (foundUser) {
                debug("Usuario duplicado");
                throw new Error(`Usuario duplicado ${req.body.username}`);
            } else {
                let newUser = new User({
                    username: req.body.username,
                    first_name: req.body.firts_name || "",
                    last_name: req.body.last_name || "",
                    email: req.body.email,
                    password: req.body.password /*TODO: Modificar, hacer hash del password*/
                });
                return newUser.save(); // Retornamos la promesa para poder concater una sola linea de then
            }
        }).then(user => { // Con el usario almacenado retornamos que ha sido creado con exito
            return res
                .header('Location', '/users/' + user._id)
                .status(201)
                .json({
                    username: user.username
                });
        }).catch(err => {
            next(err);
        });
}
~~~

Para almacenar un usuario es necesario crear un objeto **user** a partir del modelo, de la siguiente forma:

~~~js
let newUser = new User({
    username: req.body.username,
    firts_name: req.body.firts_name || "",
    last_name: req.body.last_name || "",
    email: req.body.email,
    password: req.body.password /*TODO: Modificar, hacer hash del password*/
});
~~~

Luego ejecutaremos el método **save** y retornamos la **Promise** para permitir concatenar **Promise**

~~~js
return newUser.save();
~~~

La **Promise** que concatenaremos es la que se ejecuta cuando el usuario fue almacenado el la base de datos:

~~~js
.then(user => { // Con el usario almacenado retornamos que ha sido creado con exito
    return res
        .header('Location', '/users/' + user._id)
        .status(201)
        .json({
            username: user.username
        });
})
~~~

El estado de respuesta de la petición usara el código **201 Created** que indica que la solicitud ha tenido éxito y se ha creado el recurso en el sistema.

### Actualización de un usuario

Para actualizar un usuario utilizaremos el método **PUT** que semanticamente esta destinado a permitir actualizar cada uno de los campos de nuestro usuario. Cuando el usuario este actualizado retornaremos el nuevo documento, en dado caso no sea posible actualizar por un **username** incorrecto, devolvermos **null**.

~~~js
module.exports.update = (req, res, next) => {
    debug("Update user", {
        username: req.params.username,
        ...req.body
    });

    let update = {
        ...req.body
    };

    User.findOneAndUpdate({
            username: req.params.username
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });
}
~~~

Al estar en un método **PUT** los datos podrán ser accesible desde **req.body**, usaremos esos datos para crear un objeto con los nuevos valores de nuestro usuario:

~~~js
    let update = {
        ...req.body
    };
~~~

Los tres puntos, le dicen a **JS** que tome cada propiedad del **req.body** y lo guarde como una propiedad del objeto update, practicamente copiamos el objeto.

Luego buscamos en la base de datos con el **username** indicado en el **PATH** de la petición. Configurando el método para cuando termine de actualizar, nos retorne el objeto nuevo en la variable **updated**
~~~js
    User.findOneAndUpdate({
            username: req.params.username
        }, update, {
            new: true
        })
~~~

Cuando la tarea se complete tendremos dos casos: 

1. Se encontro y actualizo.
2. No se encontro.

Para el primer caso en el  **callback** retornamos el objeto **update** y código de esta **200** y en el segundo caso un código sw error **400** y **null**.

~~~js
.then((updated) => {
    if (updated)
        return res.status(200).json(updated);
    else
        return res.status(400).json(null);
})
~~~

### Eliminar un usuario

Para eliminar un usuario utilizaremos el método **delete** y en el **PATH** necesitaremos el **username**, cuando la operación sea existosa retornaremos el usuario eliminado y el código **200**, en el caso que ya este eliminado el recurso retornaremos el código **404**:

~~~js
module.exports.delete = (req, res, next) => {

    debug("Delete user", {
        username: req.params.username,
    });

    User.findOneAndDelete({username: req.params.username})
    .then((data) =>{
        if (data) res.status(200).json(data);
        else res.status(404).send();
    }).catch( err => {
        next(err);
    })
}
~~~

## Creación de PostController

Continuando con el criterio de resposabilidad única, porgramaremos todas las acciones para la modificación la manipulación de un **Post** del blog. Las acciones que permitiremos son:

1. Obtener un Post.
2. Buscar Post.
3. Obtener todos los Post.
4. Crear un Post.
5. Actualizar un Post.
6. Eliminiar un Post.
7. Agregar un comentario a un Post.

La acción de agregar un comentario, se deja fuera de los comentarios, ya se necesita verificar que el usuario que haga los comentarios exista.

| ACTION        | METHOD |      PATH      | OPTIONS                |
| :------------ | :----: | :------------: | :--------------------- |
| Buscar        |  GET   | /posts/:search | Una cadena de busqueda |
| Obtener todos |


-----
Incompleto
-----

# Añadiendo rutas

Las **rutas (routers)** son elementos que nos permiten decirle a **express**, que ejecutar de acuerdo a la petición del cliente o usuario. Para poder configurar una ruta son necesarias tres cosas:

1. Método HTTP.
2. PATH ó dirección.
3. Uno ó unos middleware a ejecutar.

Además **express** permite modularizar estas configuraciones. En este caso nos aprovecharemos de esa característica y crearemos un archivo por cada ruta principal, es decir, si nuestro sitio o **REST** es capaz de resolver las siguientes peticiones:

~~~
http://dominio.com/users
http://dominio.com/users/nestor
http://dominio.com/posts
http://dominio.com/post/30
~~~
Significa que crearemos dos archivos uno para manejar cualquier variante de **/users** con los diferentes métodos **HTTP** como:
~~~
http://dominio.com/users
http://dominio.com/users/1
http://dominio.com/users/?q=12&2
~~~

Además dentro de cada archivo asumiremos que es importado por el **main** de nuestra aplicación y configurado para trabajar con un **PATH**, esto quiere decir, que si dentro del archivo **users.js** escribimos la acción para **/** estaremos haciendo referencia a **/users**. 

Crearemos un archivo llamado **user.js** en la carpeta **router** y configuraremos:

| METHOD |       PATH        |                      ACTION                       |
| :----: | :---------------: | :-----------------------------------------------: |
|  GET   |      /users       |             mostrar todo los usuarios             |
|  GET   | /users/:username  | mostrar el usuario con el username **:username**  |
|  POST  |      /users       |     Crear un usuario con la información dada      |
|  PUT   |      /users       |   Actualizar el usuario con la información dada   |
| DELETE | /users /:username | ELiminar el usuario con el username **:username** |

Para poder lograrlo es necesario importar **express** y obtener el objeto que permite configurar rutas, además el archivo con las acciones, en nuestro caso el controlador **UsersController**.

~~~js
var express = require('express');
var router = express.Router();
var userController = require('../controllers/UserController');
~~~

Para definir la ruta de la primera acción de mostrar todos los usarios escribiremos:

~~~js
router.get('/', userController.getAll);
~~~
A través de método **get** del objeto **router** podemos definir todas las rutas para el método **HTTP** **GET**, como primer parámetro de la función, se indica que la acción **userController.getAll** se ejecutara cuando el usuario acceda a la raíz de nuestra ruta, en el caso de este archivo sera **/users** o **/users/**

Para definir una acción para rutas como:
~~~
/users/nestor
/users/user1
/users/nicj
/users/nexxtor
~~~

Es de notar que necesitaremos recuperar lo que varia en ese **PATH** si escribimos como primer parámetro de la función **get** del objeto router ***/:username***  el valor variable sera accesible para la acción a ejecutar usando la propiedad **params** así:

~~~js
req.params.username
~~~
Para lo cual dejamos preparado nuestro controlador de usuario, en la sección de creación de controladores de este artículo. Las rutas que usan el mismo método **HTTP** deben definirse de lo más especifico a lo mas general, por ejemplo:

~~~js
router.get('/:username', userController.getOne);
router.get('/', userController.getAll);
~~~

La primera es mas especifica por que permite añadir un elemento más al **PATH**, si la ruta o **PATH** se hace mas larga ese un buen criterio para definir el orden. 

Advertencia: la siguiente configuraciones de rutas no funcionarán de manera adecuada:
~~~js
router.get('/:username', userController.getByUser);
router.get('/:id', userController.getById);
~~~

la razón es: No importa si escribimos  **/nextor** o **/100** siempre se ejecutara la primera acción, ya que aunque le asignemos nombre de **username** o **id**, **express** no puede distinguir eso, lo único que permite es indicar que esa parte del **PATH** es variable. Lo correcto para dicha situación es preparar una acción adecuada en nuestro **controller**:

~~~js
router.get('/:criteria', userController.findUser);
~~~

La función **findUser** debe buscar tanto por **id** como **username**.

Para definir otros método **HTTP**, a usar basta con cambiar el nombre del método y personalizar la ruta, por ejemplo para el método **POST** y el path **/users**

~~~js
router.post('/',userController.register);
~~~

finalmente nuestro archivo ubicado en **routers/user.js** deberá verse así:

~~~js
var express = require('express');
var router = express.Router();
var userController = require('../controllers/UserController');

/* GET users listing. */
router.get('/:username', userController.getOne);
router.get('/', userController.getAll);

router.post('/',userController.register);
router.put('/:username', userController.update);
router.delete('/:username',userController.delete);

module.exports = router;
~~~

Al principio de esta sección se menciono que asumimos que dentro del archivo **routers/user.js** estamos configurando la ruta a partir de **/users** para que esto se cumpla es necesario que en el archivo **app.js** importemos nuestra configurion de rutas:

~~~js
var usersRouter = require('./routes/users');
~~~

luego decirle a **express** como deberá usarse esta configuración, para eso añadiremos:

~~~js
app.use('/users', usersRouter);
~~~

donde indicamos que la configuración de **usersRouter** sea valida a partir de **/users**, esto lo hacemos así porque permite migrar de manera rápida de **/users** a **/api/users** sin necesidad de cambiar toda la configuración del archivo **routers/user.js**.


# Pruebas REST

Ya con esto podemos probar nuestro **REST** con cualquier cliente HTTP, en este caso usaremos **POSTMAN**, que se puede descargar de https://www.getpostman.com/. 

Una vez instalado y dentro del programa:

1. Seleccionar el método **POST**.
2. En la URL escribir http://localhost:3000/users/ 
3. En la pestaña  **body** seleccionar la opción **x-www-form-urlencoded**.
4. En el editor de **Key** y **Value** agregar las claves:
   1. username:nextor
   2. first_name:Néstor Santiago
   3. last_name:Aldana Rodriguez
   4. email:nestor.aldana1@gmail.com
   5. password:password
5. Presionar el botón **enviar**, en el área de respuesta nos mostrara el **id** de objeto creado. Lo que se vera así:

![Postman](asset/images/postman.png)

