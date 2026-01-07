import COS from "cos-nodejs-sdk-v5";
import fs from "fs";
import path from "path";

const { COS_BUCKET, COS_REGION = "ap-hongkong", TENCENTCLOUD_SECRET_ID, TENCENTCLOUD_SECRET_KEY } = process.env;

const cos = new COS({
    SecretId: TENCENTCLOUD_SECRET_ID,
    SecretKey: TENCENTCLOUD_SECRET_KEY
});

function uploadToCOS(filePath: string) {
    console.log("uploadToCOS", filePath);

    if (!fs.existsSync(filePath)) {
        console.error(`错误: 文件不存在 -> ${filePath}`);
        return;
    }

    const fileName = path.basename(filePath);

    cos.putObject({
        Bucket: COS_BUCKET!,
        Region: COS_REGION,
        Key: fileName,
        Body: fs.createReadStream(filePath)
    }, function (err, data) {
        if (err)
            console.error(fileName, '上传失败', err);
        else
            console.log(fileName, '已上传到COS', data.Location);
    });
}

uploadToCOS(process.argv[2]);
