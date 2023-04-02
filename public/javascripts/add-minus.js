
function eqty(){
    var x=document.getElementById('num').innerHTML;
    Number(x);
    document.getElementById("val").setAttribute('value', x);
}

function plus(){
    var x=document.getElementById('num').innerHTML;
    x++;
    document.getElementById('num').innerHTML=x;
}

function minus(){
    var x=document.getElementById('num').innerHTML;
    if (x==1){
        document.getElementById('num').innerHTML=x;
        document.getElementById("val").setAttribute('value', x)
    }else{
        x--;
        document.getElementById('num').innerHTML=x;
    }
}