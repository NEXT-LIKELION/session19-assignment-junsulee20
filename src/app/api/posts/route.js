import { NextResponse } from "next/server";
// import {posts} from "@/app/post/route";

// 테스트용 초기 데이터
export let posts = [
    {
        id: 1,
        title: "테스트 게시글",
        author: "테스트 작성자",
        content: "테스트 내용입니다.",
        createdAt: "2024-01-01T00:00:00.000Z",
        comments: []
    }
];

// 전체 게시글 목록 반환
export async function GET() {
    console.log('GET /api/posts - Starting');
    
    try {
        console.log('Returning posts:', posts);
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error in GET /api/posts:', error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export async function POST(req) {
    console.log('POST /api/posts - Starting');
    
    try {
        const body = await req.json();
        const { title, author, content } = body;

        function getRandomNickname() {
            const adjectives = ["Happy", "Crazy", "Silent", "Brave", "Funny", "Mysterious"];
            const animals = ["Panda 🐼", "Tiger 🐯", "Fox 🦊", "Rabbit 🐰", "Penguin 🐧"];
            const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
            return `${randomAdj} ${randomAnimal}`;
        }

        const nickname = author || getRandomNickname();

        const newPost = { 
            id: posts.length + 1, 
            title, 
            author: nickname, 
            content, 
            createdAt: new Date().toISOString(),
            comments: []
        };
        
        posts.push(newPost);
        console.log('New post created:', newPost);

        return NextResponse.json(newPost);
    } catch (error) {
        console.error('Error in POST /api/posts:', error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}