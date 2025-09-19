import { useState } from 'react';
import CustomerInfoForm from '../CustomerInfoForm';

export default function CustomerInfoFormExample() {
  const [customerInfo, setCustomerInfo] = useState({});

  const handleInfoChange = (info: any) => {
    setCustomerInfo(info);
    console.log('Customer info updated:', info);
  };

  return (
    <div className="max-w-md">
      <CustomerInfoForm onInfoChange={handleInfoChange} />
    </div>
  );
}