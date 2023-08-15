import React, {useState} from 'react'
import Navbar from './components/Navbar';
import AdForm from './components/AdForm';
import AdsDisplay from './components/AdCard';


export default function Home() {
  const [showAdForm, setShowAdForm] = useState(false);
     
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <Navbar onSellButtonClick={() => setShowAdForm(true)} />
        {showAdForm && <AdForm  onCancelButtonClick={() => setShowAdForm(false)} />}
        <div style={{padding: '0 10px'}}>
        <AdsDisplay  />
        </div>
        
        
    </div>
  )
}
