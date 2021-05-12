-- SCHEMA: pyramid

-- DROP SCHEMA pyramid ;

DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
    EXECUTE 'DROP TABLE ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

----------------------------------------USUARIO--------------------------------------
CREATE TABLE IF NOT EXISTS Usuario (

	email varchar(30) PRIMARY KEY,
	contrasena varchar(50) NOT NULL,
	dni varchar(9) UNIQUE,
	nombre varchar(30) NOT NULL,
	apellido1 varchar(30) NOT NULL,
	apellido2 varchar(30) NOT NULL,
	tipovia varchar(10) NOT NULL,
	nombrevia varchar(50) NOT NULL,
	numvia varchar(4) NOT NULL,
	codigoPuerta varchar(5),
	notificaciones JSON NOT NULL DEFAULT '{}'
	
);


----------------------------------------EMPRESA--------------------------------------

CREATE TABLE IF NOT EXISTS Empresa (

	nif varchar(9) PRIMARY KEY,
	razonSocial varchar(50) NOT NULL,
	nombre varchar(30) NOT NULL,
	administrador varchar(30) NOT NULL,
	tipovia varchar(10) NOT NULL,
	nombrevia varchar(50) NOT NULL,
	numvia varchar(4) NOT NULL,
	codigoPuerta varchar(5),
	
	CONSTRAINT empresaUsuario FOREIGN KEY(administrador)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE
	
);


----------------------------------------TELÉFONO-------------------------------------

CREATE TABLE IF NOT EXISTS Telefono (
	
	telefono varchar(12) PRIMARY KEY,
	usuario varchar(30) NOT NULL,
	empresa varchar (9) NOT NULL,
	
	CONSTRAINT telefonoUsuario FOREIGN KEY(usuario)
		REFERENCES Usuario(email) 
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT telefonoEmpresa FOREIGN KEY(empresa)
		REFERENCES Empresa(nif) 
		ON DELETE CASCADE ON UPDATE CASCADE

);


----------------------------------------GRUPO----------------------------------------

CREATE TABLE IF NOT EXISTS Grupo (
	
	codigo serial,
	empresa varchar(9),
	nombre varchar(30) NOT NULL,
	descripcion varchar(200),
	codigoSub integer,
	empresaSub varchar(9),
	
	CONSTRAINT grupoPK PRIMARY KEY(codigo,empresa),
	
	CONSTRAINT grupoEmpresa FOREIGN KEY(empresa)
		REFERENCES Empresa(nif) 
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT grupoGrupo FOREIGN KEY(codigoSub,empresaSub)
		REFERENCES Grupo(codigo,empresa)
		ON DELETE CASCADE ON UPDATE CASCADE
	
);


----------------------------------------GRUPOUSUARIO--------------------------------

CREATE TABLE IF NOT EXISTS UsuarioGrupo (
	
	usuario varchar(30),
	codigoGrupo integer,
	empresaGrupo varchar(9),
	administrador bool NOT NULL DEFAULT false,
	
	CONSTRAINT usuarioGrupoPK PRIMARY KEY(usuario,codigoGrupo,empresaGrupo),
	CONSTRAINT usuarioGrupoUsuario FOREIGN KEY(usuario)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT usuarioGrupoGrupo FOREIGN KEY(codigoGrupo,empresaGrupo)
		REFERENCES Grupo(codigo,empresa)
		ON DELETE CASCADE ON UPDATE CASCADE

);


----------------------------------------ROL-----------------------------------------

CREATE TABLE IF NOT EXISTS Rol (

	codigo serial PRIMARY KEY,
	nombre varchar(30) NOT NULL,
	descripcion varchar(200) 

);


----------------------------------------ROLUSUARIO----------------------------------

