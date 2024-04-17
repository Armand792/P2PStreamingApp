import React from 'react';
import { StripeCheckout } from '@/screens/payments/StripeCheckout';// Import StripeCheckout component
import { ICheckoutData } from '@/interfaces/payments';
import '../global_styles/index.css';
import { useEffect, useRef } from 'react';

interface CheckoutPopupProps {
    openCheckout: boolean;
    checkoutData: ICheckoutData;
    onClose: () => void;
}

const CheckoutPopup: React.FC<CheckoutPopupProps> = ({ openCheckout, checkoutData, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose(); // Close the popup if click occurs outside of it
            }
        };

        if (openCheckout) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openCheckout, onClose]);

    if (!openCheckout) {
        return null;
    }

    return (
        <div className='popup-overlay'>
            <div ref={popupRef}  className='popup-content'>
                <StripeCheckout checkoutData={checkoutData} />
            </div>
        </div>
    );
};

export default CheckoutPopup;