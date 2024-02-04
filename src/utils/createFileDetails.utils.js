export const createFileDetails = (req, folderName, filename) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const publicUrl = `${baseUrl}/public/uploads/${folderName}/${filename}`;
  const path = req.file.path;

  return {
    publicUrl,
    path,
  };
};
