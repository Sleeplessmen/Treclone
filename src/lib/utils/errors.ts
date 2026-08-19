import { z } from 'zod'
import * as jwt from 'jsonwebtoken'

/**
 * Application-level error codes. Single source of truth for all
 * domain errors across the codebase.
 */
export enum ErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    EMAIL_ALREADY_REGISTERED = 'EMAIL_ALREADY_REGISTERED',
    EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
    INVALID_TOKEN = 'INVALID_TOKEN',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_RESET_TOKEN = 'INVALID_RESET_TOKEN',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    PASSWORD_MISMATCH = 'PASSWORD_MISMATCH',
    FORBIDDEN = 'FORBIDDEN',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    RATE_LIMITED = 'RATE_LIMITED',
}

/**
 * Standard error thrown across controllers and services.
 * Carries a human-friendly message, an HTTP status code, and a stable code.
 */
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public code: ErrorCode
    ) {
        super(message)
        this.name = 'AppError'
    }
}

/**
 * Classifies an unknown error into an AppError with the appropriate
 * status code and error code, logging it at the right severity.
 */
export function handleError(error: unknown): AppError {
    // Zod validation errors
    if (error instanceof z.ZodError) {
        const message = error.issues[0].message
        console.warn('[Validation]', message)
        return new AppError(message, 400, ErrorCode.VALIDATION_ERROR)
    }

    // JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
        console.warn('[JWT]', error.message)
        return new AppError('Invalid token', 401, ErrorCode.INVALID_TOKEN)
    }

    if (error instanceof jwt.TokenExpiredError) {
        console.warn('[Token Expired]', error.expiredAt)
        return new AppError('Token expired', 401, ErrorCode.TOKEN_EXPIRED)
    }

    // Custom app errors are returned as-is
    if (error instanceof AppError) {
        return error
    }

    // Map common error messages to specific codes
    if (error instanceof Error) {
        const message = error.message

        if (message.includes('Invalid email or password')) {
            console.warn('[Login]', message)
            return new AppError(message, 401, ErrorCode.INVALID_CREDENTIALS)
        }

        if (message.includes('Email already registered')) {
            console.warn('[Registration]', message)
            return new AppError(message, 409, ErrorCode.EMAIL_ALREADY_REGISTERED)
        }

        if (message.includes('verify your email')) {
            console.warn('[Verification]', message)
            return new AppError(message, 403, ErrorCode.EMAIL_NOT_VERIFIED)
        }

        if (message.includes('User not found')) {
            console.warn('[User]', message)
            return new AppError(message, 404, ErrorCode.USER_NOT_FOUND)
        }

        if (message.includes('Invalid or expired reset token')) {
            console.warn('[Reset Token]', message)
            return new AppError(message, 400, ErrorCode.INVALID_RESET_TOKEN)
        }

        if (message.includes("Passwords don't match")) {
            console.warn('[Password]', message)
            return new AppError(message, 400, ErrorCode.PASSWORD_MISMATCH)
        }

        console.error('[Unexpected]', message)
        return new AppError('An unexpected error occurred', 500, ErrorCode.INTERNAL_ERROR)
    }

    // Unknown / non-Error value
    console.error('[Unknown]', error)
    return new AppError('An unexpected error occurred', 500, ErrorCode.INTERNAL_ERROR)
}
