const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function crawlSaramin(keyword, pages = 5) {
  const jobs = [];
  const collectedLinks = new Set();

  async function fetchPage(page) {
    const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${encodeURIComponent(keyword)}&recruitPage=${page}`;
    let tryCount = 0;
    const maxRetries = 3;

    while (tryCount < maxRetries) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          },
          timeout: 5000
        });
        return response.data;
      } catch (error) {
        tryCount++;
        console.error(`${page}페이지 요청 실패 (시도 ${tryCount}/${maxRetries}): ${error.message}`);
        if (tryCount === maxRetries) {
          console.error(`${page}페이지 실패, 다음 페이지로 넘어갑니다.`);
        } else {
          await new Promise(res => setTimeout(res, 2000));
        }
      }
    }
    return null;
  }

  for (let page = 1; page <= pages; page++) {
    const html = await fetchPage(page);
    if (!html) continue;

    const $ = cheerio.load(html);
    const jobListings = $('.item_recruit');

    jobListings.each((i, el) => {
      const company = $(el).find('.corp_name a').text().trim();
      const title = $(el).find('.job_tit a').text().trim();
      const linkAttr = $(el).find('.job_tit a').attr('href');
      if (!linkAttr) return;
      const link = 'https://www.saramin.co.kr' + linkAttr;

      const conditions = $(el).find('.job_condition span');
      const location = conditions.eq(0).text().trim();
      const experience = conditions.eq(1).text().trim();
      const education = conditions.eq(2).text().trim();
      const employment_type = conditions.eq(3).text().trim();
      const deadline = $(el).find('.job_date .date').text().trim();
      const sector = $(el).find('.job_sector').text().trim();

      if (!collectedLinks.has(link)) {
        collectedLinks.add(link);
        jobs.push({
          "회사명": company,
          "제목": title,
          "링크": link,
          "지역": location,
          "경력": experience,
          "학력": education,
          "고용형태": employment_type,
          "마감일": deadline,
          "직무분야": sector
        });
      }
    });

    console.log(`${page}페이지 크롤링 완료, 현재 수집한 공고 수: ${jobs.length}`);
    await new Promise(res => setTimeout(res, 1000));
  }

  return jobs;
}

if (require.main === module) {
  crawlSaramin('python', 5).then(jobs => {
    if (jobs.length > 0) {
      const headers = Object.keys(jobs[0]).join(',');
      const rows = jobs.map(job =>
        Object.values(job).map(val => `"${val}"`).join(',')
      );
      let csvContent = [headers, ...rows].join('\n');
      // BOM 추가
      csvContent = "\uFEFF" + csvContent;
      fs.writeFileSync('saramin_python.csv', csvContent, 'utf-8');
      console.log(`크롤링 완료! saramin_python.csv 파일 생성 (총 ${jobs.length}개 공고)`);
    } else {
      console.log("크롤링 결과가 없습니다.");
    }
  });
}
