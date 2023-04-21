import crypto from "crypto";

const md5 = (string) => {
  const hash = crypto.createHash("md5");
  hash.update(string);
  const code = hash.digest("hex");
  return code;
};
export default md5;