CREATE TABLE IF NOT EXISTS RolUsuario (

	usuario varchar(30),
	rol integer,
	
	CONSTRAINT rolPK PRIMARY KEY(usuario,rol),
	
	CONSTRAINT rolUsuarioUsuario FOREIGN KEY(usuario)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT rolUsuarioRol FOREIGN KEY(rol)
		REFERENCES Rol(codigo)
		ON DELETE CASCADE ON UPDATE CASCADE

);


----------------------------------------MENSAJE-------------------------------------

CREATE TABLE IF NOT EXISTS Mensaje (

	remitente varchar(30),
	destinatario varchar(30),
	codigo serial,
	fechaHora timestamptz NOT NULL,
	texto varchar(1000) NOT NULL,
	imagen bytea,
	
	CONSTRAINT mensajePK PRIMARY KEY(remitente,codigo),
	
	CONSTRAINT mensajeUsuarioRemitente FOREIGN KEY(remitente)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT mensajeUsuarioDestino FOREIGN KEY(destinatario)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE

);


----------------------------------------PROYECTO------------------------------------

CREATE TABLE IF NOT EXISTS Proyecto (

	administrador varchar(30),
	codigo serial,
	nombre varchar(30) NOT NULL,
	descripcion varchar(200),
	fechaHora timestamptz,
	finalizado bool NOT NULL DEFAULT false,
	
	CONSTRAINT proyectoPK PRIMARY KEY(administrador,codigo),
	
	CONSTRAINT proyectoAdministrador FOREIGN KEY(administrador)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE
	
);


----------------------------------------PROYECTOUSUARIO-----------------------------

CREATE TABLE IF NOT EXISTS ProyectoUsuario (

	usuario varchar(30),
	proyectoCodigo integer,
	proyectoAdministrador varchar(30),
	
	CONSTRAINT proyectoUsuarioPK PRIMARY KEY(usuario, proyectoCodigo, 
											 proyectoAdministrador),
	
	CONSTRAINT proyectoUsuarioUsuario FOREIGN KEY(usuario)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT proyectoUsuarioProyecto FOREIGN KEY(proyectoCodigo,
												   proyectoAdministrador)
		REFERENCES Proyecto(codigo,administrador)
		ON DELETE CASCADE ON UPDATE CASCADE

);


----------------------------------------TAREA---------------------------------------

CREATE TABLE IF NOT EXISTS Tarea (

	codigo serial,
	codigoProyecto integer,
	administradorProyecto varchar(30),
	nombre varchar(30) NOT NULL,
	descripcion varchar(200),
	checked bool NOT NULL DEFAULT false,
	fechaHora timestamptz,
	
	CONSTRAINT tareaPK PRIMARY KEY(codigo, codigoProyecto, administradorProyecto),

	CONSTRAINT tareaProyecto FOREIGN KEY(codigoProyecto,administradorProyecto)
		REFERENCES Proyecto(codigo,administrador)
		ON DELETE CASCADE ON UPDATE CASCADE
	
);


----------------------------------------SESIÓN--------------------------------------

CREATE TABLE IF NOT EXISTS Sesion (

	usuario varchar(30),
	horaInicio timestamptz NOT NULL DEFAULT NOW(),
	horaFin timestamptz,
	
	CONSTRAINT sesionPK PRIMARY KEY(usuario, horaInicio),

	CONSTRAINT sesionUsuario FOREIGN KEY(usuario)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE	
	
);


----------------------------------------ARCHIVO--------------------------------------

CREATE TABLE IF NOT EXISTS Archivo (

	codigo serial,
	tareaCodigo integer,
	tareaCodigoProyecto integer,
	tareaAdministradorProyecto varchar(30),
	archivo bytea,
	maxSizeKB real NOT NULL,
	fileExtLetters varchar(4) NOT NULL,
	
	CONSTRAINT archivoPK PRIMARY KEY(codigo, tareaCodigo, 
									 tareaCodigoProyecto,
									 tareaAdministradorProyecto),

	CONSTRAINT archivoTarea FOREIGN KEY(tareaCodigo,
										tareaCodigoProyecto,
										tareaAdministradorProyecto)
		REFERENCES Tarea(codigo,codigoProyecto,administradorProyecto)
		ON DELETE CASCADE ON UPDATE CASCADE	

);


