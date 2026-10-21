// 검색엔진·AI가 읽는 구조화 데이터(schema.org). 우리 데이터로 만든 JSON 이라 안전하다.
// '<' 만 바꿔 </script> 조기 종료를 막는다.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
