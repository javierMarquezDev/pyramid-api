//VALIDACIÓN DE CAMPO O CADENA VACÍA
exports.empty = (fieldValue, fieldName) => {
    if (!fieldValue || fieldValue == "") {
        return {
            message: `El campo no puede estar vacío.`,
            field: fieldName
        }
    }
}

//E-MAIL
exports.email = (fieldValue, fieldName) => {
    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fieldValue)) {
        return {
            message: `${fieldName} no es un e-mail correcto.`,
            field: fieldName
        }
    }
}

//DNI
exports.dni = (fieldValue, fieldName) => {

    if (!/^\d{8}[a-zA-Z]$/.test(fieldValue)) {
        return {
            message: `No es un formato de DNI correcto.`,
            field: fieldName
        }
    }

    numero = parseInt(fieldValue.substr(0, fieldValue.length - 1)) % 23;
    letra = fieldValue.substr(fieldValue.length - 1, 1);

    ref = 'TRWAGMYFPDXBNJZSQVHLCKET';
    ref = ref.substr(numero, 1);

    if (ref != letra.toUpperCase()) {
        return {
            message: `No es un DNI correcto.`,
            field: fieldName
        }
    }
}

//CIF
exports.cif = (fieldValue, fieldName) => {

    if (!fieldValue || fieldValue.length !== 9) {
        return {
            message: `El CIF es demasiado corto.`,
            field: fieldName
        }
    }

    var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    var digits = fieldValue.substr(1, fieldValue.length - 2);
    var letter = fieldValue.substr(0, 1);
    var control = fieldValue.substr(fieldValue.length - 1);
    var sum = 0;
    var i;
    var digit;

    if (!letter.match(/[A-Z]/)) {
        return {
            message: `El formato del CIF no es correcto.`,
            field: fieldName
        }
    }

    for (i = 0; i < digits.length; ++i) {
        digit = parseInt(digits[i]);

        if (isNaN(digit)) {
            return {
                message: `El formato del CIF no es correcto.`,
                field: fieldName
            }
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
        return String(digit) === control;
    }
    if (letter.match(/[NPQRSW]/)) {
        return letters[digit] === control;
    }

    if (!String(digit) === control && !letters[digit] === control) {
        return {
            message: `El CIF no es correcto.`,
            field: fieldName
        }
    }

}

//STRING MAX EXTENSION
exports.maxtsn = (fieldValue, fieldName, extension) => {
    if (fieldValue.length > extension) {
        return {
            message: `El campo es demasiado largo.`,
            field: fieldName
        }
    }
}

//STRING MIN EXTENSION
exports.mnxtsn = (fieldValue, fieldName, extension) => {
    if (fieldValue.length < extension) {
        return {
            message: `El campo es demasiado corto.`,
            field: fieldName
        }
    }
}

//JSON
exports.jsobject = (fieldValue, fieldName) => {
    if (fieldValue.constructor != ({}).constructor) {
        return {
            message: `El campo ${fieldName} no es un objeto JSON.`,
            field: fieldName
        }
    }
}

//NOMBRE
exports.humanname = (fieldValue, fieldName) => {
    if (!/^[a-zA-Záéíóúàèìòùäëïöü]*(\s[a-zA-Záéíóúàèìòùäëïöü]*)*?$/.test(fieldValue)) {
        return {
            message: `El campo no es válido.`,
            field: fieldName
        }
    }
}

//TIPO DE VÍA
exports.tipovia = (fieldValue, fieldName) => {
    if (!/^(C.\/|Avda.\/|Crtra.\/)$/.test(fieldValue)) {
        return {
            message: `El campo no es válido.`,
            field: fieldName
        }
    }
}

//NUMERO
exports.number = (fieldValue, fieldName) => {
    if (typeof parseInt(fieldValue) != "number") {
        return {
            message: `El campo no es válido.`,
            field: fieldName
        }
    }
}

//REGEX
exports.regex = (fieldValue, fieldName, regex) => {
    if (!regex.test(fieldValue)) {
        return {
            message: `El campo no es válido.`,
            field: fieldName
        }
    }
}

//RAZON SOCIAL
exports.razonsocial = (fieldValue, fieldName) => {

    const razonsocial =
        import ("../models/razonsocial.enum");

    fieldValue = fieldValue.trim();

    const indexSiglas = fieldValue.lastIndexOf('S.');
    const siglas = fieldValue.substr(indexSiglas, fieldValue.length);
    const nombre = fieldValue.substr(0, indexSiglas).trim();

    if (JSON.stringify(this.humanname(nombre)) != "{}") {
        return {
            message: `El nombre no es válido.`,
            field: fieldName
        }
    }
    if (Object.keys(razonsocial).find(key => razonsocial[key] === siglas) == undefined) {
        return {
            message: `Las siglas no son válidas.`,
            field: fieldName
        }
    }
}