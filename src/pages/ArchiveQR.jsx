import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

export default function ArchiveQR({ username }) {
  const profileUrl = `${window.location.origin}/?u=${username}`;

  return (
    <div className="qr-container" style={{
      background: '#000', 
      padding: '40px', 
      borderRadius: '24px', 
      border: '0.5px solid rgba(255,255,255,0.1)',
      textAlign: 'center',
      maxWidth: '320px',
      margin: '0 auto'
    }}>
      <h3 style={{fontSize: '18px', fontWeight: 800, marginBottom: '25px', letterSpacing: '-0.5px'}}>
        PROVIA ACCESS KEY
      </h3>
      
      <div style={{
        background: '#fff', 
        padding: '15px', 
        borderRadius: '16px', 
        display: 'inline-block',
        marginBottom: '25px',
        boxShadow: '0 0 40px rgba(255,255,255,0.1)'
      }}>
        <QRCodeSVG 
          value={profileUrl} 
          size={180} 
          bgColor={"#ffffff"} 
          fgColor={"#000000"} 
          level={"H"}
          includeMargin={false}
        />
      </div>

      <p style={{color: '#666', fontSize: '12px', marginBottom: '20px', fontWeight: 600}}>
        {profileUrl.toUpperCase()}
      </p>

      <button className="elite-btn" style={{fontSize: '14px', padding: '12px'}}>
        <Download size={16} style={{marginRight: '8px'}} /> Save to Archive
      </button>
    </div>
  );
}