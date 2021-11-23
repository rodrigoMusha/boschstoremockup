function login(){
    let user = loginRequest($("#email").val(),$("#pass").val());
    if(user){
        console.log("Login successful");
        window.localStorage.setItem("boschsession", JSON.stringify(user));
        window.location.href='pages/home.html' //go to products page.
    }else{
        $("#error").show();
         $("#pass").val("");
    }
}

$(document).ready(function(){
    $("#login").submit(function(event){
        event.preventDefault();
        login();
    })
    $("#email").on("input", function(){
        $("#error").hide();
    });
    $("#pass").on("input", function(){
        $("#error").hide();
    });
})  

function loginRequest(email, pass){
    let users = JSON.parse(window.localStorage.getItem("boschuserlist"));
    if(!users){
        users =[];
    }
    for(let i =0;i<users.length;i++){
        if(users[i].email == email && users[i].pass == pass){
            return users[i];
        }
    }
    return false;
}