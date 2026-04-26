import React, { useState } from 'react';
import { FiUser, FiGlobe, FiMail, FiEye, FiEyeOff, FiTag, FiStar, FiCheck } from 'react-icons/fi';
import { profiles, profileSkills, profileInterests, tags, branches } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

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
        <FiStar key={i} className={`h-3.5 w-3.5 transition-colors ${i <= level ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hồ sơ cá nhân</p>
        <h1 className="text-xl font-bold font-heading mt-1">Thông tin của bạn</h1>
        <p className="text-sm text-muted-foreground mt-1">Cập nhật thông tin để kết nối với cộng đồng co-working</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <FiUser className="h-3.5 w-3.5 text-primary" />
              </div>
              Thông tin cơ bản
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Họ tên</label>
                <input type="text" value={user?.fullName || ''} readOnly className="input-field mt-1.5 bg-muted" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                <input type="email" value={user?.email || ''} readOnly className="input-field mt-1.5 bg-muted" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nghề nghiệp</label>
                <input type="text" value={profession} onChange={e => setProfession(e.target.value)} className="input-field mt-1.5" placeholder="VD: Kỹ sư phần mềm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Công ty</label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="input-field mt-1.5" placeholder="VD: TechVN" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giới thiệu bản thân</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="input-field mt-1.5" placeholder="Chia sẻ về bản thân, kinh nghiệm, mục tiêu..." />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <FiMail className="h-3.5 w-3.5 text-primary" />
                </div>
                Liên hệ
              </h2>
              <Button
                variant={contactPublic ? "default" : "outline"}
                size="sm"
                onClick={() => setContactPublic(!contactPublic)}
              >
                {contactPublic ? <><FiEye className="h-3.5 w-3.5" /> Công khai</> : <><FiEyeOff className="h-3.5 w-3.5" /> Riêng tư</>}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {contactPublic ? 'Thông tin liên hệ sẽ hiển thị cho các thành viên khác' : 'Chỉ bạn mới thấy thông tin liên hệ'}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="text-xs font-semibold text-muted-foreground uppercase">Email liên hệ</label>
                <input type="email" defaultValue={profile?.contact_email} className="input-field mt-1.5" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground uppercase">Số điện thoại</label>
                <input type="tel" defaultValue={profile?.contact_phone} className="input-field mt-1.5" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-semibold text-muted-foreground uppercase">Link profile (LinkedIn, Portfolio...)</label>
                <input type="url" defaultValue={profile?.contact_link} className="input-field mt-1.5" placeholder="https://..." /></div>
            </div>
          </div>

          <Button onClick={handleSave} className="shadow-md shadow-primary/25">
            {saved ? <><FiCheck className="h-4 w-4" /> Đã lưu!</> : 'Lưu thay đổi'}
          </Button>
        </div>

        {/* Skills & Interests sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <FiTag className="h-3.5 w-3.5 text-primary" />
              </div>
              Kỹ năng
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Mức độ thành thạo (1-5 sao)</p>
            <div className="mt-4 space-y-2">
              {mySkills.map(sk => {
                const tag = tags.find(t => t.id === sk.tag_id);
                return tag ? (
                  <div key={sk.tag_id} className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 transition-colors hover:bg-muted">
                    <span className="text-sm font-medium">{tag.name}</span>
                    {renderStars(sk.level)}
                  </div>
                ) : null;
              })}
              {mySkills.length === 0 && <p className="text-sm text-muted-foreground">Chưa thêm kỹ năng nào</p>}
              <Button variant="outline" size="sm" className="w-full">+ Thêm kỹ năng</Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <FiGlobe className="h-3.5 w-3.5 text-primary" />
              </div>
              Lĩnh vực quan tâm
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Mức ưu tiên (1-5)</p>
            <div className="mt-4 space-y-2">
              {myInterests.map(int => {
                const tag = tags.find(t => t.id === int.tag_id);
                return tag ? (
                  <div key={int.tag_id} className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{tag.name}</span>
                      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400">{tag.category}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">#{int.priority}</span>
                  </div>
                ) : null;
              })}
              {myInterests.length === 0 && <p className="text-sm text-muted-foreground">Chưa thêm lĩnh vực quan tâm</p>}
              <Button variant="outline" size="sm" className="w-full">+ Thêm lĩnh vực</Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold">Chi nhánh chính</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {profile?.primary_branch_id ? branches.find(b => b.id === profile.primary_branch_id)?.name : 'Chưa chọn'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
