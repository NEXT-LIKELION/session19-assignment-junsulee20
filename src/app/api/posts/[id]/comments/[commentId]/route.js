import { NextResponse } from "next/server";
import { posts } from "../../../route";

// 댓글 수정
export async function PUT(req, { params }) {
    const { content } = await req.json();
    const postIndex = posts.findIndex(p => p.id === parseInt(params.id));
    
    if (postIndex === -1) {
        return NextResponse.json(
            { message: "게시글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    
    const commentIndex = posts[postIndex].comments.findIndex(
        c => c.id === parseInt(params.commentId)
    );
    
    if (commentIndex === -1) {
        return NextResponse.json(
            { message: "댓글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    
    posts[postIndex].comments[commentIndex] = {
        ...posts[postIndex].comments[commentIndex],
        content: content || posts[postIndex].comments[commentIndex].content,
        updatedAt: new Date()
    };
    
    return NextResponse.json(posts[postIndex].comments[commentIndex]);
}

// 댓글 삭제
export async function DELETE(req, { params }) {
    const postIndex = posts.findIndex(p => p.id === parseInt(params.id));
    
    if (postIndex === -1) {
        return NextResponse.json(
            { message: "게시글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    
    const commentIndex = posts[postIndex].comments.findIndex(
        c => c.id === parseInt(params.commentId)
    );
    
    if (commentIndex === -1) {
        return NextResponse.json(
            { message: "댓글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    
    const deletedComment = posts[postIndex].comments.splice(commentIndex, 1)[0];
    return NextResponse.json({ 
        message: "댓글이 삭제되었습니다.", 
        deletedComment 
    });
} 