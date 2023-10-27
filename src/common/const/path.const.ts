import { join } from 'path';

// 프로젝트 최상단의 절대경로(루트 폴더)
// /Users/ ~ / ~ /shoppingmall-main
export const PROJECT_ROOT_PATH = process.cwd();

// 외부에서 접근 가능한 파일들 모아둔 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';

// products 이미지들을 저장할 폴더 이름
export const PRODUCTS_FOLDER_NAME = 'products';

// 실제 공개 폴더의 절대경로
// /{프로젝트의 위치}/public
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// products 이미지를 저장할 폴더(절대경로)
// /{프로젝트의 위치}/public/products
export const PRODUCTS_IMAGE_PATH = join(
  PUBLIC_FOLDER_PATH,
  PRODUCTS_FOLDER_NAME,
);

// 절대경로 X
// /public/products/xxx.jpg
export const PRODUCT_PUBLIC_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  PRODUCTS_FOLDER_NAME,
);
