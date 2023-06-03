let frac = {};
{
    let f = frac;
    f.i = (a,b) => [a,b];
    
    let recgcd = function recgcd (a,b) {
        while (b > 0) {
            [a,b] = [b, a%b];
        }
        return a; //last nonzero b
    };
    
    f.gcd = function gcdinit (a,b) {
        let gcd = recgcd;
        if (a < 0) { a = -a;}
        if (b < 0) {b = -b;}
        if (a === b) {return a;}
        if (a < b) { [a,b]= [b,a];}
        return gcd(a,b); 
    };
    
    f.scale = function scale (a,b) {
        let gcd = f.gcd(a,b);
        let r = b / gcd;
        let s = a / gcd;
        return [r, s, r*a]; 
    }
    
    f.a = ([a,b], [c,d]) => {
        let [r,s, lcm] = f.scale(b, d);
        return [a*r + c*s, lcm];
    };
    
    f.neg = ([a,b]) => [-a,b];
    
    f.s = (a,b) => f.a(a, f.neg(b) );
    
    f.m = ([a,b],[c,d]) => {
        return [a*c, b*d];
    };
    
    f.recip = ([a,b]) => [b,a];
    
    f.d = (a, b) => f.m(a, f.recip(b));
    
    f.exp = ([a,b], n) => [a ** n, b ** n];
}
