
type Return = { readonly _unit: "Return" };
type Price = { readonly _unit: "Price" };
type Directional = { readonly _geom: "Directional" };
type Metric = { readonly _geom: "Metric" };

class RawVector<Unit> {
    private constructor (
        readonly values: number[],
    ) {}

    static of<Unit>(values: number[]): RawVector<Unit> {
        return new RawVector<Unit>(values)
    }

    toMetric(): MetricVector<Unit> {
        return MetricVector.of<Unit>([...this.values]);
    }
}

class DirectionalVector {
    private constructor (
        readonly values: number[],
    ) {}

    static normalize<U>(raw: RawVector<U>): DirectionalVector {
        const norm = Math.sqrt(
            raw.values.reduce((s, x) => s + x * x, 0)
        )

        if (norm == 0) {
            throw new Error("Cannot normalize zero vectors" +
                "")
        }
    }
}