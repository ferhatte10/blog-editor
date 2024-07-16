// controllers/uploadController.js
const fs = require('fs');
const path = require('path');


const getFile = (req, res) => {
    const { picture } = req.auth.user_info;

    if (picture === 'default.png') {
        return getDefaultFile(req, res);
    }
    
    const filePath = path.join(__dirname, '..', 'uploads/users_pictures', picture)
    
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        return getDefaultFile(req, res);
    }
};

const getDefaultFile = (req, res) => { 
    const filePath = path.join(__dirname, '..', 'uploads', 'default', 'default.png');
    // The 'express.static' middleware will handle serving the file
    res.sendFile(filePath);
  };

const getFileByName = (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads/users_pictures', fileName);
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    }else{
        return getDefaultFile(req, res);
    }
}

module.exports = {
    getFile,
    getDefaultFile,
    getFileByName
};
