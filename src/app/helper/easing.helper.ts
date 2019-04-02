export class EasingFunctions {
    static linear(t: number): number{
        return t;
    }
    static easeInQuad(t: number): number{
        return t * t;
    }
    static easeOutQuad(t: number): number{
        return t * (2 - t);
    }
    static easeInOutQuad(t: number): number{
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    static easeInCubic(t: number): number{
        return t * t * t;
    }
    static easeOutCubic(t: number): number{
        return (--t) * t * t + 1;
    }
    static easeInOutCubic(t: number): number{
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    static easeInQuart(t: number): number{
        return t * t * t * t;
    }
    static easeOutQuart(t: number): number{
        return 1 - (--t) * t * t * t;
    }
    static easeInOutQuart(t: number): number{
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }
    static easeInQuint(t: number): number{
        return t * t * t * t * t;
    }
    static easeOutQuint(t: number): number{
        return 1 + (--t) * t * t * t * t;
    }
    static easeInOutQuint(t: number): number{
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
}
