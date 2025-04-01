import React from 'react';
import './ToastWindow.css';
import { ToastContainer, ToastContentProps, toast } from 'react-toastify';

type AlertProps = ToastContentProps<{
    title: string;
    body: string;
}>;

function ToastError({closeToast, data, toastProps}: AlertProps){
    return(<div>
        <div style={{fontWeight: "bold"}}>
            {data.title}
        </div>
        <div>
            {data.body}
        </div>
    </div>);
}

export default ToastError;