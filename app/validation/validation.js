const rsocialsiglas = require("../models/razonsocial.enum").razonsocial;

//VALIDACIÓN DE CAMPO O CADENA VACÍA
exports.empty = (fieldValue) => {
    if (fieldValue === "" || fieldValue === null) {
        return `El campo no puede estar vacío.`;
    }
}

//E-MAIL
exports.email = (fieldValue) => {
    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fieldValue)) {
        return `${fieldName} no es un e-mail correcto.`
    }
}

//DNI
exports.dni = (fieldValue) => {

    if (!/^\d{8}[a-zA-Z]$/.test(fieldValue)) {
        return `No es un formato de DNI correcto.`
    }

    numero = parseInt(fieldValue.substr(0, fieldValue.length - 1)) % 23;
    letra = fieldValue.substr(fieldValue.length - 1, 1);

    ref = 'TRWAGMYFPDXBNJZSQVHLCKET';
    ref = ref.substr(numero, 1);

    if (ref != letra.toUpperCase()) {
        return `No es un DNI correcto.`
    }
}

//CIF
exports.cif = (fieldValue) => {

    if (!fieldValue || fieldValue.length !== 9) {
        return `El CIF es demasiado corto.`
    }

    var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    var digits = fieldValue.substr(1, fieldValue.length - 2);
    var letter = fieldValue.substr(0, 1);
    var control = fieldValue.substr(fieldValue.length - 1);
    var sum = 0;
    var i;
    var digit;

    if (!letter.match(/[A-Z]/)) {
        return `El formato del CIF no es correcto.`
    }

    for (i = 0; i < digits.length; ++i) {
        digit = parseInt(digits[i]);

        if (isNaN(digit)) {
            return `El formato del CIF no es correcto.`
        }

        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit = parseInt(digit / 10) + (digit % 10);
            }

            sum += digit;
        } else {
            sum += digit;
        }
    }

    sum %= 10;
    if (sum !== 0) {
        digit = 10 - sum;
    } else {
        digit = sum;
    }

    if (letter.match(/[ABEH]/)) {
        return `El CIF no es correcto.`
    }
    if (letter.match(/[NPQRSW]/)) {
        return `El CIF no es correcto.`
    }

    if (!String(digit) === control && !letters[digit] === control) {
        return `El CIF no es correcto.`
    }

}

//STRING MAX EXTENSION
exports.maxtsn = (fieldValue, extension) => {
    if (fieldValue == undefined || fieldValue.length > extension) {
        return `El campo es demasiado largo.`
    }
}

//STRING MIN EXTENSION
exports.mnxtsn = (fieldValue, extension) => {
    if (fieldValue.length < extension) {
        return `El campo es demasiado corto.`
    }
}

//JSON
exports.jsobject = (fieldValue) => {
    if (fieldValue.constructor != ({}).constructor) {
        return `El campo ${fieldName} no es un objeto JSON.`
    }
}

//NOMBRE
exports.humanname = (fieldValue) => {
    if (!/^[a-zA-Záéíóúàèìòùäëïöü]*(\s[a-zA-Záéíóúàèìòùäëïöü]*)*?$/.test(fieldValue)) {
        return `El campo no es válido.`
    }
}

//TIPO DE VÍA
exports.tipovia = (fieldValue) => {
    if (!/^(C.\/|Avda.\/|Crtra.\/)$/.test(fieldValue)) {
        return `El campo no es válido.`
    }
}

//NUMERO
exports.number = (fieldValue) => {
    if (typeof fieldValue != "number") {
        return `El campo no es válido.`
    }
}


//MAYOR o MENOR
exports.compare = (fieldValue, greaterThan = true, number = 0) => {
    if (greaterThan && fieldValue <= number) {
        return `El número debe ser mayor que ${number}.`
    }
    if (!greaterThan && fieldValue >= number) {
        return `El número debe ser menor que ${number}.`
    }
}

//REGEX
exports.regex = (fieldValue, regex) => {
    if (!regex.test(fieldValue)) {
        return `El campo no es válido.`
    }
}

//RAZON SOCIAL
exports.razonsocial = (fieldValue) => {

    fieldValue = fieldValue.trim();
    //hola

    const indexSiglas = fieldValue.lastIndexOf('S.');
    const siglas = fieldValue.substr(indexSiglas, fieldValue.length);
    const nombre = fieldValue.substr(0, indexSiglas).trim();

    if (JSON.stringify(this.humanname(nombre)) != null) {
        return `El nombre no es válido.`
    }
    if (!this.contenidoEn(siglas, rsocialsiglas)) {
        return `Las siglas no son válidas.`
    }
}

//CONTENIDO SE ENCUENTRA EN ENUM bool
exports.contenidoEn = (value, object) => {
    return Object.keys(object).find(key => object[key] == value) == undefined;
}