import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth'; // Giả sử bạn dùng NextAuth

export default async function MarketingHomePage() {
  const session = await getServerSession();

  // Đã đăng nhập -> Đẩy thẳng vào app/dashboard
  if (session) {
    redirect('/boards'); 
  }

  // Chưa đăng nhập -> Render HTML của Landing Page
  return (
    <main>
      <h1>Trello mang tất cả nhiệm vụ lại với nhau</h1>
      {/* ... nội dung marketing ... */}
    </main>
  );
}