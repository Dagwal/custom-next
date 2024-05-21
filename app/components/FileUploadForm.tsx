import { useState, ChangeEvent, useRef } from 'react';
import axios from 'axios';

const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/attachments/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
      alert('File uploaded successfully');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the value of the file input
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} ref={fileInputRef} /> 
      <button onClick={handleUpload} style={{
        marginTop: '10px',
        padding: '5px 10px',
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}>Upload</button>
    </div>
  );
};

export default FileUploadForm;
