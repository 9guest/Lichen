# Lichen
**Resilient Hosting. Rooted Everywhere.**

A lightweight Electron-based utility to upload media to multiple hosting services from a single, unified interface. One interface, multiple hosts, instant direct links. Like the organism it's named after, Lichen is built to stick, survive, and simplify.

## ✨ Features

### Multi-Service Upload
- **Multiple Hosting Providers**: Upload to different services (imgbb, Internet Archive, and more) without leaving the app
- **Single Service Selection**: Select your preferred service and upload directly to it
- **Supported Formats**: 
  - Images: JPEG, PNG, GIF, WebP, BMP
  - Video: MP4, MOV
  - Audio: MP3, WAV
  - Documents: PDF, TXT
  - And more via Internet Archive

### Upload Management
- **Drag-and-Drop Interface**: Easily add files by dragging them to the drop zone
- **Batch Upload Queue**: Add multiple files and manage uploads in a queue
- **Progress Tracking**: Monitor upload progress in real-time from the Tasks page
- **Step-by-Step Workflow**: Guided process - select service → add files → upload

### Upload History & Management
- **Complete History Log**: View all your uploaded files with metadata
- **Smart Filtering**: 
  - Search by file name
  - Filter by service provider
  - Filter by date range (from/to)
- **Batch Selection**: Select multiple history records for bulk operations
- **Export Records**: Export upload history as JSON for backup or analysis
- **Delete Records**: Safely remove upload records with confirmation

### Settings & Configuration
- **API Key Management**: Configure API keys for each hosting service
- **Service Configuration**: Set up credentials and preferences for supported providers
- **Theme Options**: Choose between light, dark, or system default theme
- **Persistent Settings**: Your preferences are saved locally

### Deep Linking
- **Protocol Handler Support**: Open files directly with Lichen using `lichen://` protocol links
- **Single Instance Application**: Ensures only one instance runs at a time

### User Experience
- **Clean, Intuitive UI**: Sidebar navigation with Upload, Tasks, History, and Settings
- **Real-Time Notifications**: Toast notifications for upload completion and errors
- **Responsive Design**: Works seamlessly on different window sizes (minimum 1024x720)
- **Keyboard Friendly**: Button-based controls with clear visual feedback

## 🚀 Getting Started

### Installation
```bash
npm install
# or
yarn install
```

### Running the App
```bash
npm start
# or
yarn start
```

### Building
```bash
npm run build
# or
yarn build
```

## 🛠️ Supported Services

| Service | Max File Size | Formats | Restrictions |
|---------|--------------|---------|--------------|
| **imgbb** | 32 MB | Images only (JPEG, PNG, GIF, WebP, BMP) | Single image upload |
| **Internet Archive** | 100 GB | All formats | Max 10,000 files per upload |

## 📦 Tech Stack

- **Electron**: Cross-platform desktop application framework
- **JavaScript (ES6+)**: Core application logic
- **HTML/CSS**: User interface
- **Node.js**: Backend file handling and API integration
- **IPC Communication**: Secure inter-process communication

## 📝 License

MIT License - See LICENSE file for details

## 🔗 Resources

- [GitHub Repository](https://github.com/9guest/Lichen)
- [imgbb API](https://api.imgbb.com/)
- [Internet Archive S3](https://archive.org/account/s3.php)
