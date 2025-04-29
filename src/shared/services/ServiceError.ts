export class ServiceError extends Error {
  constructor(message: string) {
    super(message);
    console.log('>>>>>>>>>>>>>>> 서비스 실행도중 오류가 발생했습니다.', message);
    this.name = 'ServiceError';
  }
}
