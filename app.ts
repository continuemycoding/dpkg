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
 * @param localFilePath 本地文件路径
 * @param targetKey COS上的目标路径
 */
function uploadToCOS(localFilePath: string, targetKey?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(localFilePath)) {
            const errMsg = `错误: 文件不存在 -> ${localFilePath}`;
            console.error(errMsg);
            return reject(new Error(errMsg));
        }

        const key = targetKey || localFilePath;
        console.log(`准备上传: ${localFilePath} -> ${key}`);

        cos.putObject({
            Bucket: COS_BUCKET!,
            Region: COS_REGION,
            Key: key,
            Body: fs.createReadStream(localFilePath)
        }, function (err, data) {
            if (err) {
                console.error(key, '上传失败', err);
                reject(err);
            } else {
                console.log(key, '已上传到COS', data.Location);
                resolve();
            }
        });
    });
}

(async () => {
    const debsDir = "debs";

    if (!fs.existsSync(debsDir)) {
        console.error(`目录不存在: ${debsDir}`);
        process.exit(1);
    }

    const files = fs.readdirSync(debsDir);

    try {
        for (const file of files) {
            const localPath = path.join(debsDir, file);

            // 确保是文件而不是子文件夹，并忽略隐藏文件
            if (fs.statSync(localPath).isFile() && !file.startsWith('.')) {
                const remoteKey = `debs/${file}`;
                await uploadToCOS(localPath, remoteKey);
            }
        }

        await uploadToCOS("Packages.bz2");

        console.log("所有文件上传完成！");

    } catch (error) {
        console.error("------------------------------------------------");
        console.error("检测到上传过程中发生错误，程序即将退出。");
        console.error("错误详情:", error);
        process.exit(1);
    }
})();
