import { useState, useEffect, ChangeEvent, useRef } from 'react';
import axios from 'axios';
import { Button, Notification, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<{ key: string; url: string }[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    color: string;
    icon: JSX.Element;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/attachments/files');
      setFiles(response.data);
    } catch (error) {
      setNotification({
        message: 'Failed to fetch files',
        color: 'red',
        icon: xIcon,
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

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

    try {
      // Step 1: Get the presigned URL
      const filename = file.name;
      const uploadUrlResponse = await axios.post('http://localhost:5000/attachments/upload-url', { filename });
      const { uploadUrl, key } = uploadUrlResponse.data;

      // Step 2: Upload the file to the presigned URL
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      setNotification({
        message: 'File uploaded successfully',
        color: 'teal',
        icon: checkIcon,
      });

      // Refresh file list
      fetchFiles();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setNotification({
        message: 'Something went wrong during upload',
        color: 'red',
        icon: xIcon,
      });
    }

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleDownload = async (key: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/attachments/download-url/${key}`);
      const downloadUrl = response.data;

      const downloadResponse = await axios.get(downloadUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', key); // Optional: we can set the file name here
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      setNotification({
        message: 'Something went wrong during download',
        color: 'red',
        icon: xIcon,
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} ref={fileInputRef} />
      <Button onClick={handleUpload} bg={'green'}>Upload</Button>
      <h2>Existing Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.key} style={{marginTop: 8, alignSelf: 'justify'}}>
            {file.key}
            <Button size='xs' w={100} ml={12} onClick={() => handleDownload(file.key)}
            >Download</Button>
          </li>
        ))}
      </ul>
      {notification && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <Notification
            icon={notification.icon}
            color={notification.color}
            title={notification.color === 'teal' ? 'All good!' : 'Error!'}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Notification>
        </div>
      )}
    </div>
  );
};

export default FileUploadForm;
