// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Lấy token từ cookies
    const token = request.cookies.get('auth-token');
    const { pathname } = request.nextUrl;

    // Nếu người dùng đã có token (đã đăng nhập) VÀ đang cố truy cập vào trang gốc (marketing)
    if (token && pathname === '/') {
        // Đẩy họ sang trang boards
        return NextResponse.redirect(new URL('/boards', request.url));
    }

    // Nếu chưa đăng nhập mà cố vào /boards, đẩy về trang chủ
    if (!token && pathname.startsWith('/boards')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Chỉ định middleware chạy trên các route nào
export const config = {
    matcher: ['/', '/boards/:path*'],
};