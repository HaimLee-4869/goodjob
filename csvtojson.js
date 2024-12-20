const fs = require("fs");
const csv = require("csvtojson");

const csvFilePath = "./saramin_python.csv"; // CSV 파일 경로
const jsonFilePath = "./crawled-data.json"; // JSON 파일 저장 경로

const convertCSVtoJSON = async () => {
    try {
        const jsonArray = await csv().fromFile(csvFilePath); // CSV 파일 읽어서 JSON 변환
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2)); // JSON 파일 저장
        console.log("CSV 파일이 JSON으로 성공적으로 변환되었습니다.");
    } catch (err) {
        console.error("CSV -> JSON 변환 중 에러:", err);
    }
};

convertCSVtoJSON();
