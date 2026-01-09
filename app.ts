import COS from "cos-nodejs-sdk-v5";
import fs from "fs";
import path from "path";

const { COS_BUCKET, COS_REGION = "ap-hongkong", TENCENTCLOUD_SECRET_ID, TENCENTCLOUD_SECRET_KEY } = process.env;

const cos = new COS({
    SecretId: TENCENTCLOUD_SECRET_ID,
    SecretKey: TENCENTCLOUD_SECRET_KEY
});

/**
 * 上传文件到 COS
 * @param localFilePath 本地文件路径 (例如: "debs/package.deb")
 * @param targetKey (可选) COS上的目标路径 (例如: "debs/package.deb")。如果不传，默认放在Bucket根目录。
 */
function uploadToCOS(localFilePath: string, targetKey?: string) {
    if (!fs.existsSync(localFilePath)) {
        console.error(`错误: 文件不存在 -> ${localFilePath}`);
        return;
    }

    const key = targetKey || localFilePath;

    console.log(`准备上传: ${localFilePath} -> ${key}`);

    cos.putObject({
        Bucket: COS_BUCKET!,
        Region: COS_REGION,
        Key: key,
        Body: fs.createReadStream(localFilePath)
    }, function (err, data) {
        if (err)
            console.error(key, '上传失败', err);
        else
            console.log(key, '已上传到COS', data.Location);
    });
}

const debsDir = "debs";

const files = fs.readdirSync(debsDir);

files.forEach(file => {
    const localPath = path.join(debsDir, file);

    // 确保是文件而不是子文件夹，并忽略隐藏文件（如 .DS_Store）
    if (fs.statSync(localPath).isFile() && !file.startsWith('.')) {
        const remoteKey = `debs/${file}`;
        uploadToCOS(localPath, remoteKey);
    }
});

uploadToCOS("Packages.bz2");
