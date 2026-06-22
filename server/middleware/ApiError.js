export class ApiError extends Error {
  constructor(statusCode, errorCode, devMessage) {

    super(devMessage); 
    
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.devMessage = devMessage;

    Error.captureStackTrace(this, this.constructor);
  }
}