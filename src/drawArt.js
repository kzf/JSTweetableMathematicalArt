
/**********************************
 * ART DEFINITIONS
 *
 **********************************/

/* Helper functions */
var sq = function(x) { return x*x; }
var cb = function(x) { return Math.abs(x*x*x); }
var cr = function(x) { return nthroot(x, 3); }
var sqrt = Math.sqrt;
var abs = Math.abs;
var sin = Math.sin;
var Int = Math.floor;
var log = Math.log;
var pow = Math.pow;
var rand = Math.random;



function fix(n) {
    /* Trying to get it to look like the GIMP rendered PPM
     * Unding up with negative numbers but canvas doesn't seem to mind*/
    var a = n&255;
    var strange = a>>3;
    a = a&3;
    return (64*a - 3*strange)<<2;
}

/* Code to handle nth root nicely for negative numbers
 * source: http://stackoverflow.com/questions/7308627/javascript-calculate-the-nth-root-of-a-number */
function nthroot(x, n) {
  try {
    var negate = n % 2 == 1 && x < 0;
    if(negate)
      x = -x;
    var possible = Math.pow(x, 1 / n);
    n = Math.pow(possible, n);
    if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
      return negate ? -possible : possible;
  } catch(e){}
}

var arts = [
    { author: "user1455003",
      image: "assets/images/user1455003.png",
      artlink: "http://codegolf.stackexchange.com/a/35595",
      authorlink: "http://codegolf.stackexchange.com/users/8055/user1455003",
      f: {
        C1: 512,
        C2: 1024,
        constants: ['C1', 'C2'],
        red: function(i, j) { if (j < this.C1) j=this.C2-j; return (i % j) | i; },
        green: function(i, j) { if (j < this.C1) j = this.C2 -j; return (this.C2-i ^ (i %j)) % j; },
        blue: function(i, j) { if (j < this.C1) j = this.C2 -j; return this.C2-i | i+j %this.C1; }
        }
    },
    { author: "Kyle McCormick",
      image: "assets/images/kylemccormick_1.png",
      artlink: "http://codegolf.stackexchange.com/q/35569",
      authorlink: "http://codegolf.stackexchange.com/users/26926/kyle-mccormick",
      f: {
        C1: 1024,
        C2: 2,
        C3: 2,
        constants: ['C1', 'C2', 'C3'],
        red: function(i, j) { return Math.sqrt(sq(i-this.C1/this.C2)*sq(j-this.C1/this.C2)*this.C3); },
        green: function(i, j) { return Math.sqrt((sq(i-this.C1/this.C2)|sq(j-this.C1/this.C2))
                                                 *(sq(i-this.C1/this.C2)&sq(j-this.C1/this.C2))); },
        blue: function(i, j) { return Math.sqrt(sq(i-this.C1/this.C2)&sq(j-this.C1/this.C2)*this.C3); }
        }
    },
    { author: "Kyle McCormick",
      image: "assets/images/kylemccormick_2.png",
      artlink: "http://codegolf.stackexchange.com/q/35569",
      authorlink: "http://codegolf.stackexchange.com/users/26926/kyle-mccormick",
      f: {
        constants: [],
        red: function(i, j) { return i&&j?(i%j)&(j%i) : 0; },
        green: function(i, j) { return i&&j?(i%j)+(j%i):0; },
        blue: function(i, j) { return i&&j?(i%j)|(j%i):0; }
        }
    },
    { author: "githubphagocyte",
      image: "assets/images/githubphagocyte_1.png",
      artlink: "http://codegolf.stackexchange.com/a/35641",
      authorlink: "http://codegolf.stackexchange.com/users/20283/githubphagocyte",
      f: {
        C1: 1024,
        C2: 99,
        C3: 3,
        C4: 2,
        C5: 512,
        C6: 2,
        constants: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
        red: function(i, j) { var s=this.C3/(j+this.C2);
                              return (parseInt((i+this.C1)*s+j*s)%this.C4+parseInt((this.C1*this.C6-i)*s+j*s)%this.C4)*this.C5; },
        green: function(i, j) { var s = this.C3/(j+this.C2);
                                return (parseInt((i+this.C1)*s+j*s)%this.C4+parseInt((this.C1*this.C6-i)*s+j*s)%this.C4)*this.C5; },
        blue: function(i, j) { var s = this.C3/(j+this.C2);
                               return (parseInt((i+this.C1)*s+j*s)%this.C4+parseInt((this.C1*this.C6-i)*s+j*s)%this.C4)*this.C5; }
        }
    },
    { author: "githubphagocyte",
      image: "assets/images/githubphagocyte_2.png",
      artlink: "http://codegolf.stackexchange.com/a/35641",
      authorlink: "http://codegolf.stackexchange.com/users/20283/githubphagocyte",
      f: {
        C1: 1024,
        C2: 99,
        C3: 3,
        C4: 2,
        C5: 512,
        C6: 2,
        C7: 700,
        C8: 5,
        C9: 100,
        C10: 35,
        constants: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
        red: function(i, j) { var s=this.C3/(j+this.C2);
                              var y=(j+Math.sin((i*i+sq(j-this.C7)*this.C8)/this.C9/this.C1)*this.C10)*s;
                              return (parseInt((i+this.C1)*s+y)%this.C4+parseInt((this.C1*this.C6-i)*s+y)%this.C4)*this.C5; },
        green: function(i, j) { var s = this.C3/(j+this.C2);
                                var y=(j+Math.sin((i*i+sq(j-this.C7)*this.C8)/this.C9/this.C1)*this.C10)*s;
                                return (parseInt((i+this.C1)*s+y)%this.C4+parseInt((this.C1*this.C6-i)*s+y)%this.C4)*this.C5; },
        blue: function(i, j) { var s = this.C3/(j+this.C2);
                               var y=(j+Math.sin((i*i+sq(j-this.C7)*this.C8)/this.C9/this.C1)*this.C10)*s;
                               return (parseInt((i+this.C1)*s+y)%this.C4+parseInt((this.C1*this.C6-i)*s+y)%this.C4)*this.C5; }
        }
    },
    { author: "githubphagocyte",
      image: "assets/images/githubphagocyte_3.png",
      artlink: "http://codegolf.stackexchange.com/a/35641",
      authorlink: "http://codegolf.stackexchange.com/users/20283/githubphagocyte",
      f: {
        C1: 1024,
        C2: 99,
        C3: 3,
        C4: 2,
        C5: 512,
        C6: 2,
        C7: 700,
        C8: 5,
        C9: 100,
        C10: 35,
        C11: 5,
        C12: 29,
        constants: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12'],
        red: function(i, j) { var s=this.C3/(j+this.C2);
                              var y=(j+Math.sin((i*i+sq(j-this.C7)*this.C8)/this.C9/this.C1)*this.C10)*s;
                              return (parseInt((i+this.C1)*s+y)%this.C4+parseInt((this.C1*this.C6-i)*s+y)%this.C4)*this.C5; },
        green: function(i, j) { var s = this.C3/(j+this.C2);
                                var y=(j+Math.sin((i*i+sq(j-this.C7)*this.C8)/this.C9/this.C1)*this.C10)*s;
                                return (parseInt(this.C11*((i+this.C1)*s+y))%this.C4+parseInt(this.C11*((this.C1*this.C6-i)*s+y))%this.C4)*this.C5; },
        blue: function(i, j) { var s = this.C3/(j+this.C2);
                               var y=(j+Math.sin((i*i+sq(j-this.C7)*this.C8)/this.C9/this.C1)*this.C10)*s;
                               return (parseInt(this.C12*((i+this.C1)*s+y))%this.C4+parseInt(this.C12*((this.C1*this.C6-i)*s+y))%this.C4)*this.C5; }
        }
    },
    { author: "cjfaure",
      image: "assets/images/cjfaure.png",
      artlink: "http://codegolf.stackexchange.com/a/35689",
      authorlink: "http://codegolf.stackexchange.com/users/13702/cjfaure",
      f: {
        C1: 73,
        C2: 609,
        C3: 1,
        C4: 860,
        C5: 162,
        C6: 115,
        C7: 200,
        C8: 160,
        C9: 60,
        C10: 86,
        C11: 860,
        C12: 844,
        C13: 200,
        C14: 250,
        C15: 20,
        constants: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15'],
        red: function(i, j) { return parseInt((sqrt(sq(this.C1-i)+sq(this.C2-j))+this.C3)/(sqrt(abs(sin((sqrt(sq(this.C4-i)+sq(this.C5-j)))/this.C6)))+this.C3)/this.C7)*256; },
        green: function(i, j) { return parseInt((sqrt(sq(this.C8-i)+sq(this.C9-j))+this.C3)/(sqrt(abs(sin((sqrt(sq(this.C10-i)+sq(this.C11-j)))/this.C6)))+this.C3)/this.C7)*256; },
        blue: function(i, j) { return parseInt((sqrt(sq(this.C12-i)+sq(this.C13-j))+this.C3)/(sqrt(abs(sin((sqrt(sq(this.C14-i)+sq(this.C15-j)))/this.C6)))+this.C3)/this.C7)*256; }
        }
    },
    { author: "faubiguy",
      image: "assets/images/faubiguy.png",
      artlink: "http://codegolf.stackexchange.com/a/35596",
      authorlink: "http://codegolf.stackexchange.com/users/29990/faubiguy",
      f: {
        C1: 4,
        C2: 32,
        C3: 512,
        C4: 384,
        C5: 2,
        C6: 512,
        constants: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
        red: function(i, j) { 
        var a=(j?i%j:i)*this.C1;
        var b=i-this.C2;
        var c=j-this.C2;
        return fix((sq(abs(i-this.C3))+sq(abs(j-this.C6))>sq(this.C4)?a:Int(sqrt((b+c)/this.C5))^cb((i-j)*this.C5))); },
        green: function(i, j) {
        var a=(j?i%j:i)*this.C1;
        return fix((sq(abs(i-this.C3))+sq(abs(j-this.C6))>sq(this.C4)?a:Int(sqrt((i+j)/this.C5))^cb((i-j)*this.C5)));
        },
        blue: function(i, j) { 
        var a=(j?i%j:i)*this.C1;
        var b=i+this.C2;
        var c=j+this.C2;
        return fix((sq(abs(i-this.C3))+sq(abs(j-this.C6))>sq(this.C4)?a:Int(sqrt((b+c)/this.C5))^cb((b-c)*this.C5))); }
        }
    },
    { author: "Martin B&#252;ttner",
      image: "assets/images/martinbuttner.png",
      artlink: "http://codegolf.stackexchange.com/a/35601",
      authorlink: "http://codegolf.stackexchange.com/users/8478/martin-b%c3%bcttner",
      f: {
        C1: 0,
        C2: 0,
        C3: 256,
        C4: 768.0,
        C5: 512,
        C6: 2,
        C7: 512.0,
        C8: 4,
        C9: 2,
        C10: 31,
        C11: 8,
        C12: 63,
        C13: 4,
        constants: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13'],
        red: function(i, j) { 
        var a,x=this.C1,y=this.C2;for(var k=0;k++<this.C3;){a=x*x-y*y+(i-this.C4)/this.C5;y=this.C9*x*y+(j-this.C7)/this.C5;x=a;if(x*x+y*y>this.C8)break;}return (k>this.C10?256:k*this.C11)<<2;
        },
        green: function(i, j) {
        var a,x=this.C1,y=this.C2;for(var k=0;k++<this.C3;){a=x*x-y*y+(i-this.C4)/this.C5;y=this.C9*x*y+(j-this.C7)/this.C5;x=a;if(x*x+y*y>this.C8)break;}return (k>this.C12?256:k*this.C13)<<2;
        },
        blue: function(i, j) { 
        var a,x=this.C1,y=this.C2;for(var k=0;k++<this.C3;){a=x*x-y*y+(i-this.C4)/this.C5;y=this.C9*x*y+(j-this.C7)/this.C5;x=a;if(x*x+y*y>this.C8) break;}return k<<2;
        }
        }
    },
    { author: "teh internets is made of catz",
      image: "assets/images/teh-internets-is-made-of-catz.png",
      artlink: "http://codegolf.stackexchange.com/a/35674",
      authorlink: "http://codegolf.stackexchange.com/users/11744/teh-internets-is-made-of-catz",
      f: {
        C1: 1024,
        C2: 200,
        C3: 4,
        C4: 36237,
        C5: 70000,
        C6: 36237,
        C7: 32000,
        C8: 27015,
        C9: 32000,
        C10: 128,
        C11: 128,
        C12: 128,
        constants: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12'],
        D: function(x) { return (x - this.C1/2)/(this.C1/2); },
        red: function(i, j) {
        var x=this.D(i),y=this.D(j),X,Y,n=0;while(n++<this.C2&&(X=x*x)+(Y=y*y)<this.C3){x=X-Y+this.C4/100000;y=2*x*y+this.C7/100000;}return log(n)*this.C10;
        },
        green: function(i, j) {
        var x=this.D(i),y=this.D(j),X,Y,n=0;while(n++<this.C2&&(x*x+y*y)<this.C3){X=x;Y=y;x=X*X-Y*Y+-this.C5/100000;y=2*X*Y+this.C8/100000;}return log(n)*this.C11;
        },
        blue: function(i, j) { 
        var x=this.D(i),y=this.D(j),X,Y,n=0;while(n++<this.C2&&(x*x+y*y)<this.C3){X=x;Y=y;x=X*X-Y*Y+this.C6/100000;y=2*X*Y+this.C9/100000;}return log(n)*this.C12;
        }
        }
    },
    { author: "Manuel Kasten",
      image: "assets/images/manuelkasten.png",
      artlink: "http://codegolf.stackexchange.com/a/35739",
      authorlink: "http://codegolf.stackexchange.com/users/30166/manuel-kasten",
      f: {
        
        constants: [],
        red: function(i, j) {
           var a=0,b=0,c,d,n=0;
           while((c=a*a)+(d=b*b)<4&&n++<880)
           {b=2*a*b+j*8e-9-.645411;a=c-d+i*8e-9+.356888;}
           return 1023*pow((n-80)/800,3.);
        },
        green: function(i, j) {
           var a=0,b=0,c,d,n=0;
           while((c=a*a)+(d=b*b)<4&&n++<880)
           {b=2*a*b+j*8e-9-.645411;a=c-d+i*8e-9+.356888;}
           return 1023*pow((n-80)/800,.7);
        },
        blue: function(i, j) { 
           var a=0,b=0,c,d,n=0;
           while((c=a*a)+(d=b*b)<4&&n++<880)
           {b=2*a*b+j*8e-9-.645411;a=c-d+i*8e-9+.356888;}
           return 1023*pow((n-80)/800,.5);
        }
        }
    },
    { author: "Manuel Kasten",
      image: "assets/images/manuelkasten_2.png",
      artlink: "http://codegolf.stackexchange.com/a/35744",
      authorlink: "http://codegolf.stackexchange.com/users/30166/manuel-kasten",
      f: {
        constants: [],
        k1: 0,
        k2: 0,
        k3: 0,
        red: function(i, j) {
           this.k1+=rand();var l=Math.round(this.k1);l%=512;return (l>255?511-l:l)<<2;
        },
        green: function(i, j) {
           this.k2+=rand();var l=Math.round(this.k2);l%=512;return (l>255?511-l:l)<<2;
        },
        blue: function(i, j) { 
           this.k3+=rand();var l=Math.round(this.k3);l%=512;return (l>255?511-l:l)<<2;
        }
        }
    }
]



