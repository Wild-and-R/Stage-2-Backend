export interface Post {
    id: number;
    title: string;
    content: string;
}

export const posts: Post[] = [
    { id: 1, title: 'Post Pertama', content: 'Ini konten untuk post pertama.' },
    { id: 2, title: 'Post Kedua', content: 'Ini konten untuk post kedua.' },
];
