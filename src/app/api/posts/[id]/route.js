import { NextResponse } from "next/server";
import { posts } from "../route";

export async function GET(req, { params }) {
    console.log('Requested post ID:', params.id);
    console.log('Available posts:', posts);
    
    const post = posts.find(p => p.id === parseInt(params.id));
    console.log('Found post:', post);
    
    if (!post) {
        return NextResponse.json(
            { message: "게시글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    return NextResponse.json(post);
}

// 포스트 수정
export async function PUT(req, { params }) {
    const { title, content, author } = await req.json();
    const postIndex = posts.findIndex(p => p.id === parseInt(params.id));
    
    if (postIndex === -1) {
        return NextResponse.json(
            { message: "게시글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    
    // 기존 포스트 정보 유지하면서 업데이트
    posts[postIndex] = {
        ...posts[postIndex],
        title: title || posts[postIndex].title,
        content: content || posts[postIndex].content,
        author: author || posts[postIndex].author,
        updatedAt: new Date()
    };
    
    return NextResponse.json(posts[postIndex]);
}

// 포스트 삭제
export async function DELETE(req, { params }) {
    const postIndex = posts.findIndex(p => p.id === parseInt(params.id));
    
    if (postIndex === -1) {
        return NextResponse.json(
            { message: "게시글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    
    const deletedPost = posts.splice(postIndex, 1)[0];
    return NextResponse.json({ message: "게시글이 삭제되었습니다.", deletedPost });
} 