----------------------------------------NOTICIA-------------------------------------

CREATE TABLE IF NOT EXISTS Noticia (

	codigo serial,
	autor varchar(30),
	grupoCodigo integer,
	grupoEmpresa varchar(9),
	texto varchar(400) NOT NULL,
	fechaHora timestamptz NOT NULL,
	imagen1 bytea,
	imagen2 bytea,
	imagen3 bytea,
	imagen4 bytea,
	
	CONSTRAINT noticiaPK PRIMARY KEY(codigo, autor, 
									 grupoCodigo,
									 grupoEmpresa),

	CONSTRAINT noticiaGrupo FOREIGN KEY(grupoCodigo,
										grupoEmpresa)
		REFERENCES Grupo(codigo,empresa)
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT noticiaAutor FOREIGN KEY(autor)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE	

); 


----------------------------------------USUARIOTAREA--------------------------------

CREATE TABLE IF NOT EXISTS UsuarioTarea (

	atareado varchar(30),
	tareaCodigo integer,
	tareaCodigoProyecto integer,
	tareaAdministradorProyecto varchar(30),
	
	CONSTRAINT usuarioTareaPK PRIMARY KEY(atareado,
										tareaCodigo,
										tareaCodigoProyecto,
										tareaAdministradorProyecto),
	
	CONSTRAINT usuarioTareaUsuario FOREIGN KEY(atareado)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT usuarioTareaTarea FOREIGN KEY(tareaCodigo,
										tareaCodigoProyecto,
										tareaAdministradorProyecto)
		REFERENCES Tarea(codigo,codigoProyecto,administradorProyecto)
		ON DELETE CASCADE ON UPDATE CASCADE		
	
);


----------------------------------------ENCUESTA------------------------------------

CREATE TABLE IF NOT EXISTS Encuesta (

	autor varchar(30),
	codigo serial,
	nombre varchar(30) NOT NULL,
	descripcion varchar(200),
	
	CONSTRAINT encuestaPK PRIMARY KEY(autor, codigo),
	
	CONSTRAINT encuestaAutor FOREIGN KEY(autor)
		REFERENCES Usuario(email)
		ON DELETE CASCADE ON UPDATE CASCADE
	
);


----------------------------------------ENCUESTAUSUARIO-----------------------------

CREATE TABLE IF NOT EXISTS EncuestaUsuario (

	encuestaAutor varchar(30),
	encuestaCodigo integer,
	encuestado varchar(30),
	
	CONSTRAINT encuestaUsuarioPK PRIMARY KEY(encuestaAutor,
											 encuestaCodigo,
											 encuestado),
	
	CONSTRAINT encuestaUsuarioEncuesta FOREIGN KEY(encuestaAutor, encuestaCodigo)
	REFERENCES Encuesta(autor,codigo)
	ON DELETE CASCADE ON UPDATE CASCADE,
	
	CONSTRAINT encuestaUsuarioUsuario FOREIGN KEY(encuestado)
	REFERENCES Usuario(email)
	ON DELETE CASCADE ON UPDATE CASCADE

);


----------------------------------------PREGUNTA------------------------------------

CREATE TABLE IF NOT EXISTS Pregunta (

	codigo serial,
	encuestaCodigo integer,
	encuestaAutor varchar(30),
	enunciado varchar(200) NOT NULL,
	respuestas JSON DEFAULT '{}',
	
	CONSTRAINT preguntaPK PRIMARY KEY(codigo, encuestaCodigo, encuestaAutor),
	
	CONSTRAINT preguntaEncuesta FOREIGN KEY(encuestaAutor, encuestaCodigo)
	REFERENCES Encuesta(autor,codigo)
	ON DELETE CASCADE ON UPDATE CASCADE
	
	
); 

	
	



