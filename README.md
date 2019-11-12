# Crear un RestFul con Express y MongoDB

## RestFul API

### Definición

Un RESTFul API permite realizar peticiones HTTP de tipo GET, PUT, POST y DELETE; en palabras más simples, es una apliación que permite consultar y manipular recursos a través de un estándar de comunicación, por ejemplo, si queremos obtener todos los articulos de una tienda en línea, bastaría con consultar la url */article* con el metodo GET, si se deseara la información completa de un artículo en específico, */article/1*, y así sucesivamente. 

Un REST tiene una configuración uniforme de acceso a recursos, no guarda el estado de las operaciones, guarda información en cache y puede estar compuesta por varias capas en el servidor.

### Ventajas

1. Separación del Cliente y el Servidor
2. Independencia de tecnologías y lenguajes
3. Fiabilidad, escalabilidad y flexibilidad
4. Mejora en la experiencia de usuario
5. REST requiere menos recursos del lado del servidor

### Desventajas

1. Requiere tiempo adaptar proyectos WEB tradicionales

## Objetivo

En este pequeño artículo pasaremos por el proceso de construcción de un REST API para un blog personal, que tiene como objetivo estar disponible a futuro en diferentes plataformas móviles, web y de escritorio (¡Un proyecto, pequeño! ;) ).

## Recursos necesarios

- NodeJs, npm
- MongoDb
- VS Code
- ¡Y una tonelada de librerías!

En este artículo no está incluido el proceso de instalción de los componetes nodejs y mongodb, ya que existe una cantidad extraordinaria de tutoriales y documentación en la web.


# Preparando el entorno

Para poder acelerar la creación del RESTFull utilizaremos un microframework llamado express que nos facilita la creación de Aplicaciones Web y API con un rendimiento adecuado, y con una tonelada de "complementos" que nos ahorran trabajo y nos permiten concentrarnos en el producto.

Para crear una aplicación usando express basta con importar la libreria, configurar el puerto donde escuchará, y finalmente establecer que hacer en caso de acceder a alguna ruta del sitio. En el siguiente código se puede observar la estructura un una página web que muestra una de las frase más conocidas en el mundo del desarrollo "Hello World!"

