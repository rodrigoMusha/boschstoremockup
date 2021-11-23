function register(){
    if($("#pass").val() !=$("#pass2").val() ){
        $("#passerror").show();
        $("#pass").focus();
        $("#pass").val("");
        $("#pass2").val("");
    } else{
        let user = {
            "name":$("#name").val(),
            "email":$("#email").val(),
            "tel":$("#tel").val(),
            "pass":$("#pass").val()
        }
        if(createUser(user)){
            $(".signup").hide();
            $("#sucesso").show();
        } else{
            $("#usererror").show();
            $("#email").focus();
        }
    }
}

$(document).ready(function(){
    $("#signup").submit(function(event){
        event.preventDefault();
        register();
    })
    $("#tel").mask("(00) 00000-0000");
    $("#pass2").on("input", function(){
            if($("#pass").val() ==$("#pass2").val()){
                $("#passerror").hide();
            }
        });
    $("#email").on("input", function(){
        $("#emailerror").hide();
        $("#usererror").hide();
    });
})  

function createUser(user){
    let users = JSON.parse(window.localStorage.getItem("boschuserlist"));
    if(!users){
        users =[];
    }
    for(let i =0;i<users.length;i++){
        if(users[i].email== user.email){
            return false;
        }
    }    
    users.push(user);
    window.localStorage.setItem("boschuserlist", JSON.stringify(users));
    return true;
}


