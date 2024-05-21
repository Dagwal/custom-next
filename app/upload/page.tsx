'use client'
import FileUploadForm from '../components/FileUploadForm';

const UploadPage = () => {
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '5px',
      }}>
      <h1>Upload</h1><br />
      <FileUploadForm />
    </div>
  );
};

export default UploadPage;
