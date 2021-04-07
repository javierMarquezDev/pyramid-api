class Math {

    add(x, y) {

        return x + y;

    }

    substract(x, y) {

        return x - y;

    }

    multiply(x, y) {

        return x * y;

    }

    divide(x, y) {

        return (y == 0 ? 'Math Error' : x / y);

    }

}

exports.Math = Math;