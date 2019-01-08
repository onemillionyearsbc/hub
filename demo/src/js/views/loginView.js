import { elements, strings } from './base';



export const getFormData = (form) => {
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        myData[id] = value;
    };

    // TODO get the right formData object for recruiter or jobseeker
    // TODO possibly this should be moved into the model
    var formData = {
        $class: strings.recruiterLoginNamespace,
        email: myData["email"],
        password: myData["password"]
    };

    return formData;
}

export const getSignOutData = (mail) => {
    var signOutData = {
        $class: "io.onemillionyearsbc.hubtutorial.SetLoggedIn",
        email: mail,
        loggedIn: false
    };
    return signOutData;
}

export const clearValidationErrorMessages = () => {
    var x = document.getElementById("email-error");
    clearError(x);
    var x = document.getElementById("password-error");
    clearError(x);
}

function clearError(x) {
    if (x.style.display != "none") {
        x.style.display = "none";
    }
}

export const clearServerErrorMessage = () => {
    elements.loginError.style = "none";
    elements.serverError.style = "none";
}

export const displayErrorFromServerMessage = () =>{

}

export const validateData = (data) => {
    var error = false;

    if (data.email.length === 0) {
        error = true;
        var x = document.getElementById("email-error");
        checkStyle(x);
    }
    if (data.password.length < 6) {
        error = true;
        var x = document.getElementById("password-error");
        checkStyle(x);
    }
    return error;
}

export const displayServerErrorMessage = (error) => {
    var x = document.getElementById(`signin-error`);
    var y = document.getElementById(`signin-server-error`);
  
    if (error != null) {
        x = document.getElementById(`signin-server-error`);
        y = document.getElementById(`signin-error`);
    } 
   
    x.style.display = "block";
    y.style.display = "none";
}

export const validateField = (element) => {    
    var x = document.getElementById(`${element.id}-error`);
    console.log("value for element = " + element.value);
   
    if (element.value.length === 0) {
        checkStyle(x);
        return;
    } else if (element.id === "password") {
        if (element.value.length < 6) {
            checkStyle(x);
            return;
        }
    } 

    x.style.display = "none"; 
}

function checkStyle(x) {
    if (x.style.display != "block") {
        x.style.display = "block";
    } 
}

export const setLoggedIn = (loggedIn) => {
    var signins = elements.signins;
    console.log("QUACK>>>>> SETTING Signin to " + loggedIn + "; len = " + signins.length);
    for (var i = 0; i < signins.length; i++) {
        if (loggedIn) {
            signins[i].innerHTML = `<a href="register.html" class="link-icon"><i class="icon far fa-user"></i>Log Out</a>`;
        } else {
            signins[i].innerHTML = `<a href="register.html" class="link-icon"><i class="icon far fa-user"></i>Sign In</a>`;
        }
        
    }
}