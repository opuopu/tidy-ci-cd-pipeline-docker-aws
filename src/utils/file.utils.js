import fs from "fs";
import util from "util";
const unlinkSync = util.promisify(fs.unlink);
const deleteFile = async (path) => {
  const modifiedPath = `.${path}`;
  try {
    if (fs.existsSync(modifiedPath)) {
      await unlinkSync(modifiedPath);
    } else {
      console.log("not found");
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Error deleting file: ${err.message}`);
  }
};

export { deleteFile };
export const createFileDetails = (folderName, filename) => {
  console.log(folderName, filename);
  return `/public/uploads/${folderName}/${filename}`;
};
