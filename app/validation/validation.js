const myLogger = require("../log/logger");

const rsocialsiglas = require("../models/razonsocial.enum").razonsocial;

//VALIDACIÓN DE CAMPO O CADENA VACÍA
exports.empty = (fieldValue) => {
    if (fieldValue === "" || fieldValue === null || fieldValue === "null") {
        myLogger.log(fieldValue);
        return `El campo no puede estar vacío.`;
    }
}

//E-MAIL
exports.email = (fieldValue) => {
    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fieldValue)) {
        return `${fieldValue} no es un e-mail correcto.`
    }
}

//TELÉFONO
exports.tfn = (fieldValue) => {
    if (!/^\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(fieldValue)) {
        return `${fieldValue} no es un teléfono correcto.`
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
exports.cif = (cif) => {

    if (!cif || cif.length !== 9) {
		return false;
	}

	var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
	var digits = cif.substr(1, cif.length - 2);
	var letter = cif.substr(0, 1);
	var control = cif.substr(cif.length - 1);
	var sum = 0;
  var i;
	var digit;

	if (!letter.match(/[A-Z]/)) {
		return false;
	}

	for (i = 0; i < digits.length; ++i) {
		digit = parseInt(digits[i]);

		if (isNaN(digit)) {
			return false;
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

	return String(digit) === control || letters[digit] === control;
}

function checkCif() {
	var cifs = document.getElementById('cif').value.split(',');
  var message = document.getElementsByClassName('message')[0];
  
  for (var i = 0; i < cifs.length; ++i) {
  	if (isValidCif(cifs[i].trim())) {
			message.innerHTML += '<br />CIF ' + cifs[i] + ' válido';
  	} else {
  		message.innerHTML += '<br />CIF ' + cifs[i] + ' no válido';
  	}
  }

}

//STRING MAX EXTENSION
exports.maxtsn = (fieldValue, extension) => {
    if (fieldValue != undefined && fieldValue.length > extension) {
        return `El campo es demasiado largo.`
    }
}

//STRING MIN EXTENSION
exports.mnxtsn = (fieldValue, extension) => {
    if (fieldValue != undefined && fieldValue.length < extension) {
        return `El campo es demasiado corto.`
    }
}

//JSON
exports.jsobject = (fieldValue) => {
    if (fieldValue.constructor != ({}).constructor) {
        return `El campo ${fieldValue} no es un objeto JSON.`
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
    if (parseInt(fieldValue) == NaN) {
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