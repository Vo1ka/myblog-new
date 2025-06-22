import { loginWithEmailAndPassword, logoutUser, registerWithEmailAndPassword } from "@/firebase/auth";
import { AppDispatch } from "..";
import { loginError, loginStart, loginSuccess, logout } from "./actions";

export const loginUserThunk = (email:string, password:string) => async(dispatch: AppDispatch) =>{
    dispatch(loginStart());
    try {
        const user = await loginWithEmailAndPassword(email, password);
        dispatch(loginSuccess(user.user))
    } catch(err){
        dispatch(loginError('Ошибка авторизации'))
        console.error(err)
    }
}

export const registerUserThunk = (email: string, password: string) => async (dispatch:AppDispatch) =>{
    dispatch(loginStart());
    try{
        const newUser = await registerWithEmailAndPassword(email,password);
        dispatch(loginSuccess(newUser.user))
    } catch(err){
        dispatch(loginError('Ошибка регистрации'))
        console.error(err)
    }
}

export const logoutUserThunk = () => async (dispatch: AppDispatch) => {
    try {
        await logoutUser();
        dispatch(logout());
    } catch (err) {
        console.error('Ошибка выхода', err);
    }
};