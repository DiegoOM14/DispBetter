const routes = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const $ = require('jquery');
const moment = require('moment');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = require('express')();



// Agregar middleware para express-session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Configurar passport
app.use(passport.initialize());
app.use(passport.session());

// Definir la estrategia de autenticación local
passport.use(new LocalStrategy({
  usernameField: 'nombre', // El campo de entrada del usuario en el formulario
  passwordField: 'password' // El campo de entrada de la contraseña en el formulario
}, async (username, password, done) => {
  try {
    const user = await User.findOne({ nombre: username });
    if (!user || password !== user.password) {
      return done(null, false, { message: 'Correo electrónico o contraseña incorrectos' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serializar y deserializar usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Definir rutas de inicio de sesión
routes.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

routes.get('/login', (req, res) => {
  res.render('login');
});

routes.get('/reloj', (req, res) => {
  res.render('hora');
});

// Definir la ruta para cerrar sesión
routes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Montar las rutas en la aplicación
app.use('/', routes);



//-------------------------------COLECCION---------------------------------------------------------------------//
//constante para poder usar los schemas de modelos de la coleccion usuario,facilito 
const User  = require('../models/usuario');
const Alarma = require('../models/dispensador');
const Alarm = require('../models/dispensador');








//.----------------------------Logout--------------------------------------------------//
//sesion sirve para hacer el logout y poder usar el metodo destroy


routes.get('/salir', (req, res) => {
    req.session.destroy(); //el metodo destroy cierra la sesion iniciada en el login
    res.redirect('/login'); 
  });

//-----------------------------------------------------------------LOGIN---------------------------------------------------------//
// Agregar Passport a la cadena de middleware


// Rutas
routes.get('/salir', (req, res) => {
  req.logout(); // Cerrar sesión y limpiar la sesión
  res.redirect('/login');
});

routes.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

routes.get('/login', (req, res) => {
  res.render('login');
});





//------------------------------------------------------------------REGISTRO-------------------------------------//
routes.post('/register', async (req, res)=>{
    try{
        //console.log()=funcion para imprimir en consola los datos que son enviados en el formulario por el metodo post en la route register
        console.log(req.body)
        req.body.active = true;
        const user = User(req.body);
        await user.save();
        res.render('login');
        console.log('Usuario creado')
    }
    catch{
        res.json("Error");
    }
});

routes.get('/register', (req, res)=>{
    res.render('register');
    //res.send('esta es la raiz pai')
});


//--------------------------------------------------------RUTAS BASICAS DE LA PAGINA -----------------------------------------------------------
   //Los get siempre sirven para dirigir no mandar por si decirlo o muestra
   routes.get('/home', (req, res) => {
    res.render('home');
});

routes.get('/panel1', (req, res) => {
    res.render('panel1');
});

routes.get('/panel2', (req, res) => {
  res.render('panel2');
});

routes.get('/panel3', (req, res) => {
  res.render('panel3');
});
//----------------------------------------------------------ALARMA----------------------------------------------------------------//
routes.post('/alarms', ensureAuthenticated, async (req, res)=>{
  try{
      console.log(req.body);
      req.body.active = false;
      const alarm = Alarma(req.body);
      alarm.usuario = req.user._id;
      await alarm.save();
      res.render('home');
      console.log('Alarma creada');
  }
  catch(error){
      console.log(error);
      res.json("Error papu");
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

routes.get('/listAlarms', (req, res)=>{
    res.render('listAlarms');
    //res.send('esta es la raiz pai')
});

routes.get('/panel', (req, res)=>{
  res.render('panel');
  //res.send('esta es la raiz pai')
});


routes.get('/alarma', async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      // Si no está autenticado, mostrar un mensaje de acceso denegado
      return res.status(401).send('Acceso denegado');
    }

    // Obtener el ID del usuario autenticado
    const userId = req.user._id;

    // Buscar las alarmas correspondientes al usuario en la base de datos
    const alarmas = await Alarma.find({ usuario: userId });

    // Pasar las alarmas del usuario a la plantilla
    res.render('alarma', { Alarma: alarmas });
  } catch (error) {
    console.log("Ha ocurrido un error: ", error);
    res.json("Error");
  }
});

  

  

//---------------------------------MOSTRAR---------------------------------------------------
routes.get('/mostrarAlarma', async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      // Si no está autenticado, mostrar un mensaje de acceso denegado
      return res.status(401).send('Acceso denegado');
    }

    // Obtener el ID del usuario autenticado
    const userId = req.user._id;

    // Buscar las alarmas del usuario en la base de datos
    const alarms = await Alarm.find({ usuario: userId });

    // Pasar las alarmas a la plantilla
    res.render('mostrarAlarma', { alarms });
  } catch (error) {
    console.log("Ha ocurrido un error: ", error);
    res.json("Error");
  }
});



  
routes.get('/mostrarP', async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      // Si no está autenticado, mostrar un mensaje de acceso denegado
      return res.status(401).send('Acceso denegado');
    }

    // Obtener el ID del usuario autenticado
    const userId = req.user._id;

    // Buscar el usuario en la base de datos
    const user = await User.findById(userId);

    // Pasar los datos del usuario a la plantilla
    res.render('mostrarP', { User: [user] }); // Pasamos un array con un solo usuario
  } catch (error) {
    console.log("Ha ocurrido un error: ", error);
    res.json("Error");
  }
});




  

//editar alarmas
routes.get('/editarA/:id', (req, res) => {
    // Buscamos la alarma con el ID especificado en la base de datos
    const id = req.params.id;
    Alarma.findById(id, (err, alarma) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
      } else if (!alarma) {
        res.status(404).send('Alarma no encontrada');
      } else {
        // Renderizamos la vista de edición de la alarma
        res.render('editarA', { alarma: alarma });
      }
    });
  });


  routes.get('/editarU/:id', (req, res) => {
    // Buscamos la alarma con el ID especificado en la base de datos
    const id = req.params.id;
    User.findById(id, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
      } else if (!user) {
        res.status(404).send('Usuario no encontrado');
      } else {
        // Renderizamos la vista de edición de la alarma
        res.render('editarU', { user: user });
      }
    });
  });
  //guardar alarma