```
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

Para poder ejecutar el código anterior:
1. Crear una carpeta con el nombre de **example**
2. Abrir la carpeta **example** en una **terminal**
3. Inicia un proyecto o paquete con npm y llenar todos los datos (Por el momento basta con dar aceptar a todo)
    ~~~
    npm init
    ~~~
4. Instalar express en el proyecto

    ~~~
    npm install express
    ~~~

    Esto creará una carpeta **node_modules** donde se instalarán todas las librerias que usaremos y es donde esta instalado express, hasta este punto. Es importante mencionar que esta capeta es diferente para cada proyecto

5.  Iniciar el servido web 

    ~~~
    node app.js
    ~~~

6. Acceder a http://localhost:3000 y obtener como resultado: ![ScreenShoot](asset/images/example.png "Simple express server")

De este código se puede resaltar unos cuantos conceptos:

1. Express permite configurar que hará el sitio, acorde al metodo **HTTP** y la **PATH** consultada. En la línea de código:
    ~~~  
    app.get('/', (req, res) => res.send('Hello World!')) 
    ~~~
    se le dice a express que, para el metodo HTTP **GET** y el PATH **/** (el root del sitio), ejecute la función indicada, y que express la entiende como middleware.
    
2. Los middleware en su forma más básica reciben como parámetros la información de toda la peticion HTTP en la variable **req** , y utiliza la varaible **res** para crear el objeto HTTP que se enviará al usuario.

## Estructura de directorio

Antes de empezar con el REST es necesario definir adecuadamente un estructura de directorios que nos permita aplicar patrones de diseño de software sostenibles. En otras palabras, se debe organizar el código para que sea fácil de módifcar, reutilzar y que cualquier otro desarrollador pueda meter mano sin tener que refactorizar, porque no entiende nada de lo que hemos escrito. Con este fin los dierectios a utilizar serán:

1. **Models**: Se almacenara los modelos que permitirán manipular la base de datos con relativa facilidad. 
2. **Controllers**: Aquí se deben ubicar las funciones o middlewares que sepan responder a las peticiones.
3. **Routes**: Se ubicarán los archivos que permintán contectar los controllers con los **path** y metodos **HTTP**; en otras palabras, que controladores o middlewares ejecutar para una **petición HTTP**
4. **Middlewares**: Almacenará las funciones o middlewares, que se encargarán de examinar las **peticiones HTTP** antes o despues de ejucuatar un controlador, con el fin de prepocesar o postprocesar los datos de estas peticiones, por ejemplo, la autentificación de usuarios, validación de datos entre otros.

Dado que es muy porbable que utilizemos la misma base de código para crear la Web del blog añadiremos la carpetas.

5. **Public** Se almacenan todos los archivos públicos como CSS, JS, Imaganes, videos
6. **Views**  Se ubican archivos que serán utilizados como plantillas para generar HTML de manera dinámica

## Un tonelada de librerías I

Que el título no intimide, pues en esta sección seleccionaremos algunas librerias o middleware hechos por la comunidad. Estos nos ayudarán a tener una mejor estrutura de desarrollo y/o facilitarnos tareas repetitivas.

1. **Express**: Nuestro Web framework.
2. **Http-errors**: Un pequeño paquete que crear una página de errores con facilidad, respetando la estrutura de express para manejar errores.
3. **Morgan**: Es un paquete que nos permite llevar un registro (logs) de las peticiones que realizan a nuestra aplicación, estos log son muy utiles, para detectar errores, comportamientos maliciosos y demás.
4. **Debug**: Es una librería que nos permitirá escribir mensajes en consola de una manera sistemática, la cual podremos activar o desactivar según las variables de entorno de sistema; por ejemplo, podremos desactivar los mensajes de un módulo o de varios.
5. **Cookie-parser**: Middleware que nos expondrá las cookies que se maneja en un web tradicional en la varible **req**, además nos permite configurar la forma de firmas las cookies.
6. **Node-sass-middleware**: Un pequeño middleware que compilará por nosostros; los archivos de estilos escrito en sass, para cuando estemos creando una Web tradicional.
7. **Pug**: Un pequeño manejador de plantillas HTML que permite escribilo de una manera muy sencilla y ejcutar código js como condicionales, iteraciones y demás funciones.

Todas estas librerías o paquetes son compatibles con express, lo que queda ahora es instalar y configurar cada una de ellas. Además de asegurarnos de leer desde las varibles de entorno las cofuguraciones que pueden variar cuando la aplicación se pasa ha entorno de producción, además de verificar que la aplicación posee los permisos adecuados para su ejecución.

Esta es una tarea reptitiva que se realiza en cada nuevo proyecto. Algo realmente no productivo, por eso utilizaremos un paquete más que sirve para crear proyectos express, con estructura de directorio adecuado y con la mayoria de por menores contemplados. 

8. **express-generator**: nos permite crear el código base de proyectos express.

# Iniciando el proyecto

## Instalación de express-generator

Para poder generar un proyecto base de express con el paquete **express-generator** se debe instalar de manera global usando **npm** 
~~~
npm install express-generator -g
~~~

Ahora desde cualquier terminal del sistema podrás ejecutar:
~~~
express -h
~~~
dando como resultado la ayuda del comando:

~~~
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
que nos creará una carpeta llamada **blog** con la estructura de directorios deseada (casi completa) y con una configuración base las libreríras y de rutas para express ![ExpressGenerator](asset/images/estructura_express_generator.png)

Probablemente en el directorio no se encuentre la carpeta **node_modules**, y es por que hace falta ejecutar el comando de instalación de la librerías definidas en el archivo **package.json**  que contiene las dependecias de nuestro proyecto:

~~~
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

y en el archivo **package.json**  modificar:

~~~
  "scripts": {
    "start": "node ./bin/www"
  },
~~~

por esto 
~~~
  "scripts": {
    "start": "nodemon ./bin/www"
  },
~~~
Esta librería sirve para reiniciar automáticamente nuestro servidor cada vez que cambiemos el código fuente. Ahora se puede ejecutar:
~~~
DEBUG=blog:* npm start
~~~

y consola se puede observar
~~~
[nodemon] 1.19.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs
[nodemon] starting `node ./bin/www`
  blog:server Listening on port 3000 +0ms
~~~

# Conectando Express con MongoDB

MongoDB es un sistema de base de datos NoSQL orientado a documentos. Estos documentos son almacenados en BSON, que es una representación binaria de JSON. Este tiene soporte nativo para ser conectado desde diferentes lenguajes de programación, entre ellos, nodejs :).

A su vez express permite integrar facilmente un gran lista de base de datos. Entre ellas mongodb. Para poder conectarlo es necesario instalar el driver en el proyecto.

Por otro lado, utilizaremos un ODM, es decir, una librería de modelado, que nos permita manipular la base de datos sin necesidad de conocer mongodb a fondo y facilitará tareas repetitivas, pero antes de utilizarlo un código de ejemplo de mongodb con express de manera manual.

Instalación del Driver de MongoDB
~~~
npm install mongodb
~~~

Código fuente de conexión a una base de datos mongo y la obtención de todos los documentos de la coleccion **mammals**

~~~
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
    - Es un conjunto de claves con valores asociados
    - Su representación varia de acuerdo al leguaje que se utilice
    - En JavaScript tiene la forma de un JSON
    - Las Clave de los documenteos deben ser String
    - No deben utilizarce caracteres especiales como '$' y '.' en las claves y además no pueden iniciar con '_'
    - Las claves son sensible a mayusculas
    - Todo documento tine una clave _id asignada automaticamente y única en toda la colección
    - Las claves no se pueden duplicar
    ~~~
        {
            "name": "nestor",
            "lastname": "aldana",
            "email": "naldana@uca.edu.sv",
            "random": 1
        }
    ~~~
- Una colección (collection) puedes ser considerada como una tabla en una base de datos relacional.
  - Es identificada por un nombre
  - Permite el uso de un esquema libre
    - Esquema libre significa que los documentos de una misma colección pueden tener estructuras diferentes. Por ejemplo, estos dos documentos pueden formar parte de la misma colección:
    ~~~
        {
            "name": "nestor",
            "lastname": "aldana",
            "email": "naldana@uca.edu.sv",
            "random": 1
        }

        {
            fullname: "Douglas Hernandez"
        }
    ~~~
    - Lo anterior no es recomendable, ya que podria ser un infierno manegar diferentes estructuras, pero con la práctica se podrá entender que esta flexibilidad bien manejada aporta mucha utilidad
    -  Se puede organizar colecciones en subcolecciones utilizando namespaces separados por el . carácter. Por ejemplo si tenemos un blog podemos tener una colección **blog.posts** y otra colección **blog.autores**.

- Una sola instancia de MongoDB puede alojar múltiples bases de datos independientes, que pueden tener sus propias colecciones y permisos.

 ## ¿ODM Qué?

Normalmente cuando se maneja una base de datos, en un aplicación hay tareas repetitivas que controlar como la inserción, la busqueda, la conexión, evitar inyección de código malisioso, mapear los datos de la base a modelos sencillos de controllar por nuestra aplicación. Estás tareas y mas son las que conforman normalmente un ORM (Object-Relational mapping). 

Los ORM son utilizados con base de datos SQL y entre alguno de ellos estan 

- Propel (PHP)
- Hibernate (Java)
- Sequelize (NodeJs)
- ADO. NET Entity Framework (C#)
- Sequelize (NodeJs)

Un ODM o Object Document Mapper al igual que ORM proporciona una utilidad alta para la manipulación de base datos ahorrando tiempo y dolores de cabeza.

## Mongoose

Mongoose es un ODM que permite definir objetos tipados para asignar a un documento MongoDB, de manera global y sencilla dentro de nuestra APP, las deficiniones de esquemas )Schema ) para mongoose son las que almacenaremos en la carpeta **models**.

Mongoose permite definir esquemas utilizando tipos de datos  llamados SchemTypes, es necesario aclarar que estos es algo diferente a solamente tipos de datos, es un objeto de configuración, además plugin para mongoose son capaces de modificar y extender la definiciones de tipos, por defecto se encuentra disponibles:

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

1. Valor predeterminado
2. Función de validación
3. Definir le campo como requerido
4. Función **get** para procesar el dato antes de retornarlo en un petición
5. Acciones para manipular los datos antes de guardarlos en la base
6. Definir índices.

Los SchemaType permiten definir algunas otras propiedades, es recomendable consultar cada uno de ellos en la documentación de mongoose. A continuanción un ejemplo de definir una **Thing**

~~~
// Definir las propiedades de un documento de mongoDB usando mongoose
var schema = new Schema({ // El objeto Schema pertenece a mongoose
  name:    String, // SchemType
  binary:  Buffer,
  living:  Boolean,
  updated: { type: Date, default: Date.now }, // SchemaType personlizando opciones
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

Primero acceda desde terminal al la carpeta **blog** creada con **express-generator** y ejecutar:

~~~
npm install mongoose --save
~~~

Con esto se tendra disponible la libriria en todo el proyecto, no esta de más comprar que en el archivo package.json se muestre claramente la dependencia, y hasta el momento el archivo debe verse:

~~~
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

~~~
var mongoose = require('mongoose');
~~~

Ahora para conectar con la base en necesario ejecutar el metodo **connect**, mongoose nos permite dos opciones, usando el concepto de callbacks o Promises.

Como este articulo esta diseñado para comprender la mayoria de conceptos la siguiente sección es sobre promesas y callbacks. Saltarse la sección no causara ningun problema a furturo, pero hara más comprencible trabajar con JS

---

### Promesas VS Callbacks

Todo las tecnicas que se utilizan en las soluciones de software estan dirigidas a escribir menos código, hacerlo altamente legible, reutilizable. Los callback y promises son esfuerzos de porde lograrlo.

Un callback en pocas palabras es un función que se pasa por paramentro a otra funcion, el callback es pasado con el objetivo de ejecutar un código cuando la tarea solicitada termine.

El siguiente código obtine datos de un formulario y los envia a un servidor y muestra el estado de la respuesta:

~~~
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

Es de notar como la función **postResponse**  es pasada como paramentro a la función **request** . Cuando se utilizan callback es necesario mantener el código simple y legible, intentar dar nombre a la mayoria de funciones y no parsarlas directamente como paramentros, al no cumplir esto, lo que se logra es una contradiccion de nuestros objetivos. En la página http://callbackhell.com/ de donde se estrajo el código anterior, brinda consejas para no crear un infirno de callback y utilizarlo de manera benificiosa 

Las promesas hacen uso del concepto de callbacks pero nos lo presenta de una manera diferente y no añaden la funcion de concatenar acciones. Primero las Promises son creadas a partir de un objeto JS:

~~~
var myPromise = new Promise(function (resolve, reject) {
    if (2 > 2) {
        resolve(':)');
    } else {
        reject(':(');
    }
});
~~~

y como se puede observar en el código el objeto Promesa recibe una función con dos paramentros **resolve** y **reject** , para poder ejecutar la promesa se debe usar el metodo then y enviar lod dos paramentros solicitados:

~~~
myPromise.then(function (result) {
    // Resolve callback.
    console.log(result); 
}, function (result) {
    // Reject callback.
    console.error(result);
});
~~~

Hasta el momento todo parece solo una forma de complicar el conceptos de callbacks, pero lo util es usar promesas en cadena, por ejemplo:

~~~
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

En el código anterior podemos ver como despues de cada **then** inmediatamente se manda a ejecutar otro, el concepto de esto es hacer una cadena de tareas que se deben ejecutar una tras de otra, hasta que las tareas  anteriores se resulvan. Ene el caso del ejemplo, la primera tarea es obtener un usario en formato json desde la url indicada a fetch luego (**then**) el cuerpo de la respuesta es coventida a json, del objeto convertido se solicita al api de github información sobre el usuario, cuando la información ya esta disponible es convertida a json, luego se crea (por ejemplo) una promesa que añade la imagen de usuario de github a nuestra web y finalmente muestra el mensaje de tarea completa.

El código escrito arriba permite leer de manera secuencial tareas que suceden de forma asincrona, es decir, tarea que no es posible el tiempo que les tomara terminar o incluso si lo haran. 

Es de notar que a ninguna de las llamadas a **then** se envio el segundo paramentro, que indica que hacer en caso de error, para seguir manteniedo el concepto de legibilidad existe el mentodo catch que permite definir que hacer en caso de error.

~~~
myPromise
  .then(function (result) {
      // Resolve callback.
      console.log(result); 
  }).catch(function (result) {
      // Reject callback.
      console.error(result);
  });
~~~

En conclusion ambos conceptos nos sirven para ejecutar tareas asincronas y mantener el orden en el código, 

---

Para conectarse con moongosee podemos usar Promise o callback:

~~~

// Callback 

mongoose.connect(uri, options, function(error) {
 
// Si hay error estara prensente en el paramenteo error
 
});
 
// O promise
 
mongoose.connect(uri, options).then(
 
() => { /** Conexión lista */ },
 
err => { /** Error de conexión */ }
 
);
~~~

Ambas opciones requiere de una URI y opciones para la conexión. La URI de conexión es de mala práctica quemarla en el código, se utilizara un archivo **.env** para guardar paramentros de configuración para nuestra app. Para que las variables de entorno definidas en ese archivo pasen a estar disponibles desde **process** es necesario instalar la libreria **dontenv**

~~~
npm install dotenv
~~~

Luego es necesario crear el archivo **.env** en la carpeta blog con el sigueinte contenido:

~~~
# URI for MongoDB Server
MONGO_URI=mongodb+srv://user:password@localhost:27017/db
# Sever Port
PORT=3000
# Active all debug messages 
DEBUG=blog:*
~~~

Luego en el archivo  **bin/www** añadir en la primera linea 

~~~
require('dotenv').config();
~~~

En el archivo **app.js** asegurar importar mongoose y la libreria debug para mostrar mensajes de debug:

~~~
var mongoose = require('mongoose');
var debug = require('debug')('blog:database');
~~~

y además añadir la conexión ante de la linea 

~~~ 
var app = express(); 
~~~

usando el siguiente código:

~~~
// Conect to database

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    debug("success Coneccted to database")
  })
  .catch((err) => {
    debug(err);
    process.exit(1);
  });
~~~

Recuerda cambiar el valor de **MONGO_URI** segun tu servido, en el archivo **.env**
Si la URI de conexión es correcta y escritos todos los cambios hasta el momento al ejecutar:

~~~
npm start
~~~

Obtendremos 
~~~
> nodemon ./bin/www

[nodemon] 1.19.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
  blog:server Listening on port 3000 +0ms
  blog:database success Coneccted to database +491ms
~~~

## Definiendo modeles en Mongoose

Antes de definir los modelos, es buen punto para recordar que el objetivo es hacer un api de acceso para un blog, en el cual almacenaremos, usuarios, post y comentarios.

Los usuarios pueden escribir post y hacer comentarios, además alamcenaremos:

1. Username
2. Firts name
3. Last name
4. Email
5. Password
6. Fecha de creacion
7. Fecha de actulización

Del Post  alamcenaremos

1. Titulo
2. Autor
3. Comentarios
   1. autor
   2. contenido
4. Contenido
5. Etiquetas
6. Fecha de creacción
7. Fecha de modificación 
8. Estado (borrador, publicado, privado)

Como podran notar tendremos dos colecciones: usuarios y posts, los comentarios seran guardados como un subdocumento.

para definir los modelos, empezaremos por los usuarios creando en la carpeta model el archivo **user.js** con el siguiente código:

~~~
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = Schema({
    username: {
        type: String,
        required: true
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

Este código importa mongoose, mongoose funciona con una sola instancia, esto quiere decir que para cualquier modelo nuestra conexión a la base estara disponible de manera transparente.

Las propiedades  username, email, password han sido definidas con el type String además como requerido, esto es equivalente a NOT NULL en base de datos relacionales.

Además notar el segundo paramentro del pasado al Objeto Schema, este nos permite definir opciones para que mongoose nos ayude con tareas comunes, en este caso con la definición de las propiedades createdAt and updatedAt, que guardan la hora de creación y módificacion de nuestro usuario, un usuario insertado en la base de datos se vera asi:

~~~
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

Para Insertar un documento con moongose, es necesario importar el modelo, luego crear un nuevo objeto y finalmente ejeucuatar el metodo **save**

~~~

var User = require("./models/user"); // Importa modelo

// Crear un nuevo usuarion pasando un objeto con los valores de cada propiedad
new User({ 
  username: "next94",
  first_name: "nestor",
  last_name: "aldana",
  email: "nestor.aldana1@gmail.com",
  password: "true",
  login_count: 1

}).save(); // ejecutar el método save
~~~

Antes de continuar con la manipulación de datos es necesario definir el modelo post, en el archivo **post.js** dentro de la carpeta models, con el siguiente código:

~~~
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);
~~~

Para poder referenciar, otros documentos, al estilo base de datos relacional podemos configurar un objeto como de tipo referencias, además dando el nombre del modelo a referenciar:

~~~
author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
}
~~~

Y si deseamos limitar a una lista de valores, el contenido de una propiedad, podemos hacerlo difiniendo una propiedad enum

~~~
state: {
    type: String,
    enum: ['draft', 'published', 'private']
}
~~~

En la base de datos este objeto, sin comentarios, se ve almacenado, así:

~~~
{
  "_id": {
      "$oid":"5dc9c4d4a4ed0f66e1540999"
  },
  "tags":["tutorial","express","jwt"],
  "title":"Prueba titulo",
  "author": {
    "$oid":"5dc9c4d4a4ed0f66e1540998"
  },
  "state":"draft",
  "comments":[],
  "createdAt":{
    "$date":{ 
      "$numberLong":"1573504212674"
    }
  },
  "updatedAt": {
    "$date":{ 
      "$numberLong":"1573504212674"
    }
  },
  "__v": {
     "$numberInt":"0"
     }
}
~~~
