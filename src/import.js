require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const connectDB = require('./config/database');
const Job = require('./models/Job');
const Company = require('./models/Company');

async function importData(csvFilePath) {
  await connectDB();

  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      // data 예: { "회사명": "...", "제목": "...", "링크": "...", ... }
      results.push(data);
    })
    .on('end', async () => {
      try {
        // 회사명 기준으로 Company 도큐먼트 찾거나 생성
        const bulkOps = [];
        for (const jobData of results) {
          // 회사 찾기/생성
          let companyDoc = await Company.findOne({ name: jobData['회사명'] });
          if (!companyDoc) {
            companyDoc = await Company.create({
              name: jobData['회사명'],
              location: jobData['지역'],
              industry: jobData['직무분야'] // 임의로 industry에 직무분야 할당 예시
            });
          }

          bulkOps.push({
            updateOne: {
              filter: { link: jobData['링크'] },
              update: {
                $setOnInsert: {
                  company_id: companyDoc._id,
                  title: jobData['제목'],
                  link: jobData['링크'],
                  location: jobData['지역'],
                  experience: jobData['경력'],
                  education: jobData['학력'],
                  employment_type: jobData['고용형태'],
                  deadline: jobData['마감일'],
                  sector: jobData['직무분야'],
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              },
              upsert: true
            }
          });
        }

        if (bulkOps.length > 0) {
          await Job.bulkWrite(bulkOps);
        }

        console.log('데이터 삽입 완료!');
        process.exit(0);
      } catch (error) {
        console.error('데이터 삽입 중 에러:', error);
        process.exit(1);
      }
    });
}

// 실행 예: node src/import.js saramin_python.csv
if (require.main === module) {
  const csvFile = process.argv[2];
  if (!csvFile) {
    console.error('CSV 파일 경로를 인자로 전달해주세요.');
    process.exit(1);
  }
  importData(csvFile);
}