routes.post('/editar_alarma/:id', (req, res) => {
  const id = req.params.id;
  Alarma.findByIdAndUpdate(id, {
    name: req.body.name,
    date: req.body.date,
    time: req.body.time,
    servo: req.body.servo,
    email: req.body.email,
    active: req.body.active=false
  }, (err, alarma) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else if (!alarma) {
      res.status(404).send('Alarma no encontrada');
    } else {
      res.redirect('/alarma');
    }
  });
});


  routes.post('/editar_usuario/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      user.nombre = req.body.name;
      user.password = req.body.password;
      user.email = req.body.email;
        await user.save();
      console.log(req.body)
      console.log('Usuario Editado');
      res.redirect('/mostrarP');
    } catch (error) {
      console.error(error);
      res.json('Error al actualizar user');
    }
  });
//BORRAR ALARMA
routes.get('/borrarA/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await Alarma.findByIdAndRemove(id);
      res.redirect('../alarma');
    } catch (error) {
      console.error(error);
      res.json('Error al eliminar la alarma');
    }
  });
  //borrar usuario
  routes.get('/borrarU/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await User.findByIdAndRemove(id);
      res.redirect('../login');
    } catch (error) {
      console.error(error);
      res.json('Error al eliminar el usuario');
    }
  });





  //------------------------EXTRAS------------------------------

routes.get('/panel', (req, res)=>{
    res.render('panel');
    //res.send('esta es la raiz pai')
});

routes.get('/instructivo', (req, res)=>{
  res.render('instructivo');
  //res.send('esta es la raiz pai')
});

routes.get('/boni', (req, res)=>{
  res.render('boni');
  //res.send('esta es la raiz pai')
});



///////////////////foticos/////////////
routes.get('/esquema', (req, res) => {
  res.render('esquema');
});








module.exports = routes;