/**********************************
 * WORKER
 *
 **********************************/

var updateCanvas = function(data, f, canvas_size) {
    var step = 1024/canvas_size;
    var i = 0;
    for (var y = 0; y < 1024; y += step) {
        for (var x = 0; x < 1024; x += step) {
            data[i++] = f.red(x, y) >> 2;
            data[i++] = f.green(x, y) >> 2;
            data[i++] = f.blue(x, y) >> 2;
            data[i++] = 255; // alpha
        }
        postMessage({
            type: "progress",
            percent: y/1024
        });
    }
}

addEventListener("message", function(e) {
    if (e.data.type === 'job') {
        var imageData = e.data.imageData;
        console.log(e.data);
        updateCanvas(imageData.data, arts[e.data.id].f, e.data.size);
        postMessage({
            type: 'art',
            imageData: imageData,
            id: e.data.id
        });
    }
});

// Generate a copy-able version of the arts array
var prettifyCode = function(code) {
        return code.replace(/this\./g, "")
                   .replace(/\s+/g, " ")
                   .replace(/(C\d+)/g, "<span class='constant'>$1<\/span>")
                   .replace(/([;{]) /g, "$1<br>&nbsp;&nbsp;&nbsp;&nbsp;");
    }
var textArts = [];
var i;
for (i = 0; i < arts.length; i++) {
    textArts[i] = {
            author: arts[i].author,
            image: arts[i].image,
            artlink: arts[i].artlink,
            authorlink: arts[i].authorlink,
            f: {}
        };
    for (var a in arts[i].f) {
        if (arts[i].f.hasOwnProperty(a)) {
            if (typeof arts[i].f[a] !== 'function') {
                textArts[i].f[a] = arts[i].f[a];
            } else {
                textArts[i].f[a] = prettifyCode(arts[i].f[a].toString());
            }
        }
    }
}

console.log(textArts);

postMessage({
    type: "artlist",
    list: textArts
});

