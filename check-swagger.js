const http = require('http');

const url = 'http://campus-form-server.kro.kr:8080/v3/api-docs';

http.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('✅ OpenAPI 스펙 확인 성공!');
      console.log('Version:', json.openapi);
      console.log('Title:', json.info?.title);
      console.log('API Version:', json.info?.version);
      console.log('\n엔드포인트 수:', Object.keys(json.paths || {}).length);
      console.log('\n첫 5개 엔드포인트:');
      Object.keys(json.paths || {}).slice(0, 5).forEach(path => {
        console.log('  -', path);
      });
    } catch (e) {
      console.error('❌ JSON 파싱 실패:', e.message);
    }
  });
}).on('error', (e) => {
  console.error('❌ 요청 실패:', e.message);
});
