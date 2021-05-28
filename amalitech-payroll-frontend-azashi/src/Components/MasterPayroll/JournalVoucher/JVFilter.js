import React from "react";
import "../../../index.css";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Button } from '@material-ui/core';

const JVFilter = ({exportJv}) => {

    const handleExportClick = () => {
        exportJv()
    }

    return (
        <div>
              <div className="cardColor">
                    <div className=" row cardColor pt-2 pb-3">

                        <div className="col-md-4 mb-2">

                        </div>
                        
                        <div className="col-md-6">
                        </div>

                        <div className="col-md-2">
                            <Button
                                className="text-capitalize greyedBtn mb-2"
                                variant="contained"
                                size="small"
                                color="primary"
                                startIcon={<CloudUploadIcon />}
                                onClick={() => {handleExportClick()}}
                            >
                                Export Voucher
                            </Button>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default JVFilter;
