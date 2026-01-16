
const REL_EPS = Number.EPSILON;
const MIN_STDDEV = 1e-12;

function mean(xs: number[]): number {
    const l = xs.length;
    const s: number = xs.reduce(
        (total, currentValue) => total + currentValue,
        0);
    return s/l
}

function variance(xs: number[]): number {

    if (xs.length < 2) {
        return 0;
    }


    const xm = mean(xs);
    let n: number = xs.length;
    const vx: number = xs.reduce(
        (total, currentValue) => total + Math.pow((currentValue - xm), 2),
        0)
    return vx/(n - 1);
}

function covariance(xs: number[], ys: number[]): number | undefined {

    if (xs.length != ys.length) {
        return undefined;
    }

    if (xs.length < 2) {
        return 0;
    }

    const xm = mean(xs);
    const ym = mean(ys);
    let n = xs.length;
    let cov = 0;
    for (let i = 0; i < n; i++) {
        const dvdot: number = (xs[i] - xm) * (ys[i] - ym);
        cov += dvdot;
    }
    return cov/(n-1);
}

function correlation(xs: number[], ys: number[]): number | undefined {

    if (xs.length < 2 || ys.length < 2) {
        return undefined;
    }

    if (xs.length != ys.length) {
        return undefined;
    }

    const cov = covariance(xs, ys);
    if (cov == undefined) {
        return undefined;
    }

    const xsVar: number = variance(xs);
    const ysVar: number = variance(ys);
    const denom: number = Math.sqrt(xsVar * ysVar);

    if (denom < Math.max(denom * REL_EPS, MIN_STDDEV)) {
        return undefined;
    }

    return cov/denom;

}

const a = [1, 2, 3, 4, 5];
const b = [2, 4, 6, 8, 10];

const corr1 = correlation(a, b);
console.log("corr(a, b) =", corr1); // ≈ 1

