console.log("Rank Assumptions");

class Matrix<N extends number, M extends number> {
    constructor (
        readonly values: number[][],
    ) {
        this.values = values;
    }


    vectorProjection(vector: Vector<M>): Vector<N> | undefined {

        if (!(vector.values.length == this.values[0].length)) {
            console.error("Vector and matrix must have the same length");
            return undefined;
        }

        const cols = vector.values.length;
        const rows = this.values.length;

        let projection: number[]
            = new Array(cols);

        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                projection[i] = this.values[i][j] * vector.values[j];
            }
        }

        if (rows < cols) {
            let rank_def = true;
        } else {
            let rank_def = false;
        }

        console.log('vector', vector, ' projected onto ', matrix, ' is ', projection, '');
        return new Projection<M, N>(projection, rank_def as boolean);
    }

    invert(v: Vector<N> | Projection<M, N>): Vector<M> | undefined {

        if (v instanceof Projection && v.rankDeficient) {
            console.error("Cannot invert a rank deficient projection");
            return undefined;
        }

        const rows_matrix = this.values.length;
        const cols_matrix = this.values[0].length;
        // create a new array that where rows = cols and cols = rows, inverting our matrix
        let invert_matrix: number[][]
            = Array.from({ length: cols_matrix }, () => new Array( rows_matrix ).fill(0));

        // iterate over the rows and columns and swap
        for (i = 0; i < rows_matrix; i++) {
            for (j = 0; j < cols_matrix; j++) {
                invert_matrix[j][i] = matrix.values[i][j];
            }
        }

        const rows = invert_matrix.length;
        const cols = v.values.length;

        let invert_vector: number[] = new Array(cols_matrix);

        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                invert_vector[i] = invert_matrix[i][j] * v.values[j];
            }
        }

        return new Vector<M>(invert_vector);
    }

}

class Vector<R extends number> {
    constructor (
        readonly values: number[],
    ) {
        this.values = values;
    }
}
class Projection<From extends number, To extends number> {
    constructor (
        readonly values: number[],
        readonly rankDeficient: boolean,
    ) {
        this.values = values;
        this.rankDeficient = rankDeficient;
    }
}

Projection.invert()
Matrix.invert()

