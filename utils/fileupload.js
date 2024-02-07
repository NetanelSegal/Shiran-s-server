const path = require("path");

exports.fileUpload = (files, fileKey, filePath, max_mb = 5, fileExtAllows = [".png", ".jpg", ".gif", ".jpeg"]) => {
  return new Promise((resolve, reject) => {
    console.log(files);
    const myFiles = Array.isArray(files[fileKey]) ? files[fileKey] : [files[fileKey]];
    const uploadPromises = [];

    if (myFiles.length === 0) {
      reject({ message: "No files provided", code: "no_files" });
    }

    myFiles.forEach((myFile) => {
      if (myFile.size >= 1024 * 1024 * max_mb) {
        reject({ message: "File too big, max " + max_mb + " mb!", code: "max_size" });
      }

      let fileExt = path.extname(myFile.name);

      if (!fileExtAllows.includes(fileExt)) {
        reject({ message: "File type not allowed", code: "invalid_type" });
      }

      let fileName = filePath ? `${filePath}${myFile.name}` : myFile.name;

      uploadPromises.push(new Promise((innerResolve, innerReject) => {
        myFile.mv("public/uploads/" + fileName, (err) => {
          if (err) {
            innerReject({ message: "Error uploading file", code: "upload_error", stack: err });
          } else {
            innerResolve({ message: "File upload successful", fileName });
          }
        });
      }));
    });

    Promise.all(uploadPromises)
      .then((results) => resolve(results))
      .catch((errors) => reject(errors));
  });
};
