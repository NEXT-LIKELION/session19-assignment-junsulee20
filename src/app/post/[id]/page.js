'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 댓글 관련 상태
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // 수정 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '게시글을 불러오는데 실패했습니다.');
      }
      const data = await res.json();
      setPost(data);
      setEditTitle(data.title);
      setEditContent(data.content);
      setEditAuthor(data.author);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('댓글 로딩 실패:', err);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
    
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        alert('게시글이 삭제되었습니다.');
        router.push('/');
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          author: editAuthor
        }),
      });
      
      if (res.ok) {
        const updatedPost = await res.json();
        setPost(updatedPost);
        setIsEditing(false);
        alert('게시글이 수정되었습니다.');
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmittingComment(true);
    
    try {
      const res = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          author: commentAuthor
        }),
      });
      
      if (res.ok) {
        setNewComment('');
        setCommentAuthor('');
        fetchComments();
      } else {
        alert('댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;
    
    try {
      const res = await fetch(`/api/posts/${params.id}/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchComments();
      } else {
        alert('댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-500 mb-4 text-lg">{error}</p>
              <Link href="/" className="text-blue-500 hover:underline">
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 게시글 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← 목록으로
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isEditing ? '취소' : '수정'}
              </button>
              <button
                onClick={handleDeletePost}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                삭제
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
              <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6">
                <span className="flex items-center">
                  👤 {post.author}
                </span>
                <span className="flex items-center">
                  📅 {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                </span>
                {post.updatedAt && (
                  <span className="flex items-center">
                    ✏️ {new Date(post.updatedAt).toLocaleDateString('ko-KR')} 수정됨
                  </span>
                )}
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {post.content}
                </p>
              </div>
            </>
          )}
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            💬 댓글 ({comments.length})
          </h2>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleAddComment} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="작성자명 (비우면 랜덤 닉네임)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isSubmittingComment ? '작성 중...' : '댓글 작성'}
            </button>
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💭</div>
                <p>아직 댓글이 없습니다.</p>
                <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 space-x-2 mb-2">
                        <span className="font-medium text-gray-700">{comment.author}</span>
                        <span>•</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>
                        {comment.updatedAt && (
                          <>
                            <span>•</span>
                            <span className="text-blue-500">수정됨</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 text-sm ml-4"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
