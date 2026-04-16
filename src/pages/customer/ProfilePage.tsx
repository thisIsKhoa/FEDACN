import React, { useState, useMemo } from 'react';
import { FiUser, FiBriefcase, FiGlobe, FiMail, FiPhone, FiLink, FiEye, FiEyeOff, FiTag, FiStar, FiCheck } from 'react-icons/fi';
import { profiles, profileSkills, profileInterests, tags, branches } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const profile = profiles.find(p => p.user_id === user?.id);
  const mySkills = profileSkills.filter(ps => ps.profile_user_id === user?.id);
  const myInterests = profileInterests.filter(pi => pi.profile_user_id === user?.id);

  const [bio, setBio] = useState(profile?.bio || '');
  const [profession, setProfession] = useState(profile?.profession || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [contactPublic, setContactPublic] = useState(profile?.contact_public ?? false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const renderStars = (level: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <FiStar key={i} className={`h-3.5 w-3.5 ${i <= level ? 'fill-[var(--state-warning)] text-[var(--state-warning)]' : 'text-[var(--text-tertiary)]'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <p className="section-title">Hồ sơ cá nhân</p>
        <h1 className="section-heading">Thông tin của bạn</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Cập nhật thông tin để kết nối với cộng đồng co-working</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="section-card">
            <h2 className="font-semibold flex items-center gap-2"><FiUser className="h-4 w-4 text-[var(--brand-primary)]" /> Thông tin cơ bản</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Họ tên</label>
                <input type="text" value={user?.fullName || ''} readOnly className="input-field mt-1 bg-[var(--bg-surface-hover)]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Email</label>
                <input type="email" value={user?.email || ''} readOnly className="input-field mt-1 bg-[var(--bg-surface-hover)]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Nghề nghiệp</label>
                <input type="text" value={profession} onChange={e => setProfession(e.target.value)} className="input-field mt-1" placeholder="VD: Kỹ sư phần mềm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Công ty</label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="input-field mt-1" placeholder="VD: TechVN" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Giới thiệu bản thân</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="input-field mt-1" placeholder="Chia sẻ về bản thân, kinh nghiệm, mục tiêu..." />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="section-card">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><FiMail className="h-4 w-4 text-[var(--brand-primary)]" /> Liên hệ</h2>
              <button onClick={() => setContactPublic(!contactPublic)}
                className={`btn btn-sm ${contactPublic ? 'btn-primary' : 'btn-secondary'}`}>
                {contactPublic ? <><FiEye className="h-3.5 w-3.5" /> Công khai</> : <><FiEyeOff className="h-3.5 w-3.5" /> Riêng tư</>}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {contactPublic ? 'Thông tin liên hệ sẽ hiển thị cho các thành viên khác' : 'Chỉ bạn mới thấy thông tin liên hệ'}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Email liên hệ</label>
                <input type="email" defaultValue={profile?.contact_email} className="input-field mt-1" /></div>
              <div><label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Số điện thoại</label>
                <input type="tel" defaultValue={profile?.contact_phone} className="input-field mt-1" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Link profile (LinkedIn, Portfolio...)</label>
                <input type="url" defaultValue={profile?.contact_link} className="input-field mt-1" placeholder="https://..." /></div>
            </div>
          </div>

          <button onClick={handleSave} className="btn btn-primary">
            {saved ? <><FiCheck className="h-4 w-4" /> Đã lưu!</> : 'Lưu thay đổi'}
          </button>
        </div>

        {/* Skills & Interests sidebar */}
        <div className="space-y-6">
          <div className="section-card">
            <h2 className="font-semibold flex items-center gap-2"><FiTag className="h-4 w-4 text-[var(--brand-primary)]" /> Kỹ năng</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Mức độ thành thạo (1-5 sao)</p>
            <div className="mt-4 space-y-3">
              {mySkills.map(sk => {
                const tag = tags.find(t => t.id === sk.tag_id);
                return tag ? (
                  <div key={sk.tag_id} className="flex items-center justify-between rounded-xl bg-[var(--bg-surface-hover)] px-4 py-3">
                    <span className="text-sm font-medium">{tag.name}</span>
                    {renderStars(sk.level)}
                  </div>
                ) : null;
              })}
              {mySkills.length === 0 && <p className="text-sm text-[var(--text-secondary)]">Chưa thêm kỹ năng nào</p>}
              <button className="btn btn-secondary btn-sm w-full">+ Thêm kỹ năng</button>
            </div>
          </div>

          <div className="section-card">
            <h2 className="font-semibold flex items-center gap-2"><FiGlobe className="h-4 w-4 text-[var(--brand-primary)]" /> Lĩnh vực quan tâm</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Mức ưu tiên (1-5)</p>
            <div className="mt-4 space-y-3">
              {myInterests.map(int => {
                const tag = tags.find(t => t.id === int.tag_id);
                return tag ? (
                  <div key={int.tag_id} className="flex items-center justify-between rounded-xl bg-[var(--bg-surface-hover)] px-4 py-3">
                    <div>
                      <span className="text-sm font-medium">{tag.name}</span>
                      <span className="ml-2 badge badge-info">{tag.category}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--brand-primary)]">#{int.priority}</span>
                  </div>
                ) : null;
              })}
              {myInterests.length === 0 && <p className="text-sm text-[var(--text-secondary)]">Chưa thêm lĩnh vực quan tâm</p>}
              <button className="btn btn-secondary btn-sm w-full">+ Thêm lĩnh vực</button>
            </div>
          </div>

          <div className="section-card">
            <h2 className="font-semibold">Chi nhánh chính</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              {profile?.primary_branch_id ? branches.find(b => b.id === profile.primary_branch_id)?.name : 'Chưa chọn'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
