import type { Comment } from '@/types/comment';

export const mockComments: Comment[] = [
  // 홍길동 (id: 2) - 2개 댓글
  {
    id: 'comment-1',
    applicantId: '2',
    author: 'Seohee LEE',
    content: '지원동기가 저희 동아리에 진심이신 것 같아 너무 좋아요~!',
    createdAt: '2025.11.20. 14:20',
    isAuthor: true,
    replies: [
      {
        id: 'reply-1',
        author: '정승제',
        content: '동의합니다! 개발 실력도 뛰어나신 것 같아요.',
        createdAt: '2025.11.20. 14:25',
        isAuthor: false,
      },
    ],
  },
  {
    id: 'comment-2',
    applicantId: '2',
    author: '김현우',
    content: '포트폴리오 보니까 프로젝트 경험이 풍부하시네요!',
    createdAt: '2025.11.20. 15:30',
    isAuthor: false,
  },

  // 김철수 (id: 3) - 5개 댓글
  {
    id: 'comment-3',
    applicantId: '3',
    author: 'Seohee LEE',
    content: '기획력이 돋보이는 것 같아요.',
    createdAt: '2025.11.19. 10:15',
    isAuthor: true,
  },
  {
    id: 'comment-4',
    applicantId: '3',
    author: '정승제',
    content:
      '동아리 참여 열정 많아보이는듯... 그런데 너무 바빠보임... 지금 하는 동아리랑 학회랑 3개인데 이것까지 할 수 있을까...??? 거리도 먼데..',
    createdAt: '2025.11.19. 11:20',
    isAuthor: false,
    replies: [
      {
        id: 'reply-2',
        author: '박지민',
        content: '시간 관리가 중요할 것 같네요.',
        createdAt: '2025.11.19. 11:25',
        isAuthor: false,
      },
    ],
  },
  {
    id: 'comment-5',
    applicantId: '3',
    author: '이민호',
    content: '자기소개서가 인상적이었습니다.',
    createdAt: '2025.11.19. 12:00',
    isAuthor: false,
  },
  {
    id: 'comment-6',
    applicantId: '3',
    author: '최유진',
    content: '면접 때 더 자세히 이야기 나눠보면 좋을 것 같아요.',
    createdAt: '2025.11.19. 13:45',
    isAuthor: false,
  },
  {
    id: 'comment-7',
    applicantId: '3',
    author: '강민서',
    content: '경영학과 출신이라 비즈니스 마인드가 있으시겠네요.',
    createdAt: '2025.11.19. 14:30',
    isAuthor: false,
  },

  // 박서준 (id: 4) - 1개 댓글
  {
    id: 'comment-8',
    applicantId: '4',
    author: '김태현',
    content: '임베디드 경험이 있으시니 IoT 프로젝트에 적합할 것 같습니다.',
    createdAt: '2025.11.18. 16:20',
    isAuthor: false,
  },

  // 이서연 (id: 5) - 3개 댓글
  {
    id: 'comment-9',
    applicantId: '5',
    author: 'Seohee LEE',
    content: '디자인 포트폴리오 정말 인상적이네요!',
    createdAt: '2025.11.21. 09:30',
    isAuthor: true,
    replies: [
      {
        id: 'reply-3',
        author: '정하은',
        content: '저도 같은 생각입니다. UI 감각이 뛰어나세요.',
        createdAt: '2025.11.21. 09:35',
        isAuthor: false,
      },
    ],
  },
  {
    id: 'comment-10',
    applicantId: '5',
    author: '윤서준',
    content: '디자인 공모전 수상 경력이 눈에 띄네요.',
    createdAt: '2025.11.21. 10:15',
    isAuthor: false,
  },
  {
    id: 'comment-11',
    applicantId: '5',
    author: '박소연',
    content: 'Figma 실력이 우수하신 것 같아요. 협업 시 큰 도움이 될 것 같습니다.',
    createdAt: '2025.11.21. 11:00',
    isAuthor: false,
  },

  // 강지원 (id: 6) - 2개 댓글
  {
    id: 'comment-12',
    applicantId: '6',
    author: '이준혁',
    content: '데이터 분석 능력이 좋으시네요.',
    createdAt: '2025.11.17. 14:50',
    isAuthor: false,
  },
  {
    id: 'comment-13',
    applicantId: '6',
    author: '최서윤',
    content: 'Python과 SQL 활용 경험이 많으시군요.',
    createdAt: '2025.11.17. 15:30',
    isAuthor: false,
    replies: [
      {
        id: 'reply-4',
        author: '김동현',
        content: '통계학 지식도 있으셔서 데이터 프로젝트에 적합할 것 같아요.',
        createdAt: '2025.11.17. 15:35',
        isAuthor: false,
      },
    ],
  },
];