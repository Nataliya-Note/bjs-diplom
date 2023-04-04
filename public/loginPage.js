'use strict'

const userForm = new UserForm();
userForm.loginFormCallback = (data) => {
    return ApiConnector.login(data, ({ success, error }) => {
        if (success) {
            location.reload();
        }
        else {
            userForm.setLoginErrorMessage(error);
        }
    })
};

userForm.registerFormCallback = (data) => {
    return ApiConnector.register(data, ({ success, error }) => {
        if (success) {
            location.reload();
        }
        else {
            userForm.setRegisterErrorMessage(error);
        }
    })
};