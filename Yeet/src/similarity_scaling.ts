
// Think about types in intermediate steps. They don't just represent an object at the start or end
//  of a program, they can represent all the intermediate steps that object takes
//  Raw Vector -> Transposed Vector, Raw Matrix -> Transposed Matrix, Transposed Vector (Row wise) -> Projected Vector, etc.


type Brand<T, B> = T & { __brand__: B }
type KMatrix<C extends number, N extends number> = Brand<number[][], "Key"> & { cols: C } & { tokenCount: N }
type QMatrix<C extends number, N extends number> = Brand<number[][], "Query"> & { cols: C } & { tokenCount: N }
type dotProductScalar = Brand<number, "Dot Product">
type UnscaledSimilarityMatrix<D extends number, K extends number, Q extends number> =
    Brand<number[][], "UnscaledSimilarityMatrix"> & { DK: D } & { NK: K } & { NQ: Q }

type ScaledSimilarityMatrix<n_k extends number> =
    Brand<number[][], "ScaledSimilarityMatrix"> & { NK: n_k }

function rowWiseDot(vec1: number[], vec2: number[]): dotProductScalar {


    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
        sum += vec1[i] * vec2[i];
    }
    return sum as dotProductScalar

}

function computeSimilarity<C extends number, N_K extends number, N_Q extends number>(Q: QMatrix<C, N_Q>, K: KMatrix<C, N_K>): UnscaledSimilarityMatrix<C, N_K, N_Q> {

    const d_k: number = Q.cols;
    const inpTokensQ: number = Q.length;
    const inptokensK: number = K.length; //Not necessarily required

    let outputMatrix = Array.from({ length: inpTokensQ }, () => Array( inptokensK ));

    for (let i = 0; i < inpTokensQ; i++) {
        for (let j = 0; j < inptokensK; j++) {
            outputMatrix[i][j] = rowWiseDot( Q[i], K[j] )
        }
    }

    return outputMatrix as UnscaledSimilarityMatrix<C, N_K, N_Q>

}

function scaleSimilarityMatrix<d_k extends number, n_k extends number, n_q extends number>(QK: UnscaledSimilarityMatrix<d_k, n_k, n_q>): ScaledSimilarityMatrix<n_k> {

    const nk: number = QK.NK;
    const nq: number = QK.NQ;

    let outputArray = Array.from( {length: nq }, () => Array( nk ));

    for (let i = 0; i < nq; i++) {
        for (let j = 0; j < nk; j++) {
            outputArray[i][j] = QK[i][j] / Math.sqrt(QK.DK)
        }
    }

    return outputArray as ScaledSimilarityMatrix<n_k>

}



