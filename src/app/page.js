import Link from "next/link";

export default async function HomePage() {
  let posts = [];
  let error = null;
  
  try {
    console.log('Fetching posts from API...');
    
    // 상대 경로 사용
    const res = await fetch("http://localhost:3000/api/posts", { 
      cache: "no-store"
    });
    
    console.log('API Response status:', res.status);
    
    if (!res.ok) {
      const text = await res.text();
      console.error('API Error Response:', text);
      throw new Error(`API 요청 실패: ${res.status}`);
    }
    
    posts = await res.json();
    console.log('Posts loaded successfully:', posts.length);
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    error = err.message;
    posts = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📝 게시판
          </h1>
          
          <div className="flex justify-end mb-6">
            <Link href="/post/write">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm">
                ✏️ 글 작성하기
              </button>
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-500 text-2xl mr-3">⚠️</div>
                <div>
                  <h3 className="text-red-800 font-medium">데이터 로딩 오류</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <p className="text-red-600 text-sm">개발 서버를 재시작해보세요.</p>
                </div>
              </div>
            </div>
          )}

          {posts.length === 0 && !error ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <p className="text-gray-500 text-lg">아직 작성된 글이 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">첫 번째 글을 작성해보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/post/${post.id}`}>
                        <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer mb-2">
                          {post.title}
                        </h2>
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          👤 {post.author}
                        </span>
                        <span className="flex items-center">
                          📅 {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                        <span className="flex items-center">
                          💬 {post.comments?.length || 0}개 댓글
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
