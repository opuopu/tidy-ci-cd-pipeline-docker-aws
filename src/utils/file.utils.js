import fs from "fs";
import util from "util";
const unlinkSync = util.promisify(fs.unlink);
const deleteFile = async (path) => {
  try {
    if (fs.existsSync(path)) {
      await unlinkSync(path);
    }
  } catch (err) {
    throw new Error(`Error deleting file: ${err.message}`);
  }
};

export { deleteFile };
