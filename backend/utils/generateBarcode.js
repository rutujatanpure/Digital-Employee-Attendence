import bwipjs from "bwip-js";
import fs from "fs";
import path from "path";

const generateBarcode = async (employeeId) => {
  const dir = path.join(process.cwd(), "uploads", "employees");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${employeeId}.png`);

  const png = await bwipjs.toBuffer({
    bcid: "code128",
    text: employeeId,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center",
  });

  // THIS LINE FIXES ENOENT
  fs.writeFileSync(filePath, png);

  return `uploads/employees/${employeeId}.png`;
};

export default generateBarcode;
