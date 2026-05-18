import React, { useState } from 'react';
import { FiUser, FiBriefcase, FiMapPin, FiMail, FiPhone, FiGithub, FiLinkedin, FiSettings, FiCheck, FiX, FiInfo, FiUsers, FiStar, FiMessageCircle, FiEyeOff } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';

// MOCK DATA
const MOCK_SKILLS = ['React', 'Node.js', 'UI/UX Design', 'Marketing', 'Data Analysis', 'Python'];
const MOCK_INTERESTS = ['Khởi nghiệp', 'AI', 'Đọc sách', 'Đầu tư', 'Thiền'];

const MOCK_PARTNERS = [
  {
    id: 'p1',
    name: 'Trần Văn Bình',
    profession: 'Senior Frontend Developer',
    company: 'TechCorp',
    avatar: 'B',
    matchScore: 85,
    commonTags: ['React', 'UI/UX Design', 'AI'],
    contactPublic: true,
    email: 'binh.tran@techcorp.com',
    phone: '0901234567',
    bio: 'Đam mê xây dựng các sản phẩm web có trải nghiệm người dùng tuyệt vời.'
  },
  {
    id: 'p2',
    name: 'Lê Ngọc Mai',
    profession: 'Product Manager',
    company: 'Innovate VN',
    avatar: 'M',
    matchScore: 72,
    commonTags: ['UI/UX Design', 'Khởi nghiệp'],
    contactPublic: false,
    email: 'mai.le@innovate.vn',
    phone: '0912345678',
    bio: 'Đang tìm kiếm Co-founder kỹ thuật cho dự án mới trong mảng EdTech.'
  },
  {
    id: 'p3',
    name: 'Phạm Đức Anh',
    profession: 'Data Scientist',
    company: 'AI Solutions',
    avatar: 'A',
    matchScore: 68,
    commonTags: ['AI', 'Python', 'Đầu tư'],
    contactPublic: true,
    email: 'anh.pham@aisolutions.dev',
    phone: '0987654321',
    bio: 'Chuyên gia xử lý dữ liệu và xây dựng mô hình học máy.'
  }
];

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'network'>('profile');
  
  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: 'Tôi là một nhà phát triển phần mềm đang làm việc tự do. Thích tham gia các không gian co-working để kết nối và tìm kiếm cảm hứng.',
    profession: 'Software Engineer',
    company: 'Freelance',
    contactPublic: true
  });
  
  const [skills, setSkills] = useState(['React', 'Node.js', 'AI']);
  const [interests, setInterests] = useState(['Khởi nghiệp', 'Đọc sách']);
  
  const [newTag, setNewTag] = useState('');
  const [tagType, setTagType] = useState<'skill' | 'interest'>('skill');

  // Networking State
  const [selectedPartner, setSelectedPartner] = useState<typeof MOCK_PARTNERS[0] | null>(null);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      e.preventDefault();
      if (tagType === 'skill' && !skills.includes(newTag.trim())) {
        setSkills([...skills, newTag.trim()]);
      } else if (tagType === 'interest' && !interests.includes(newTag.trim())) {
        setInterests([...interests, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (type: 'skill' | 'interest', tag: string) => {
    if (type === 'skill') {
      setSkills(skills.filter(t => t !== tag));
    } else {
      setInterests(interests.filter(t => t !== tag));
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // TODO: Call API to save profile
  };

  return (
    <div className="max-w-6xl mx-auto py-6 pb-20">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 h-48 md:h-64 mb-16 shadow-lg">
        {/* Cover image styling/patterns */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Avatar */}
        <div className="absolute -bottom-12 left-8 md:left-12 flex items-end">
          <div className="h-28 w-28 md:h-32 md:w-32 rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-xl overflow-hidden">
            <span className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {user?.fullName.charAt(0)}
            </span>
          </div>
          <div className="ml-4 mb-12 md:mb-14 text-white drop-shadow-md hidden md:block">
            <h1 className="text-3xl font-bold font-heading">{user?.fullName}</h1>
            <p className="text-blue-100 font-medium opacity-90">{profileData.profession} @ {profileData.company}</p>
          </div>
        </div>
        
        {/* Action button */}
        <div className="absolute top-4 right-4">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md">
            <FiSettings className="mr-2" /> Cài đặt tài khoản
          </Button>
        </div>
      </div>

      {/* Mobile Title (visible only on small screens) */}
      <div className="px-6 mb-8 md:hidden">
        <h1 className="text-2xl font-bold font-heading">{user?.fullName}</h1>
        <p className="text-muted-foreground">{profileData.profession} @ {profileData.company}</p>
      </div>

      {/* Tabs */}
      <div className="flex px-4 md:px-12 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all relative ${
            activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FiUser className="h-4 w-4" /> Hồ sơ của tôi
          {activeTab === 'profile' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all relative ${
            activeTab === 'network' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FiUsers className="h-4 w-4" /> Kết nối & Gợi ý
          {activeTab === 'network' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      <div className="px-4 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ==================== TAB 1: PROFILE ==================== */}
        {activeTab === 'profile' && (
          <>
            {/* Left Col: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold font-heading flex items-center gap-2">
                    <FiInfo className="text-primary" /> Thông tin cơ bản
                  </h2>
                  {!isEditing ? (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Hủy</Button>
                      <Button size="sm" onClick={handleSaveProfile}>Lưu</Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Chức danh</label>
                        <input 
                          type="text" 
                          value={profileData.profession} 
                          onChange={e => setProfileData({...profileData, profession: e.target.value})}
                          className="input-field" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Công ty</label>
                        <input 
                          type="text" 
                          value={profileData.company} 
                          onChange={e => setProfileData({...profileData, company: e.target.value})}
                          className="input-field" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Giới thiệu bản thân (Bio)</label>
                      <textarea 
                        value={profileData.bio} 
                        onChange={e => setProfileData({...profileData, bio: e.target.value})}
                        className="input-field min-h-[100px] resize-y" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-sm">
                    <p className="leading-relaxed text-muted-foreground">{profileData.bio}</p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Chức danh</p>
                        <p className="font-medium flex items-center gap-2"><FiBriefcase className="text-primary/70" /> {profileData.profession}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Công ty</p>
                        <p className="font-medium flex items-center gap-2"><FiMapPin className="text-primary/70" /> {profileData.company}</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-bold font-heading flex items-center gap-2 mb-2">
                  <FiStar className="text-primary" /> Kỹ năng & Sở thích
                </h2>
                <p className="text-sm text-muted-foreground mb-6">Thêm các từ khóa để hệ thống có thể gợi ý những đối tác phù hợp nhất với bạn.</p>
                
                <div className="space-y-6">
                  {/* Skills */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Kỹ năng (Skills)</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                          {tag}
                          <button onClick={() => removeTag('skill', tag)} className="hover:text-blue-900"><FiX /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Sở thích / Lĩnh vực quan tâm</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {interests.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                          {tag}
                          <button onClick={() => removeTag('interest', tag)} className="hover:text-indigo-900"><FiX /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Add new tag */}
                  <div className="pt-4 border-t border-border flex items-center gap-3">
                    <select 
                      value={tagType} 
                      onChange={e => setTagType(e.target.value as any)}
                      className="input-field w-32"
                    >
                      <option value="skill">Kỹ năng</option>
                      <option value="interest">Sở thích</option>
                    </select>
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Nhập từ khóa và nhấn Enter..."
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Col: Preferences & Contacts */}
            <div className="space-y-6">
              <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-bold font-heading mb-4">Mức độ hiển thị</h2>
                
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-background">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Công khai liên hệ</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Cho phép những thành viên khác trong không gian xem thông tin email và số điện thoại của bạn khi họ muốn kết nối.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={profileData.contactPublic}
                      onChange={e => setProfileData({...profileData, contactPublic: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </section>

              <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold font-heading">Thông tin liên hệ</h2>
                  <Button variant="ghost" size="sm">Sửa</Button>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground"><FiMail /></div>
                    <span className="font-medium text-foreground">{user?.email || 'admin@example.com'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground"><FiPhone /></div>
                    <span className="font-medium text-foreground">0912 345 678</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground"><FiLinkedin /></div>
                    <span className="font-medium text-foreground">linkedin.com/in/username</span>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {/* ==================== TAB 2: NETWORKING ==================== */}
        {activeTab === 'network' && (
          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading text-primary flex items-center gap-2">
                  <FiUsers /> Gợi ý kết nối dành cho bạn
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Dựa trên kỹ năng và sở thích bạn đã cập nhật trong hồ sơ.</p>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('profile')}>Cập nhật Kỹ năng</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_PARTNERS.map(partner => (
                <div key={partner.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-primary flex items-center justify-center text-lg font-bold">
                        {partner.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold">{partner.name}</h3>
                        <p className="text-xs text-muted-foreground">{partner.profession}</p>
                      </div>
                    </div>
                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                        {partner.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    "{partner.bio}"
                  </p>

                  <div className="mb-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Điểm chung</p>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.commonTags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setSelectedPartner(partner)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ==================== PARTNER MODAL ==================== */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header Cover */}
            <div className="h-24 bg-gradient-to-r from-blue-100 to-indigo-100 relative">
              <button 
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/50 flex items-center justify-center hover:bg-white"
                onClick={() => setSelectedPartner(null)}
              >
                <FiX />
              </button>
            </div>
            
            <div className="px-6 pb-6 relative">
              {/* Avatar */}
              <div className="h-20 w-20 rounded-2xl bg-white border-4 border-card flex items-center justify-center shadow-sm absolute -top-10 text-3xl font-bold text-primary">
                {selectedPartner.avatar}
              </div>
              
              <div className="pt-12 mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold font-heading">{selectedPartner.name}</h2>
                  <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                    <FiBriefcase className="h-4 w-4" /> {selectedPartner.profession} @ {selectedPartner.company}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-bold border border-green-200">
                  {selectedPartner.matchScore}% Phù hợp
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Giới thiệu</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedPartner.bio}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Điểm chung với bạn</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.commonTags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  {selectedPartner.contactPublic ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold mb-2">Thông tin liên hệ</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground"><FiMail /></div>
                        <a href={`mailto:${selectedPartner.email}`} className="font-medium hover:text-primary transition-colors">{selectedPartner.email}</a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground"><FiPhone /></div>
                        <a href={`tel:${selectedPartner.phone}`} className="font-medium hover:text-primary transition-colors">{selectedPartner.phone}</a>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <Button className="flex-1 gap-2"><FiMessageCircle /> Nhắn tin</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4 rounded-xl bg-muted/50 border border-border">
                      <div className="h-12 w-12 rounded-full bg-card shadow-sm flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                        <FiEyeOff className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1">Liên hệ đang ẩn</h3>
                      <p className="text-xs text-muted-foreground">Người dùng này chưa bật tính năng công khai thông tin liên hệ. Bạn có thể gặp mặt họ trực tiếp tại không gian làm việc.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
