import SmartScheduleResponseResultForm from '@/components/form/SmartScheduleResponseResultForm';

export default function SmartScheduleResultPage() {
  return <SmartScheduleResponseResultForm />;
}
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 샘플 데이터
  const scheduleData: DateSchedule[] = [
    {
      date: '9월 1일 (월)',
      slots: [
        {
          time: '9:00',
          applicants: [
            { name: '김민준', school: '건국대', major: '컴퓨터공학과', position: '요리사' },
            { name: '백서준', school: '○○대', major: '화학공학과', position: '일반부원' },
            { name: '오지우', school: '○○대', major: '관광경영학과', position: '조리사' },
          ],
        },
        {
          time: '11:30',
          applicants: [
            { name: '이서연', school: '○○대', major: '사학디자인과', position: '요리사' },
            { name: '조은채', school: '○○대', major: '화학공학과', position: '일반부원' },
            { name: '최민서', school: '○○대', major: '관광경영학과', position: '조리사' },
          ],
        },
        {
          time: '12:00',
          applicants: [
            { name: '최수빈', school: '○○대', major: '사학디자인과', position: '요리사' },
            { name: '황세준', school: '○○대', major: '화학공학과', position: '일반부원' },
            { name: '이도현', school: '○○대', major: '관광경영학과', position: '조리사' },
          ],
        },
      ],
    },
    {
      date: '9월 2일 (화)',
      slots: [
        {
          time: '9:00',
          applicants: [
            { name: '김민준', school: '건국대', major: '컴퓨터공학과', position: '요리사' },
            { name: '백서준', school: '○○대', major: '화학공학과', position: '일반부원' },
            { name: '오지우', school: '○○대', major: '관광경영학과', position: '조리사' },
          ],
        },
        {
          time: '11:30',
          applicants: [
            { name: '이서연', school: '○○대', major: '사학디자인과', position: '요리사' },
            { name: '조은채', school: '○○대', major: '화학공학과', position: '일반부원' },
            { name: '최민서', school: '○○대', major: '관광경영학과', position: '조리사' },
          ],
        },
      ],
    },
  ];

  // 검색 필터링 - 검색어가 있을 때만 필터링, 검색된 지원자가 있는 시간대의 모든 지원자 표시
  const filteredScheduleData = searchQuery 
    ? scheduleData.map(dateSchedule => ({
        ...dateSchedule,
        slots: dateSchedule.slots.filter(slot => 
          slot.applicants.some(applicant => 
            applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      })).filter(dateSchedule => dateSchedule.slots.length > 0)
    : scheduleData;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <Header title="지원자 가능 시간 확인" backTo="/smart-schedule" />
      </div>

      {/* Content */}
      <div className="pb-20">{/* pb-20 = 80px, 네비바 높이(65px)보다 약간 여유있게 */}
        {/* Search Bar */}
        <div className="px-4 pt-4 pb-3">
          <div className="relative">
            <div className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px]">
              <Image src="/icons/search.svg" alt="search" width={13} height={13} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지원자의 이름을 검색하세요."
              className="w-full h-[38px] bg-gray-50 rounded-[5px] pl-[33px] pr-4 text-body-rg text-gray-950 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 검색 결과 없음 */}
        {searchQuery && filteredScheduleData.length === 0 && (
          <div className="flex items-center justify-center py-40">
            <p className="text-body-rg text-gray-950">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Schedule by Date */}
        {filteredScheduleData.map((dateSchedule, dateIndex) => (
          <div key={dateIndex}>
            {/* Date Header */}
            <div className="w-full h-[50px] flex items-center px-[26px] bg-white border-b border-gray-100">
              <span className="text-subtitle-sm-md text-gray-950">{dateSchedule.date}</span>
            </div>

            {/* Time Slots */}
            {dateSchedule.slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="bg-white h-[118px] flex items-center px-[26px] gap-0">
                  {/* Time */}
                  <p className="text-subtitle-rg text-gray-950 w-[60px] flex-shrink-0 mr-[35px]">{slot.time}</p>

                  {/* Applicants Card */}
                  <div className="border-[1.5px] border-gray-200 rounded-[10px] p-[15px] flex flex-col gap-[6px] flex-1 min-w-0 overflow-hidden">
                    {slot.applicants.map((applicant, appIndex) => (
                      <p 
                        key={appIndex} 
                        className={`text-body-sm-rg truncate ${
                          searchQuery && applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
                            ? 'text-primary'
                            : 'text-gray-950'
                        }`}
                      >
                        {applicant.name}({applicant.school}/{applicant.major}/{applicant.position})
                      </p>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
