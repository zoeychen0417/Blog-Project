
//function of check re-entered password is same with password
var check = function() {
    if (document.querySelector("#ps").value == document.querySelector("#reps").value) {
        document.querySelector("#message").style.color = 'green';
        document.querySelector("#message").innerHTML = 'Matching';
    } else {
        document.querySelector("#message").style.color = 'red';
        document.querySelector("#message").innerHTML = 'Not matching';
    }
};

//function of show password when user is typing
function showPS(){
    var x=document.querySelector("#ps");
    if(x.type==="password"){
        x.type="text";
    }else{
        x.type="password";
    }
};

//function of checking unique username
async function Monitor(u){
    const monitorResult = await fetch(`./uniqueUsername?username=${u.value}`)
    const ResultJson = await monitorResult.json();
    const box = document.querySelector("#unique_username");
    box.innerHTML = `${u.value} `;
    if(ResultJson.isExist){
        box.style.color = 'red';
        box.innerHTML += "has been token";
    }else{
        box.style.color = 'green';
        box.innerHTML += "is valid";
    }
    
};

window.addEventListener("load", function(){
    const deleteBtn = document.querySelector("#deleteBtn");
    if(deleteBtn){
        deleteBtn.addEventListener("click", function(){
            const check = window.confirm("Are your sure delete your account? ");
            if(check){
                 document.querySelector("#deleteConfirm").setAttribute("href","./deleteUser");
            }else{
                //do nothing;
            }
        });
    }


    const avatar_img = document.querySelector(".userAvatar img");
    if(avatar_img){
        // make avatar input be checked when user updates their informations
    if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon1").value){
        document.forms["signin_update"]["icon1"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon2").value){
        document.forms["signin_update"]["icon2"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon3").value){
        document.forms["signin_update"]["icon3"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon4").value){
        document.forms["signin_update"]["icon4"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon5").value){
        document.forms["signin_update"]["icon5"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon6").value){
        document.forms["signin_update"]["icon6"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon7").value){
        document.forms["signin_update"]["icon7"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon8").value){
        document.forms["signin_update"]["icon8"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon9").value){
        document.forms["signin_update"]["icon9"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon10").value){
        document.forms["signin_update"]["icon10"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon11").value){
        document.forms["signin_update"]["icon11"].checked=true;
    }else if(document.querySelector(".userAvatar img").getAttribute('value') == document.querySelector("#icon12").value){
        document.forms["signin_update"]["icon12"].checked=true;
    }

    }
    

   

});


