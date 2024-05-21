import { useState, ChangeEvent, useRef } from "react";
import axios from "axios";
import { Notification, rem } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/attachments/files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
      setNotification({ message: "Everything is fine", color: "teal", icon: checkIcon });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setNotification({ message: "Something went wrong", color: "red", icon: xIcon });
    }

    setTimeout(() => { setNotification(null)}, 3000);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} ref={fileInputRef} />
      <button
        onClick={handleUpload}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload
      </button>
      {notification && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <Notification
            icon={notification.icon}
            color={notification.color}
            title={notification.color === "teal" ? "All good!" : "Error!"}
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
