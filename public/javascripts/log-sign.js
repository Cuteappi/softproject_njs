    const button1= document.getElementById("bh1");
    button1.disabled=true;

    const button2= document.getElementById("bh2");
    button2.disabled=true;

    function hide(){

        document.getElementById("hide0").style.display="none";
        document.getElementById("hide1").style.display="none";
        document.getElementById("hide2").style.display="none";
        document.getElementById("bh2").style.display="none";

        document.getElementById("hide").style.marginBottom="100px";
        document.getElementById("hide4").style.marginBottom="100px";

        
    }

    hide();

    function signup(){
        document.getElementById('legend').innerHTML = "Sign Up";

        document.getElementById("hide0").style.display="block";
        document.getElementById("hide1").style.display="block";
        document.getElementById("hide2").style.display="block";
        document.getElementById("bh2").style.display="block";

        document.getElementById("hide0").disabled=false;
        document.getElementById("hide1").disabled=false;
        document.getElementById("hide2").disabled=false;

        document.getElementById("hide3").style.display="none";
        document.getElementById("bh1").style.display="none";

        document.getElementById("hide").style.marginBottom="40px";
        document.getElementById("hide0").style.marginBottom="40px";
        document.getElementById("hide1").style.marginBottom="40px";
        document.getElementById("hide2").style.marginBottom="40px";
        document.getElementById("hide3").style.marginBottom="40px";
        document.getElementById("hide4").style.marginBottom="40px";

    }

    function login(){
        document.getElementById('legend').innerHTML = "Login Here";
        document.getElementById("hide0").style.display="none";
        document.getElementById("hide1").style.display="none";
        document.getElementById("hide2").style.display="none";

        document.getElementById("hide0").disabled=true;
        document.getElementById("hide1").disabled=true;
        document.getElementById("hide2").disabled=true;

        document.getElementById("bh2").style.display="none";

        document.getElementById("hide3").style.display="block";
        document.getElementById("bh1").style.display="block";

        document.getElementById("hide").style.marginBottom="100px";
        document.getElementById("hide4").style.marginBottom="100px";
    }

    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('pass');
    let repass = document.getElementById('repass');
    let pnum = document.getElementById('pnum');

    function namevalidate(){

        // name check
        if(name.value===''){
            document.getElementById('one').innerHTML = 'Please enter a name';
            return false;
        }
        else if (/^[A-Za-z_0-9]+$/.test(String(name.value))){
            document.getElementById('one').innerHTML = '';
            return true;
        }else{
            document.getElementById('one').innerHTML = 'Invalid name';
            return false;
        }
    }

    function pnumvalidate(){
        if(pnum.value===''){
            document.getElementById('three').innerHTML = 'Please enter a phone number';
            return false;
        }
        else if (pnum.value.length != 10)
        {
            document.getElementById('three').innerHTML = 'Invalid phone number';
            return false;
        }else{
            document.getElementById('three').innerHTML = '';
            return true;
        } 
    }

    function emailvalidate(){
        if(email.value===''){
            document.getElementById('two').innerHTML = 'Please enter a email address';
            return false;
        }
        else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(String(email.value))){
            document.getElementById('two').innerHTML = '';
            return true;
        }else{
            document.getElementById('two').innerHTML = 'Invalid email';
            return false;
        }  
    }

    function passwordvalidate(){
        if(password.value!==repass.value){
            document.getElementById('five').innerHTML = 'Passwords dont match';
            return false;
        }else if(password.value=='' && repass.value==''){
            document.getElementById('five').innerHTML = 'Passwords cannot be null'
        }else{
            document.getElementById('five').innerHTML = '';
            return true;
        }

    }

    setInterval(function() {
        emailvalidate();
        pnumvalidate();
        namevalidate();
        passwordvalidate();

        let x=document.getElementById('legend').innerHTML;


        if(x =="Login Here"){
            if(namevalidate()&& password.value!=''){
                button1.disabled=false;
            }else{
                button1.disabled=true;
            }
        }

        if(x== "Sign Up"){
            if (emailvalidate() && pnumvalidate() && passwordvalidate() && namevalidate()){
                button2.disabled=false;
            }else{
                button2.disabled=true;
            }
        }

    }, 500);