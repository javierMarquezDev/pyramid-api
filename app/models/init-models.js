var DataTypes = require("sequelize").DataTypes;
var _empresa = require("./empresa");
var _grupo = require("./grupo");
var _noticia = require("./noticia");
var _proyectousuario = require("./proyectousuario");
var _tarea = require("./tarea");
var _usuario = require("./usuario");
var _usuariogrupo = require("./usuariogrupo");
var _usuariotarea = require("./usuariotarea");

function initModels(sequelize) {
  var empresa = _empresa(sequelize, DataTypes);
  var grupo = _grupo(sequelize, DataTypes);
  var noticia = _noticia(sequelize, DataTypes);
  var tarea = _tarea(sequelize, DataTypes);
  var usuario = _usuario(sequelize, DataTypes);
  var usuariogrupo = _usuariogrupo(sequelize, DataTypes);
  var usuariotarea = _usuariotarea(sequelize, DataTypes);

  grupo.belongsToMany(grupo, { as: 'empresagrupo_grupos', through: usuariogrupo, foreignKey: "codigogrupo", otherKey: "empresagrupo" });
  grupo.belongsToMany(grupo, { as: 'codigogrupo_grupos', through: usuariogrupo, foreignKey: "empresagrupo", otherKey: "codigogrupo" });
  grupo.belongsToMany(usuario, { as: 'autor_usuarios', through: noticia, foreignKey: "grupocodigo", otherKey: "autor" });
  grupo.belongsToMany(usuario, { as: 'autor_usuarios', through: noticia, foreignKey: "grupoempresa", otherKey: "autor" });
  tarea.belongsToMany(tarea, { as: 'tareacodigo_tareas', through: archivo, foreignKey: "tareaadministradorproyecto", otherKey: "tareacodigo" });
  tarea.belongsToMany(tarea, { as: 'tareaadministradorproyecto_tareas', through: archivo, foreignKey: "tareacodigo", otherKey: "tareaadministradorproyecto" });
  tarea.belongsToMany(tarea, { as: 'tareaadministradorproyecto_tareas', through: archivo, foreignKey: "tareacodigoproyecto", otherKey: "tareaadministradorproyecto" });
  tarea.belongsToMany(usuario, { as: 'atareado_usuarios', through: usuariotarea, foreignKey: "tareaadministradorproyecto", otherKey: "atareado" });
  tarea.belongsToMany(usuario, { as: 'atareado_usuarios', through: usuariotarea, foreignKey: "tareacodigo", otherKey: "atareado" });
  tarea.belongsToMany(usuario, { as: 'atareado_usuarios', through: usuariotarea, foreignKey: "tareacodigoproyecto", otherKey: "atareado" });
  usuario.belongsToMany(encuesta, { as: 'encuestaautor_encuesta', through: encuestausuario, foreignKey: "encuestado", otherKey: "encuestaautor" });
  usuario.belongsToMany(grupo, { as: 'grupocodigo_grupos', through: noticia, foreignKey: "autor", otherKey: "grupocodigo" });
  usuario.belongsToMany(grupo, { as: 'codigogrupo_grupos', through: usuariogrupo, foreignKey: "usuario", otherKey: "codigogrupo" });
  usuario.belongsToMany(proyecto, { as: 'proyectoadministrador_proyectos', through: proyectousuario, foreignKey: "usuario", otherKey: "proyectoadministrador" });
  usuario.belongsToMany(rol, { as: 'rol_rols', through: rolusuario, foreignKey: "usuario", otherKey: "rol" });
  usuario.belongsToMany(tarea, { as: 'tareaadministradorproyecto_tareas', through: usuariotarea, foreignKey: "atareado", otherKey: "tareaadministradorproyecto" });
  grupo.belongsTo(empresa, { as: "empresa_empresa", foreignKey: "empresa"});
  empresa.hasMany(grupo, { as: "grupos", foreignKey: "empresa"});
  empresa.hasMany(telefono, { as: "telefonos", foreignKey: "empresa"});
  grupo.belongsTo(grupo, { as: "codigosub_grupo", foreignKey: "codigosub"});
  grupo.hasMany(grupo, { as: "grupos", foreignKey: "codigosub"});
  grupo.belongsTo(grupo, { as: "empresasub_grupo", foreignKey: "empresasub"});
  grupo.hasMany(grupo, { as: "empresasub_grupos", foreignKey: "empresasub"});
  noticia.belongsTo(grupo, { as: "grupocodigo_grupo", foreignKey: "grupocodigo"});
  grupo.hasMany(noticia, { as: "noticia", foreignKey: "grupocodigo"});
  noticia.belongsTo(grupo, { as: "grupoempresa_grupo", foreignKey: "grupoempresa"});
  grupo.hasMany(noticia, { as: "grupoempresa_noticia", foreignKey: "grupoempresa"});
  usuariogrupo.belongsTo(grupo, { as: "codigogrupo_grupo", foreignKey: "codigogrupo"});
  grupo.hasMany(usuariogrupo, { as: "usuariogrupos", foreignKey: "codigogrupo"});
  usuariogrupo.belongsTo(grupo, { as: "empresagrupo_grupo", foreignKey: "empresagrupo"});
  grupo.hasMany(usuariogrupo, { as: "empresagrupo_usuariogrupos", foreignKey: "empresagrupo"});
  proyectousuario.belongsTo(proyecto, { as: "proyectoadministrador_proyecto", foreignKey: "proyectoadministrador"});
  proyecto.hasMany(proyectousuario, { as: "proyectousuarios", foreignKey: "proyectoadministrador"});
  proyectousuario.belongsTo(proyecto, { as: "proyectocodigo_proyecto", foreignKey: "proyectocodigo"});
  proyecto.hasMany(proyectousuario, { as: "proyectocodigo_proyectousuarios", foreignKey: "proyectocodigo"});
  tarea.belongsTo(proyecto, { as: "administradorproyecto_proyecto", foreignKey: "administradorproyecto"});
  proyecto.hasMany(tarea, { as: "tareas", foreignKey: "administradorproyecto"});
  tarea.belongsTo(proyecto, { as: "codigoproyecto_proyecto", foreignKey: "codigoproyecto"});
  proyecto.hasMany(tarea, { as: "codigoproyecto_tareas", foreignKey: "codigoproyecto"});
  rolusuario.belongsTo(rol, { as: "rol_rol", foreignKey: "rol"});
  rol.hasMany(rolusuario, { as: "rolusuarios", foreignKey: "rol"});
  archivo.belongsTo(tarea, { as: "tareaadministradorproyecto_tarea", foreignKey: "tareaadministradorproyecto"});
  tarea.hasMany(archivo, { as: "archivos", foreignKey: "tareaadministradorproyecto"});
  archivo.belongsTo(tarea, { as: "tareacodigo_tarea", foreignKey: "tareacodigo"});
  tarea.hasMany(archivo, { as: "tareacodigo_archivos", foreignKey: "tareacodigo"});
  archivo.belongsTo(tarea, { as: "tareacodigoproyecto_tarea", foreignKey: "tareacodigoproyecto"});
  tarea.hasMany(archivo, { as: "tareacodigoproyecto_archivos", foreignKey: "tareacodigoproyecto"});
  usuariotarea.belongsTo(tarea, { as: "tareaadministradorproyecto_tarea", foreignKey: "tareaadministradorproyecto"});
  tarea.hasMany(usuariotarea, { as: "usuariotareas", foreignKey: "tareaadministradorproyecto"});
  usuariotarea.belongsTo(tarea, { as: "tareacodigo_tarea", foreignKey: "tareacodigo"});
  tarea.hasMany(usuariotarea, { as: "tareacodigo_usuariotareas", foreignKey: "tareacodigo"});
  usuariotarea.belongsTo(tarea, { as: "tareacodigoproyecto_tarea", foreignKey: "tareacodigoproyecto"});
  tarea.hasMany(usuariotarea, { as: "tareacodigoproyecto_usuariotareas", foreignKey: "tareacodigoproyecto"});
  empresa.belongsTo(usuario, { as: "administrador_usuario", foreignKey: "administrador"});
  usuario.hasMany(empresa, { as: "empresas", foreignKey: "administrador"});
  encuesta.belongsTo(usuario, { as: "autor_usuario", foreignKey: "autor"});
  usuario.hasMany(encuesta, { as: "encuesta", foreignKey: "autor"});
  encuestausuario.belongsTo(usuario, { as: "encuestado_usuario", foreignKey: "encuestado"});
  usuario.hasMany(encuestausuario, { as: "encuestausuarios", foreignKey: "encuestado"});
  mensaje.belongsTo(usuario, { as: "remitente_usuario", foreignKey: "remitente"});
  usuario.hasMany(mensaje, { as: "mensajes", foreignKey: "remitente"});
  mensaje.belongsTo(usuario, { as: "destinatario_usuario", foreignKey: "destinatario"});
  usuario.hasMany(mensaje, { as: "destinatario_mensajes", foreignKey: "destinatario"});
  noticia.belongsTo(usuario, { as: "autor_usuario", foreignKey: "autor"});
  usuario.hasMany(noticia, { as: "noticia", foreignKey: "autor"});
  proyecto.belongsTo(usuario, { as: "administrador_usuario", foreignKey: "administrador"});
  usuario.hasMany(proyecto, { as: "proyectos", foreignKey: "administrador"});
  proyectousuario.belongsTo(usuario, { as: "usuario_usuario", foreignKey: "usuario"});
  usuario.hasMany(proyectousuario, { as: "proyectousuarios", foreignKey: "usuario"});
  rolusuario.belongsTo(usuario, { as: "usuario_usuario", foreignKey: "usuario"});
  usuario.hasMany(rolusuario, { as: "rolusuarios", foreignKey: "usuario"});
  sesion.belongsTo(usuario, { as: "usuario_usuario", foreignKey: "usuario"});
  usuario.hasMany(sesion, { as: "sesions", foreignKey: "usuario"});
  telefono.belongsTo(usuario, { as: "usuario_usuario", foreignKey: "usuario"});
  usuario.hasMany(telefono, { as: "telefonos", foreignKey: "usuario"});
  usuariogrupo.belongsTo(usuario, { as: "usuario_usuario", foreignKey: "usuario"});
  usuario.hasMany(usuariogrupo, { as: "usuariogrupos", foreignKey: "usuario"});
  usuariotarea.belongsTo(usuario, { as: "atareado_usuario", foreignKey: "atareado"});
  usuario.hasMany(usuariotarea, { as: "usuariotareas", foreignKey: "atareado"});

  return {
    archivo,
    empresa,
    grupo,
    noticia,
    tarea,
    usuario,
    usuariogrupo,
    usuariotarea,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
