import React, {useRef} from 'react';
import JournalVoucher from './JournalVoucher';
import JVFilter from './JVFilter'
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";

const JournalVoucherTab = () => {
    const componentRef = useRef();
    const printButton = useRef();
    const exportJv = () => {
        printButton.current.click();
    }
    return (
        <div>
            <JVFilter exportJv={exportJv}/>
            <JournalVoucher ref={componentRef} />
            <ReactToPrint
                trigger={() => {
                    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                    // to the root node of the returned component as it will be overwritten.
                    return <Button className="employeesalary-savebtn d-none" ref={printButton}>
                        Print Slip
                    </Button>;
                }}
                content={() => componentRef.current}
            />
        </div>
    )
}

export default JournalVoucherTab;