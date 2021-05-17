const mail = function validateMail(email) {
    if (!email) {
        return {
            message: "Email no puede estar vacío"
        }
    }
    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return {
            message: "El email no tiene un formato correcto."
        }
    }
    if (email.length > 50) {
        return {
            message: "El email es demasiado largo."
        };
    }
}

module.exports = mail;