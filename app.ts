import COS from "cos-nodejs-sdk-v5";
import fs from "fs";
import path from "path";
import crypto from "crypto"; // 引入 crypto 用于计算 MD5

const { COS_BUCKET, COS_REGION = "ap-hongkong", TENCENTCLOUD_SECRET_ID, TENCENTCLOUD_SECRET_KEY } = process.env;

const cos = new COS({
    SecretId: TENCENTCLOUD_SECRET_ID,
    SecretKey: TENCENTCLOUD_SECRET_KEY
});

/**
 * 计算本地文件的 MD5
 */
function getFileMD5(filePath: string): string {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * 获取 COS 上文件的元数据
 */
function getCosObjectMeta(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        cos.headObject({
            Bucket: COS_BUCKET!,
            Region: COS_REGION,
            Key: key
        }, (err, data) => {
            if (!err) {
                resolve(data);
                return;
            }

            // 如果是 404 错误，说明文件不存在，返回 null 即可，不算报错
            if (err.statusCode === 404)
                resolve(null);
            else
                reject(err);
        });
    });
}

/**
 * 上传文件到 COS
 * @param localFilePath 本地文件路径
 * @param targetKey COS上的目标路径
 */
async function uploadToCOS(localFilePath: string, targetKey?: string): Promise<void> {
    if (!fs.existsSync(localFilePath)) {
        const errMsg = `错误: 文件不存在 -> ${localFilePath}`;
        console.error(errMsg);
        throw new Error(errMsg);
    }

    const key = targetKey || localFilePath;
    
    const localStats = fs.statSync(localFilePath);
    const localSize = localStats.size;
    const localMD5 = getFileMD5(localFilePath);

    try {
        const remoteMeta = await getCosObjectMeta(key);

        if (remoteMeta) {
            // COS 的 ETag 通常包含双引号 (例如 "5d4140...")，需要去掉
            const remoteETag = remoteMeta.ETag ? remoteMeta.ETag.replace(/"/g, '') : '';
            const remoteSize = parseInt(remoteMeta.headers['content-length'] || '0', 10);

            if (localSize === remoteSize && localMD5 === remoteETag) {
                console.log(`[跳过] 文件未变动: ${key}`);
                return;
            }
        }
    } catch (err) {
        console.warn(`[警告] 检查远程文件状态失败 (将尝试强制上传): ${key}`, err);
    }

    return new Promise((resolve, reject) => {
        console.log(`[上传] 正在上传: ${localFilePath} -> ${key}`);

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
                console.log(key, '上传成功', data.Location);
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
        await uploadToCOS("Packages");

        console.log("所有任务处理完成！");

    } catch (error) {
        console.error("------------------------------------------------");
        console.error("检测到上传过程中发生错误，程序即将退出。");
        console.error("错误详情:", error);
        process.exit(1);
    }
})();