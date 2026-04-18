

type Brand<T, B> = T & { __brand: B };

type QueryVec = Brand<DotProd[], 'Query'>;
type KeyVec = Brand<DotProd[], 'Key'>;
type ValueVec = Brand<DotProd[], 'Value'>;
type DotProd = Brand<number, 'DotProd'>;
type Weights = Brand<number[], 'Weight'>

type EmbeddingVector = Brand<number[], 'EmbeddingVector'>;
type ProjectionMatrix<InputVec, OutputVec> = (Input: InputVec) => OutputVec;

type W_Q = ProjectionMatrix<EmbeddingVector, QueryVec>;
type W_K = ProjectionMatrix<EmbeddingVector, KeyVec>;
type W_V = ProjectionMatrix<EmbeddingVector, ValueVec>;


function makeProjection<Out>(weights: Weights[]): (Input: EmbeddingVector[]) => Out[] | undefined {
    return (Input: EmbeddingVector[]): Out[] | undefined => {

        const SeqLen= Input[0].length;
        const inpRow = Input.length;
        const MatLen = weights[0].length;
        const MatRow = weights.length;

        if (!(SeqLen === MatLen)) {
            console.log("Dimensions of inverted matrix don't match input vector.")
            return undefined;
        }

        let outputMatrix: DotProd[][] = Array.from({ length: inpRow }, () => new Array( MatRow ));
        for (let i = 0; i < inpRow; i++) {
            for (let j = 0; j < MatRow; j++) {
                outputMatrix[i][j] = dotProduct(Input[i], weights[j]);
            }
        }
        return outputMatrix as Out[]
    }
}

function makeSimilarityMatrix(Q: QueryVec[], K: KeyVec[]): DotProd[][] {

    let qLen = Q.length;
    let kLen = K.length;


    let outputMatrix: DotProd[][] = Array.from({ length: qLen }, () => new Array( kLen ));
    for (let i = 0; i < qLen; i++) {
        for (let j = 0; j < kLen; j++) {
            outputMatrix[i][j] = dotProduct(Q[i], K[j]);
        }
    }
    return outputMatrix as DotProd[][];

}


function dotProduct<V1 extends QueryVec | EmbeddingVector, V2 extends KeyVec | Weights>(Vec1: V1, Vec2: V2): DotProd {

    let total = 0;
    for (let i = 0; i < Vec1.length; i++) {
        total += Vec1[i] * Vec2[i];
    }

    return total as DotProd;

}


// Constructors
function makeEmbedding(raw: number[]): EmbeddingVector {
    return raw as unknown as EmbeddingVector;
}

function makeWeights(raw: number[]): Weights {
    return raw as unknown as Weights;
}

// Test data: 3 tokens, d_model = 4
const embeddings: EmbeddingVector[] = [
    makeEmbedding([1, 0, 2, 1]),
    makeEmbedding([0, 1, 1, 0]),
    makeEmbedding([1, 1, 0, 1]),
];

// Weight matrices: [d_k × d_model] = [2 × 4]
const qWeights: Weights[] = [
    makeWeights([1, 0, 1, 0]),
    makeWeights([0, 1, 0, 1]),
];

const kWeights: Weights[] = [
    makeWeights([0, 1, 1, 0]),
    makeWeights([1, 0, 0, 1]),
];

// Create projections
const projectQ = makeProjection<QueryVec>(qWeights);
const projectK = makeProjection<KeyVec>(kWeights);

// Run projections
const Q = projectQ(embeddings);
const K = projectK(embeddings);

console.log("Q:", Q);
console.log("K:", K);

// Similarity matrix
if (Q && K) {
    const sim = makeSimilarityMatrix(Q, K);
    console.log("Similarity:", sim);
}

