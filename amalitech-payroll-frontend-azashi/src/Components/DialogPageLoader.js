import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import { BounceLoader } from "react-spinners";

function DialogPageLoader(){
    return(
        <DialogContent>
            <div className="row justify-content-center" style={{ height: "80px"}}>
                <BounceLoader size={70} color="#cf4f1f" loading />
            </div>
        </DialogContent>
    )
}

export default DialogPageLoader