# Fractions

This produces the fraction arithmetic. A fraction is an array of two
numbers. They should probably be bigint. It encapsulates its methods as an
external and not as an object. So we feed it functions. 

    let frac = {};
    {
        _"body"
    }
    
## Body

    let f = frac;

We create a fraction with i for identity. 

    f.i = (a,b) => [a,b];

    _"common denominators"

    _"arithmetic"

## Common denominators

We need to get common denominators. We do this with greatest common
denominator finding, which is convenient with the modulus operator. 

We setup a recursive function where we start by making sure a > b > 0. 

    let recgcd = _":recursive";

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



[recursive]()

So we want to mimic the recursive descent, but since it could be large, we
will while it. 

    function recgcd (a,b) {
        while (b > 0) {
            [a,b] = [b, a%b];
        }
        return a; //last nonzero b
    }


## Arithmetic 

Addition is a, multiplication is m, division is d, subtraction s, and
exponentiation is exp. We assume pairing. We have separate sum and product
ones. 

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

##  Testing

    _"fractions" 


    let f = frac;
    let a = f.i(34n, 75n);
    let b = f.i(89n, 40n);

    console.log(f.a(a, b));
    console.log(f.s(a, b));
    console.log(f.m(a, b));
    console.log(f.d(a, b));


    /*
    console.log(frac.gcd(48, 38), 2);
    let a = 123489794798273582937450923875438457203123412341234123412341234112341234894752038947523089458n;
    let b = 10239849102382340958230582309852309485238980293828981841902834121234n;
    console.time();
    let c = a+b;
    console.timeEnd();
    console.log(c);
    console.time();
    let m = a*b;
    console.timeEnd();
    console.log(m);
    console.time();
    let s = a<b;
    console.timeEnd();
    console.log(s);    
    console.time();
    let r = frac.gcd(a,b);
    console.timeEnd(); //about a half second
    console.log(r,2);*/
    

[tests/frac.js](# "save:") 




