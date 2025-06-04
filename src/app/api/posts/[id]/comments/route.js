import { NextResponse } from "next/server";
import { posts } from "../../route";

// 댓글 목록 조회
export async function GET(req, { params }) {
    const post = posts.find(p => p.id === parseInt(params.id));
    
    if (!post) {
        return NextResponse.json(
            { message: "게시글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    
    return NextResponse.json(post.comments || []);
}

// 댓글 추가
export async function POST(req, { params }) {
    const { content, author } = await req.json();
    const postIndex = posts.findIndex(p => p.id === parseInt(params.id));
    
    if (postIndex === -1) {
        return NextResponse.json(
            { message: "게시글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    
    function getRandomNickname() {
        const adjectives = ["Happy", "Crazy", "Silent", "Brave", "Funny", "Mysterious"];
        const animals = ["Panda 🐼", "Tiger 🐯", "Fox 🦊", "Rabbit 🐰", "Penguin 🐧"];
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        return `${randomAdj} ${randomAnimal}`;
    }
    
    const nickname = author ? author : getRandomNickname();
    
    if (!posts[postIndex].comments) {
        posts[postIndex].comments = [];
    }
    
    const newComment = {
        id: posts[postIndex].comments.length + 1,
        content,
        author: nickname,
        createdAt: new Date()
    };
    
    posts[postIndex].comments.push(newComment);
    
    return NextResponse.json(newComment);
} 