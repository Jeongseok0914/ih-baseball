// next-env.d.ts 는 빌드 때 생성되고 git 에 올리지 않는다. CI 의 type-check 는 빌드보다 먼저 돌므로
// 이미지 static import(.jpg/.png) 타입을 여기서 직접 불러온다.
/// <reference types="next/image-types/global" />
